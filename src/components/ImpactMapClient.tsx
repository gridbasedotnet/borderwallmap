"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { getSupabase, ImpactVideo } from "@/lib/supabase";
import VideoModal from "./VideoModal";

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
      <div className="w-full h-[65vh] min-h-[350px] max-h-[600px] rounded-xl bg-taupe-950 animate-pulse" />
    );
  }

  if (error) {
    return (
      <div className="w-full h-[65vh] min-h-[350px] max-h-[600px] rounded-xl bg-taupe-950 border border-taupe-900 flex items-center justify-center px-4">
        <p className="text-taupe-400 text-base text-center">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[65vh] min-h-[350px] max-h-[600px] rounded-xl overflow-hidden border border-taupe-900">
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
                        backgroundColor: "#c45a3a",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "background-color 0.2s",
                        WebkitTapHighlightColor: "transparent",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#d97050")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#c45a3a")
                      }
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
