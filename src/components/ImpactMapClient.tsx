"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { getSupabase, ImpactVideo } from "@/lib/supabase";
import { WALL_ROUTE_LAYERS } from "@/lib/wall_routes";
import VideoModal from "./VideoModal";

function buildLegendHTML(): string {
  const solid = (color: string) =>
    `<div style="width:28px;height:3px;background:${color};border-radius:2px;flex-shrink:0;"></div>`;
  const dashed = (color: string) =>
    `<div style="width:28px;height:0;border-top:3px dashed ${color};flex-shrink:0;"></div>`;
  const dotted = (color: string) =>
    `<div style="display:flex;gap:3px;align-items:center;width:28px;flex-shrink:0;">` +
    `<div style="width:5px;height:5px;border-radius:50%;background:${color};"></div>`.repeat(3) +
    `</div>`;
  const item = (lineHTML: string, label: string) =>
    `<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px;">${lineHTML}<span style="color:rgba(255,255,255,0.82);font-size:11.5px;line-height:1.3;">${label}</span></div>`;

  return `
    <div style="color:white;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="color:rgba(255,255,255,0.45);font-size:9.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;">Border Wall Status</div>
      ${item(solid('#A0A0A0'), 'Existing Primary Barrier')}
      ${item(solid('#C8BEB4'), 'Existing Secondary Barrier')}
      ${item(dashed('#FF9500'), 'Planned')}
      ${item(solid('#FFD44A'), 'Awarded')}
      ${item(solid('#E06C1C'), 'Under Construction')}
      ${item(solid('#5EA34B'), 'Completed (since 1/20/25)')}
      <div style="margin-top:9px;padding-top:9px;border-top:1px solid rgba(255,255,255,0.08);">
        ${item(dotted('#6FA8DC'), 'Detection Technology')}
      </div>
      <div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.08);">
        <div style="color:rgba(255,255,255,0.28);font-size:9px;line-height:1.5;">
          Source: CBP Smart Wall Map<br>cbp.gov · ArcGIS Feature Service
        </div>
      </div>
    </div>
  `;
}

function LegendControl() {
  const map = useMap();

  useEffect(() => {
    const LegendClass = L.Control.extend({
      onAdd() {
        const container = L.DomUtil.create("div", "border-wall-legend");
        container.style.cssText = `
          background: rgba(13, 11, 9, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px 16px;
          min-width: 205px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          margin: 12px;
        `;
        container.innerHTML = buildLegendHTML();
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        return container;
      },
    });

    const legend = new LegendClass({ position: "bottomleft" });
    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}

function createMarkerIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -46],
    html: `
      <svg width="32" height="44" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="#c45a3a"/>
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="none" stroke="#000" stroke-width="1" opacity="0.3"/>
        <polygon points="11,9 11,19 20,14" fill="white"/>
      </svg>
    `,
  });
}

function FitBounds({ videos }: { videos: ImpactVideo[] }) {
  const map = useMap();

  useEffect(() => {
    if (videos.length === 0) return;
    const bounds = L.latLngBounds(
      videos.map((v) => [v.latitude, v.longitude] as [number, number])
    );
    const isMobile = window.innerWidth < 640;
    map.fitBounds(bounds, {
      padding: isMobile ? [30, 30] : [60, 60],
      maxZoom: 11,
    });
  }, [videos, map]);

  return null;
}

export default function ImpactMapClient() {
  const [videos, setVideos] = useState<ImpactVideo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ImpactVideo | null>(null);
  const markerIcon = useRef<L.DivIcon | null>(null);

  useEffect(() => {
    setMounted(true);
    markerIcon.current = createMarkerIcon();
  }, []);

  useEffect(() => {
    async function fetchVideos() {
      const { data, error: fetchError } = await getSupabase()
        .from("impact_videos")
        .select("*")
        .order("recorded_at", { ascending: true });

      if (fetchError) {
        if (fetchError.message?.includes("relation") || fetchError.code === "42P01") {
          setError("Video storage is being set up. Check back soon.");
        } else {
          setError("Could not load video locations.");
        }
        return;
      }

      if (!data || data.length === 0) {
        setError("No impact videos available yet.");
        return;
      }

      setVideos(data as ImpactVideo[]);
    }

    fetchVideos();
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[65vh] min-h-[350px] max-h-[600px] rounded-2xl glass animate-pulse" />
    );
  }

  if (error) {
    return (
      <div className="w-full h-[65vh] min-h-[350px] max-h-[600px] rounded-2xl glass glass-glow flex items-center justify-center px-4">
        <p className="text-taupe-400 text-base text-center">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[65vh] min-h-[350px] max-h-[600px] rounded-2xl overflow-hidden glass glass-glow">
        <MapContainer
          center={[29.19, -103.3]}
          zoom={9}
          scrollWheelZoom={false}
          dragging={true}
          touchZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <FitBounds videos={videos} />
          <LegendControl />
          {WALL_ROUTE_LAYERS.map((layer) =>
            layer.routes.map((route, i) => (
              <Polyline
                key={`${layer.status}-${i}`}
                positions={route}
                pathOptions={{
                  color: layer.color,
                  weight: layer.status === "detection_technology" ? 2 : 3,
                  dashArray: layer.status === "detection_technology"
                    ? "2, 6"
                    : layer.dashed
                    ? "8, 6"
                    : undefined,
                  opacity: 0.85,
                  lineCap: "butt",
                }}
              />
            ))
          )}
          {markerIcon.current &&
            videos.map((video) => (
              <Marker
                key={video.id}
                position={[video.latitude, video.longitude]}
                icon={markerIcon.current!}
              >
                <Popup>
                  <div
                    style={{
                      minWidth: "180px",
                      maxWidth: "260px",
                      padding: "2px",
                    }}
                  >
                    <h3
                      style={{
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: "600",
                        margin: "0 0 4px 0",
                        lineHeight: "1.3",
                      }}
                    >
                      {video.title}
                    </h3>
                    {video.description && (
                      <p
                        style={{
                          color: "#a89a8a",
                          fontSize: "13px",
                          margin: "0 0 8px 0",
                          lineHeight: "1.4",
                        }}
                      >
                        {video.description}
                      </p>
                    )}
                    <button
                      onClick={() => setActiveVideo(video)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "rgba(196, 90, 58, 0.25)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        color: "#ffffff",
                        border: "1px solid rgba(196, 90, 58, 0.3)",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "all 0.2s",
                        WebkitTapHighlightColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(196, 90, 58, 0.4)";
                        e.currentTarget.style.borderColor = "rgba(196, 90, 58, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(196, 90, 58, 0.25)";
                        e.currentTarget.style.borderColor = "rgba(196, 90, 58, 0.3)";
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      Play Video
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </>
  );
}
