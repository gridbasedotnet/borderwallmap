#!/usr/bin/env python3
"""
CBP Smart Wall Map scraper
Intercepts ArcGIS feature service requests made by the CBP Smart Wall Map
and saves the route GeoJSON for each wall status category.

Usage:
    pip install playwright
    playwright install chromium
    python3 scrape_cbp_wall.py

Output:
    scraper/output/wall_features.json   — raw features grouped by status
    scraper/output/wall_routes.ts       — ready-to-paste TypeScript for ImpactMapClient.tsx
"""

import asyncio
import json
import re
import os
from pathlib import Path
from playwright.async_api import async_playwright, Request, Response

CBP_URL = "https://www.cbp.gov/border-security/along-us-borders/smart-wall-map"

# ArcGIS feature service requests look like:
#   .../FeatureServer/0/query?...
#   .../MapServer/0/query?...
ARCGIS_PATTERN = re.compile(r"/(FeatureServer|MapServer)/\d+/query", re.IGNORECASE)

# Status field names to try (ArcGIS layers use different field names)
STATUS_FIELDS = ["STATUS", "Status", "status", "WALL_STATUS", "TYPE", "Type"]

# Map raw status values → legend categories
STATUS_MAP = {
    # Planned
    "planned": "planned",
    "plan": "planned",
    # Awarded
    "awarded": "awarded",
    "award": "awarded",
    "design": "awarded",
    # Under Construction
    "under construction": "under_construction",
    "construction": "under_construction",
    "underway": "under_construction",
    # Completed
    "completed": "completed",
    "complete": "completed",
    "done": "completed",
    # Existing primary
    "existing primary": "existing_primary",
    "primary": "existing_primary",
    "existing": "existing_primary",
    # Existing secondary
    "existing secondary": "existing_secondary",
    "secondary": "existing_secondary",
    # Detection technology
    "detection technology": "detection_technology",
    "technology": "detection_technology",
    "detection": "detection_technology",
}


def normalize_status(raw: str) -> str:
    key = raw.strip().lower()
    return STATUS_MAP.get(key, key.replace(" ", "_"))


def extract_coords_from_feature(geom: dict) -> list[list[float]] | None:
    """Extract a flat list of [lat, lon] pairs from an ArcGIS or GeoJSON geometry."""
    gtype = geom.get("type") or geom.get("geometry", {}).get("type", "")

    # ArcGIS Polyline: {"paths": [[[lon, lat], ...]]}
    if "paths" in geom:
        coords = []
        for path in geom["paths"]:
            for pt in path:
                coords.append([round(pt[1], 6), round(pt[0], 6)])  # → [lat, lon]
        return coords if coords else None

    # GeoJSON LineString
    if gtype == "LineString":
        pts = geom.get("coordinates", [])
        return [[round(p[1], 6), round(p[0], 6)] for p in pts]

    # GeoJSON MultiLineString
    if gtype == "MultiLineString":
        coords = []
        for line in geom.get("coordinates", []):
            coords.extend([[round(p[1], 6), round(p[0], 6)] for p in line])
        return coords if coords else None

    return None


def parse_arcgis_response(body: str, url: str) -> dict[str, list]:
    """Parse an ArcGIS feature query response into {status: [[lat,lon],...]} groups."""
    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        return {}

    # Could be ArcGIS JSON (has "features" key) or GeoJSON
    features = data.get("features", [])
    if not features:
        return {}

    print(f"  → {len(features)} features from {url.split('?')[0].split('/')[-3:]}")

    grouped: dict[str, list] = {}

    for feat in features:
        attrs = feat.get("attributes") or feat.get("properties") or {}
        geom = feat.get("geometry") or {}

        # Find the status value
        status_raw = None
        for field in STATUS_FIELDS:
            val = attrs.get(field)
            if val:
                status_raw = str(val)
                break

        if not status_raw:
            # Try to infer from any field containing recognizable keywords
            for v in attrs.values():
                if isinstance(v, str) and v.lower() in STATUS_MAP:
                    status_raw = v
                    break

        if not status_raw:
            status_raw = "unknown"

        status = normalize_status(status_raw)
        coords = extract_coords_from_feature(geom)

        if coords:
            grouped.setdefault(status, []).append(coords)

    return grouped


def routes_to_typescript(all_routes: dict[str, list[list[list[float]]]]) -> str:
    """Render the scraped routes as TypeScript source to paste into ImpactMapClient.tsx."""

    COLOR_MAP = {
        "existing_primary":    ("#A0A0A0", False),
        "existing_secondary":  ("#C8BEB4", False),
        "planned":             ("#FF9500", True),
        "awarded":             ("#FFD44A", False),
        "under_construction":  ("#E06C1C", False),
        "completed":           ("#5EA34B", False),
        "detection_technology":("#6FA8DC", True),
        "unknown":             ("#888888", True),
    }

    lines = [
        "// Auto-generated by scraper/scrape_cbp_wall.py",
        "// Source: CBP Smart Wall Map (cbp.gov/border-security/along-us-borders/smart-wall-map)",
        "",
        "export interface WallRouteLayer {",
        "  status: string;",
        "  color: string;",
        "  dashed: boolean;",
        "  routes: [number, number][][];",
        "}",
        "",
        "export const WALL_ROUTE_LAYERS: WallRouteLayer[] = [",
    ]

    for status, route_list in all_routes.items():
        color, dashed = COLOR_MAP.get(status, ("#888888", True))
        # Deduplicate and filter trivial segments
        non_trivial = [r for r in route_list if len(r) >= 2]
        if not non_trivial:
            continue

        lines.append(f"  {{")
        lines.append(f"    status: {json.dumps(status)},")
        lines.append(f"    color: {json.dumps(color)},")
        lines.append(f"    dashed: {'true' if dashed else 'false'},")
        lines.append(f"    routes: [")
        for route in non_trivial:
            pts = ", ".join(f"[{lat}, {lon}]" for lat, lon in route)
            lines.append(f"      [{pts}],")
        lines.append(f"    ],")
        lines.append(f"  }},")

    lines.append("];")
    return "\n".join(lines)


async def run():
    out_dir = Path(__file__).parent / "output"
    out_dir.mkdir(parents=True, exist_ok=True)

    all_routes: dict[str, list] = {}
    captured_urls: list[str] = []

    print("Launching browser…")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1400, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        page = await context.new_page()

        # ── Intercept responses ──────────────────────────────────────────────
        async def on_response(response: Response):
            url = response.url
            if not ARCGIS_PATTERN.search(url):
                return
            if response.status != 200:
                return
            try:
                body = await response.text()
            except Exception:
                return

            print(f"Captured: {url[:120]}")
            captured_urls.append(url)

            grouped = parse_arcgis_response(body, url)
            for status, route_list in grouped.items():
                all_routes.setdefault(status, []).extend(route_list)

        page.on("response", on_response)

        # ── Navigate ─────────────────────────────────────────────────────────
        print(f"\nNavigating to {CBP_URL} …")
        await page.goto(CBP_URL, wait_until="domcontentloaded", timeout=60_000)

        # Wait for the ArcGIS Experience Builder iframe / map to initialise.
        # The map makes XHR requests after page load, so we wait generously.
        print("Waiting for map data to load (up to 30 s)…")
        await asyncio.sleep(30)

        # Try scrolling / panning to trigger any lazy-loading of additional sectors
        try:
            await page.evaluate(
                """() => {
                    const frames = document.querySelectorAll('iframe');
                    frames.forEach(f => {
                        try { f.contentWindow.scrollBy(100, 0); } catch(e) {}
                    });
                }"""
            )
            await asyncio.sleep(5)
        except Exception:
            pass

        await browser.close()

    # ── Write output ─────────────────────────────────────────────────────────
    if not all_routes:
        print("\n⚠  No ArcGIS feature data was captured.")
        print("   The map may be behind Cloudflare or require a different approach.")
        print(f"   URLs seen: {captured_urls or 'none'}")
        return

    print(f"\n✓ Captured {sum(len(v) for v in all_routes.values())} route segments")
    print(f"  Statuses found: {list(all_routes.keys())}")

    # Raw JSON
    raw_path = out_dir / "wall_features.json"
    with open(raw_path, "w") as f:
        json.dump(all_routes, f, indent=2)
    print(f"  Saved raw data → {raw_path}")

    # TypeScript
    ts_path = out_dir / "wall_routes.ts"
    with open(ts_path, "w") as f:
        f.write(routes_to_typescript(all_routes))
    print(f"  Saved TypeScript → {ts_path}")
    print("\nNext step: copy wall_routes.ts into src/lib/ and update ImpactMapClient.tsx.")


if __name__ == "__main__":
    asyncio.run(run())
