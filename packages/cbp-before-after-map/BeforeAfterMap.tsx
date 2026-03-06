"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  BBT4_REMOVED,
  BBT5_REMOVED,
  SDC2_REMOVED,
  ELC2_REMOVED,
  CURRENT_PLANNED_SEGMENTS,
} from "./data";

// ─── Types ──────────────────────────────────────────────────────────────────

export type Region = "texas" | "california";

export interface BeforeAfterMapProps {
  /** Which region to display. Default: "texas" */
  region?: Region;
  /** Aspect ratio CSS class. Default: "aspect-[16/9]" */
  aspectClass?: string;
  /** Route color (hex). Default: "#FF9500" */
  routeColor?: string;
  /** Tile URL template. Default: CARTO dark */
  tileUrl?: string;
  /** "Before" label text. Default: "Before" */
  beforeLabel?: string;
  /** "After" label text. Default: "After" */
  afterLabel?: string;
}

// ─── Region configs ─────────────────────────────────────────────────────────

const REGIONS = {
  texas: {
    center: [29.45, -103.1] as [number, number],
    zoom: 7,
    removed: [...BBT4_REMOVED, ...BBT5_REMOVED],
    filterBbox: { minLat: 28.5, maxLat: 30.5, minLon: -104.5, maxLon: -101 },
  },
  california: {
    center: [32.62, -115.8] as [number, number],
    zoom: 9,
    removed: [...SDC2_REMOVED, ...ELC2_REMOVED],
    filterBbox: {
      minLat: 32.4,
      maxLat: 32.8,
      minLon: -117.2,
      maxLon: -114.5,
    },
  },
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function getPlannedInBbox(bbox: {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}) {
  return CURRENT_PLANNED_SEGMENTS.filter((seg) =>
    seg.some(
      ([lat, lon]) =>
        lat >= bbox.minLat &&
        lat <= bbox.maxLat &&
        lon >= bbox.minLon &&
        lon <= bbox.maxLon
    )
  );
}

function addRouteLines(
  map: L.Map,
  segments: [number, number][][],
  color: string,
  dashed: boolean
) {
  segments.forEach((coords) =>
    L.polyline(coords, {
      color,
      weight: 3,
      dashArray: dashed ? "8, 6" : undefined,
      opacity: 0.9,
      interactive: false,
    }).addTo(map)
  );
}

// ─── Default styles (inline, no Tailwind dependency) ────────────────────────

const containerStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  userSelect: "none",
  overflow: "hidden",
  touchAction: "none",
};

const labelStyle: React.CSSProperties = {
  position: "absolute",
  top: 10,
  zIndex: 20,
  padding: "3px 8px",
  borderRadius: 6,
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  fontSize: 10,
  fontWeight: 600,
  color: "rgba(255,255,255,0.65)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  pointerEvents: "none" as const,
};

const sliderLineStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: 1,
  background: "rgba(255,255,255,0.6)",
};

const handleStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "ew-resize",
};

// ─── Component ──────────────────────────────────────────────────────────────

const DEFAULT_TILE =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export default function BeforeAfterMap({
  region = "texas",
  aspectClass,
  routeColor = "#FF9500",
  tileUrl = DEFAULT_TILE,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterMapProps) {
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);

  const config = REGIONS[region];

  // ── Initialize Leaflet maps ───────────────────────────────────────────
  useEffect(() => {
    if (!beforeRef.current || !afterRef.current) return;

    beforeRef.current.innerHTML = "";
    afterRef.current.innerHTML = "";

    const mapOpts: L.MapOptions = {
      center: config.center,
      zoom: config.zoom,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      keyboard: false,
    };

    const beforeMap = L.map(beforeRef.current, mapOpts);
    const afterMap = L.map(afterRef.current, mapOpts);

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(beforeMap);
    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(afterMap);

    const currentPlanned = getPlannedInBbox(config.filterBbox);

    // "Before": current planned + removed
    addRouteLines(
      beforeMap,
      currentPlanned,
      routeColor,
      true
    );
    addRouteLines(
      beforeMap,
      config.removed as [number, number][][],
      routeColor,
      true
    );

    // "After": only current planned
    addRouteLines(
      afterMap,
      currentPlanned,
      routeColor,
      true
    );

    return () => {
      beforeMap.remove();
      afterMap.remove();
    };
  }, [region, config, routeColor, tileUrl]);

  // ── Slider drag ───────────────────────────────────────────────────────
  const handleMove = useCallback((clientX: number) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => handleMove(e.clientX);
    const onUp = () => { dragging.current = false; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [handleMove]);

  // ── Aspect ratio ──────────────────────────────────────────────────────
  const wrapperStyle: React.CSSProperties = aspectClass
    ? containerStyle
    : { ...containerStyle, aspectRatio: "16 / 9" };

  return (
    <div
      ref={containerRef}
      className={aspectClass}
      style={wrapperStyle}
    >
      {/* "After" map — always visible underneath */}
      <div
        ref={afterRef}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      />

      {/* "Before" map — clipped to left of slider */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
        }}
      >
        <div ref={beforeRef} style={{ position: "absolute", inset: 0 }} />
      </div>

      {/* Labels */}
      <div style={{ ...labelStyle, left: 12 }}>{beforeLabel}</div>
      <div style={{ ...labelStyle, right: 12, left: "auto" }}>
        {afterLabel}
      </div>

      {/* Slider handle */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          zIndex: 30,
          left: `${sliderPos}%`,
          transform: "translateX(-50%)",
          cursor: "ew-resize",
        }}
        onPointerDown={() => { dragging.current = true; }}
      >
        <div style={sliderLineStyle} />
        <div style={handleStyle}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M4 3L1 7L4 11M10 3L13 7L10 11"
              stroke="#333"
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
