"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import {
  BBT4_REMOVED,
  BBT5_REMOVED,
  SDC2_REMOVED,
  ELC2_REMOVED,
} from "@/lib/removed_segments";
import { WALL_ROUTE_LAYERS } from "@/lib/wall_routes";

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

// Region configs: center, zoom, and which current segments to show
const REGIONS = {
  texas: {
    center: [29.45, -103.1] as [number, number],
    zoom: 7,
    removed: [...BBT4_REMOVED, ...BBT5_REMOVED],
    // Current planned segments in BBT area (filter by bbox)
    filterBbox: { minLat: 28.5, maxLat: 30.5, minLon: -104.5, maxLon: -101 },
  },
  california: {
    center: [32.62, -115.8] as [number, number],
    zoom: 9,
    removed: [...SDC2_REMOVED, ...ELC2_REMOVED],
    filterBbox: { minLat: 32.4, maxLat: 32.8, minLon: -117.2, maxLon: -114.5 },
  },
} as const;

type Region = keyof typeof REGIONS;

/** Get current planned segments that fall within a bounding box */
function getCurrentPlannedInBbox(bbox: {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}) {
  const planned = WALL_ROUTE_LAYERS.find((l) => l.status === "planned");
  if (!planned) return [];
  return planned.segments.filter((seg) =>
    seg.coords.some(
      ([lat, lon]) =>
        lat >= bbox.minLat &&
        lat <= bbox.maxLat &&
        lon >= bbox.minLon &&
        lon <= bbox.maxLon
    )
  );
}

function addTileLayer(map: L.Map) {
  L.tileLayer(TILE_URL, {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  }).addTo(map);
}

function addRouteLines(
  map: L.Map,
  segments: [number, number][][],
  color: string,
  dashed: boolean
) {
  return segments.map((coords) =>
    L.polyline(coords, {
      color,
      weight: 3,
      dashArray: dashed ? "8, 6" : undefined,
      opacity: 0.9,
      interactive: false,
    }).addTo(map)
  );
}

export default function BeforeAfterMaps({ region }: { region: Region }) {
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);
  const beforeMapRef = useRef<L.Map | null>(null);
  const afterMapRef = useRef<L.Map | null>(null);

  const config = REGIONS[region];

  // Initialize maps
  useEffect(() => {
    if (!beforeRef.current || !afterRef.current) return;

    // Clear any existing maps
    beforeRef.current.innerHTML = "";
    afterRef.current.innerHTML = "";

    const beforeMap = L.map(beforeRef.current, {
      center: config.center,
      zoom: config.zoom,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      keyboard: false,
    });

    const afterMap = L.map(afterRef.current, {
      center: config.center,
      zoom: config.zoom,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      keyboard: false,
    });

    addTileLayer(beforeMap);
    addTileLayer(afterMap);

    // "Before" map: show the removed segments + current planned
    const currentPlanned = getCurrentPlannedInBbox(config.filterBbox);
    addRouteLines(
      beforeMap,
      currentPlanned.map((s) => s.coords),
      "#FF9500",
      true
    );
    addRouteLines(beforeMap, config.removed as [number, number][][], "#FF9500", true);

    // "After" map: only show current planned (removed segments are gone)
    addRouteLines(
      afterMap,
      currentPlanned.map((s) => s.coords),
      "#FF9500",
      true
    );

    beforeMapRef.current = beforeMap;
    afterMapRef.current = afterMap;

    // Sync map movement (in case we enable dragging later)
    const syncMaps = () => {
      afterMap.setView(beforeMap.getCenter(), beforeMap.getZoom(), {
        animate: false,
      });
    };
    beforeMap.on("move", syncMaps);

    return () => {
      beforeMap.remove();
      afterMap.remove();
      beforeMapRef.current = null;
      afterMapRef.current = null;
    };
  }, [region, config]);

  // Slider drag handling
  const handleMove = useCallback(
    (clientX: number) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSliderPos(pct);
    },
    []
  );

  const handlePointerDown = useCallback(() => {
    dragging.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => handleMove(e.clientX);
    const onUp = () => handlePointerUp();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [handleMove, handlePointerUp]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] sm:aspect-[2/1] select-none overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {/* "After" map — full width, always visible underneath */}
      <div ref={afterRef} className="absolute inset-0 z-0" />

      {/* "Before" map — clipped to left side of slider */}
      <div
        className="absolute inset-0 z-10"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <div ref={beforeRef} className="absolute inset-0" />
      </div>

      {/* Labels */}
      <div className="absolute top-2.5 left-3 z-20 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-taupe-300 uppercase tracking-wider pointer-events-none">
        Before
      </div>
      <div className="absolute top-2.5 right-3 z-20 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-taupe-300 uppercase tracking-wider pointer-events-none">
        After
      </div>

      {/* Slider line + handle */}
      <div
        ref={sliderRef}
        className="absolute top-0 bottom-0 z-30 cursor-ew-resize"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        onPointerDown={handlePointerDown}
      >
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center cursor-ew-resize">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="text-taupe-800"
          >
            <path
              d="M4 3L1 7L4 11M10 3L13 7L10 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
