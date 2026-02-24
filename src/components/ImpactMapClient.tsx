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
import { supabase, ImpactVideo } from "@/lib/supabase";
import VideoModal from "./VideoModal";

function createMarkerIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -42],
    html: `
      <svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="#8b0000"/>
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
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 11 });
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
      const { data, error: fetchError } = await supabase
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
      <div className="w-full h-[500px] md:h-[600px] rounded-xl bg-gray-900 animate-pulse" />
    );
  }

  if (error) {
    return (
      <div className="w-full h-[500px] md:h-[600px] rounded-xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center">
        <p className="text-gray-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-gray-800">
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
                      minWidth: "220px",
                      maxWidth: "280px",
                      padding: "4px",
                    }}
                  >
                    <h3
                      style={{
                        color: "#ffffff",
                        fontSize: "16px",
                        fontWeight: "600",
                        margin: "0 0 6px 0",
                        lineHeight: "1.3",
                      }}
                    >
                      {video.title}
                    </h3>
                    {video.description && (
                      <p
                        style={{
                          color: "#9ca3af",
                          fontSize: "13px",
                          margin: "0 0 10px 0",
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
                        padding: "8px 16px",
                        backgroundColor: "#8b0000",
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
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#b83a20")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#8b0000")
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
