#!/usr/bin/env python3
"""
CBP Smart Wall Map scraper — v2
Intercepts ArcGIS feature service requests made by the CBP Smart Wall Map
and saves the route GeoJSON for each wall status category.

Usage:
    pip install playwright requests
    playwright install chromium
    python scraper/scrape_cbp_wall.py

    # Skip the browser entirely once you have the service URL:
    python scraper/scrape_cbp_wall.py --direct https://.../FeatureServer

Output:
    scraper/output/wall_features.json   — raw features grouped by status
    scraper/output/wall_routes.ts       — ready-to-paste TypeScript
    scraper/output/debug_urls.txt       — every URL the browser saw (for debugging)
    scraper/output/screenshot.png       — screenshot after page load
"""

import asyncio
import json
import re
import sys
import time
from pathlib import Path

import requests
from playwright.async_api import async_playwright, Response

# ── Config ────────────────────────────────────────────────────────────────────
CBP_URL = "https://www.cbp.gov/border-security/along-us-borders/smart-wall-map"
ARCGIS_PATTERN = re.compile(r"/(FeatureServer|MapServer)/\d+/query", re.IGNORECASE)
FEATURE_SERVER_PATTERN = re.compile(r"(https?://[^\s?]+/(FeatureServer|MapServer))", re.IGNORECASE)

OUT_DIR = Path(__file__).parent / "output"

STATUS_FIELDS = ["STATUS", "Status", "status", "WALL_STATUS", "TYPE", "Type", "CATEGORY"]

STATUS_MAP = {
    "planned": "planned",
    "plan": "planned",
    "awarded": "awarded",
    "award": "awarded",
    "design": "awarded",
    "under construction": "under_construction",
    "construction": "under_construction",
    "underway": "under_construction",
    "completed": "completed",
    "complete": "completed",
    "done": "completed",
    "existing primary": "existing_primary",
    "primary": "existing_primary",
    "existing": "existing_primary",
    "existing secondary": "existing_secondary",
    "secondary": "existing_secondary",
    "detection technology": "detection_technology",
    "technology": "detection_technology",
    "detection": "detection_technology",
}

COLOR_MAP = {
    "existing_primary":     ("#A0A0A0", False),
    "existing_secondary":   ("#C8BEB4", False),
    "planned":              ("#FF9500", True),
    "awarded":              ("#FFD44A", False),
    "under_construction":   ("#E06C1C", False),
    "completed":            ("#5EA34B", False),
    "detection_technology": ("#6FA8DC", True),
    "unknown":              ("#888888", True),
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def normalize_status(raw: str) -> str:
    key = raw.strip().lower()
    return STATUS_MAP.get(key, key.replace(" ", "_"))


def extract_segments(geom: dict) -> list[list[list[float]]]:
    """Return a list of segments, each segment = [[lat, lon], ...].

    Each ArcGIS path / GeoJSON ring becomes its own segment so Leaflet never
    draws a straight connector line between disconnected pieces.
    """
    if not geom:
        return []

    # ArcGIS Polyline  {"paths": [[[lon, lat], ...]]}
    if "paths" in geom:
        out = []
        for path in geom["paths"]:
            seg = [[round(pt[1], 6), round(pt[0], 6)] for pt in path]
            if len(seg) >= 2:
                out.append(seg)
        return out

    gtype = geom.get("type", "")
    if gtype == "LineString":
        seg = [[round(p[1], 6), round(p[0], 6)] for p in geom.get("coordinates", [])]
        return [seg] if len(seg) >= 2 else []
    if gtype == "MultiLineString":
        out = []
        for line in geom.get("coordinates", []):
            seg = [[round(p[1], 6), round(p[0], 6)] for p in line]
            if len(seg) >= 2:
                out.append(seg)
        return out
    return []


# Fields to drop from popup metadata (internal ArcGIS bookkeeping)
_SKIP_META = {
    "OBJECTID", "ObjectID", "objectid",
    "Shape__Length", "Shape_Length", "Shape__Area",
    "GlobalID", "globalid",
    "created_date", "last_edited_date", "Editor", "Creator",
}


def parse_feature_response(body: str, url: str) -> dict[str, list]:
    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        return {}
    features = data.get("features", [])
    if not features:
        return {}
    print(f"  → {len(features)} features  ({url.split('?')[0][-80:]})")
    grouped: dict[str, list] = {}
    for feat in features:
        attrs = feat.get("attributes") or feat.get("properties") or {}
        geom  = feat.get("geometry") or {}
        status_raw = None
        for field in STATUS_FIELDS:
            val = attrs.get(field)
            if val:
                status_raw = str(val)
                break
        if not status_raw:
            for v in attrs.values():
                if isinstance(v, str) and v.strip().lower() in STATUS_MAP:
                    status_raw = v
                    break
        status = normalize_status(status_raw or "unknown")

        # Collect clean metadata for the popup
        meta: dict = {}
        for k, v in attrs.items():
            if k in _SKIP_META:
                continue
            if v is None or v == "" or v == 0:
                continue
            if isinstance(v, (str, int, float)):
                meta[k] = v

        for seg in extract_segments(geom):
            grouped.setdefault(status, []).append({"coords": seg, "meta": meta})
    return grouped


def routes_to_typescript(all_routes: dict[str, list]) -> str:
    lines = [
        "// Auto-generated by scraper/scrape_cbp_wall.py",
        "// Source: CBP Smart Wall Map - ArcGIS Feature Service",
        "",
        "export interface WallSegmentMeta {",
        "  [key: string]: string | number | null;",
        "}",
        "",
        "export interface WallSegment {",
        "  coords: [number, number][];",
        "  meta: WallSegmentMeta;",
        "}",
        "",
        "export interface WallRouteLayer {",
        "  status: string;",
        "  color: string;",
        "  dashed: boolean;",
        "  segments: WallSegment[];",
        "}",
        "",
        "export const WALL_ROUTE_LAYERS: WallRouteLayer[] = [",
    ]
    for status, seg_list in all_routes.items():
        color, dashed = COLOR_MAP.get(status, ("#888888", True))
        valid = [s for s in seg_list if len(s["coords"]) >= 2]
        if not valid:
            continue
        lines += [
            "  {",
            f"    status: {json.dumps(status)},",
            f"    color: {json.dumps(color)},",
            f"    dashed: {'true' if dashed else 'false'},",
            "    segments: [",
        ]
        for item in valid:
            pts = ", ".join(f"[{lat}, {lon}]" for lat, lon in item["coords"])
            meta_str = json.dumps(item["meta"])
            lines.append(f"      {{ coords: [{pts}], meta: {meta_str} }},")
        lines += ["    ],", "  },"]
    lines.append("];")
    return "\n".join(lines)


def save_outputs(all_routes: dict[str, list]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    total = sum(len(v) for v in all_routes.values())
    # all_routes values are now lists of {coords, meta} dicts
    print(f"\n✓ {total} route segments across statuses: {list(all_routes.keys())}")

    raw = OUT_DIR / "wall_features.json"
    raw.write_text(json.dumps(all_routes, indent=2), encoding="utf-8")
    print(f"  Saved → {raw}")

    ts = OUT_DIR / "wall_routes.ts"
    ts.write_text(routes_to_typescript(all_routes), encoding="utf-8")
    print(f"  Saved → {ts}")
    print("\nNext: copy wall_routes.ts into src/lib/ and update ImpactMapClient.tsx.")


# ── Direct REST API mode ───────────────────────────────────────────────────────

def query_feature_server(base_url: str) -> dict[str, list]:
    """
    Query an ArcGIS FeatureServer/MapServer directly (no browser).
    base_url should end with .../FeatureServer or .../MapServer
    """
    base_url = base_url.rstrip("/")
    # Get layer list
    info_url = f"{base_url}?f=json"
    print(f"Fetching service info: {info_url}")
    resp = requests.get(info_url, timeout=30)
    resp.raise_for_status()
    info = resp.json()

    layers = info.get("layers", [])
    if not layers:
        # Maybe this is already a specific layer URL
        layers = [{"id": 0}]

    all_routes: dict[str, list] = {}

    for layer in layers:
        lid = layer.get("id", 0)
        layer_name = layer.get("name", f"layer_{lid}")
        query_url = f"{base_url}/{lid}/query"
        params = {
            "where": "1=1",
            "outFields": "*",
            "geometryType": "esriGeometryPolyline",
            "returnGeometry": "true",
            "f": "geojson",
            "resultOffset": 0,
            "resultRecordCount": 2000,
        }
        print(f"  Querying layer {lid} '{layer_name}'…")
        try:
            r = requests.get(query_url, params=params, timeout=60)
            r.raise_for_status()
            grouped = parse_feature_response(r.text, query_url)
            for status, routes in grouped.items():
                all_routes.setdefault(status, []).extend(routes)
        except Exception as e:
            print(f"    ✗ {e}")

    return all_routes


# ── Browser scrape mode ────────────────────────────────────────────────────────

async def scrape_browser() -> dict[str, list]:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    all_routes: dict[str, list] = {}
    all_urls: list[str] = []
    service_base_urls: set[str] = set()

    async with async_playwright() as p:
        # headless=False bypasses Cloudflare bot detection; the user will see a
        # Chrome window open briefly — that is expected.
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            viewport={"width": 1400, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        page = await context.new_page()

        async def on_response(response: Response):
            url = response.url
            all_urls.append(url)

            # Collect FeatureServer base URLs for potential direct re-query
            m = FEATURE_SERVER_PATTERN.search(url)
            if m:
                service_base_urls.add(m.group(1))

            if not ARCGIS_PATTERN.search(url):
                return
            if response.status != 200:
                return
            try:
                body = await response.text()
            except Exception:
                return
            print(f"Captured ArcGIS: {url[:120]}")
            grouped = parse_feature_response(body, url)
            for status, routes in grouped.items():
                all_routes.setdefault(status, []).extend(routes)

        page.on("response", on_response)

        print(f"\nNavigating to {CBP_URL} …")
        print("(A Chrome window will open — this is normal)\n")
        try:
            await page.goto(CBP_URL, wait_until="domcontentloaded", timeout=60_000)
        except Exception as e:
            print(f"Navigation warning: {e}")

        print("Waiting up to 45 s for map data…")
        await asyncio.sleep(45)

        # Screenshot for debugging
        try:
            ss = OUT_DIR / "screenshot.png"
            await page.screenshot(path=str(ss), full_page=False)
            print(f"Screenshot → {ss}")
        except Exception:
            pass

        await browser.close()

    # Save debug URL list
    debug = OUT_DIR / "debug_urls.txt"
    debug.write_text("\n".join(all_urls), encoding="utf-8")
    print(f"All URLs seen ({len(all_urls)}) → {debug}")

    if service_base_urls:
        print(f"\nFeatureServer base URLs found:")
        for u in service_base_urls:
            print(f"  {u}")
        svc_file = OUT_DIR / "service_urls.txt"
        svc_file.write_text("\n".join(service_base_urls), encoding="utf-8")
        print(f"  Saved → {svc_file}")

    return all_routes, service_base_urls


# ── Entry point ───────────────────────────────────────────────────────────────

async def main():
    # --direct <url>  →  skip the browser, query ArcGIS REST API directly
    if "--direct" in sys.argv:
        idx = sys.argv.index("--direct")
        if idx + 1 >= len(sys.argv):
            print("Usage: python scrape_cbp_wall.py --direct <FeatureServer URL>")
            sys.exit(1)
        base_url = sys.argv[idx + 1]
        print(f"Direct REST mode: {base_url}")
        all_routes = query_feature_server(base_url)
    else:
        print("Browser intercept mode (headed Chrome)…")
        all_routes, service_base_urls = await scrape_browser()

        if not all_routes and service_base_urls:
            print("\nNo features captured via intercept; trying direct REST query…")
            for url in service_base_urls:
                routes = query_feature_server(url)
                for status, segs in routes.items():
                    all_routes.setdefault(status, []).extend(segs)

    if not all_routes:
        print("\n⚠  No route data captured.")
        print("   Next steps:")
        print("   1. Open scraper/output/debug_urls.txt and search for 'FeatureServer'")
        print("   2. Copy that base URL and run:")
        print("      python scraper/scrape_cbp_wall.py --direct <url>")
        print("   3. Or open scraper/output/screenshot.png to see what the browser saw.")
        return

    save_outputs(all_routes)


if __name__ == "__main__":
    asyncio.run(main())
