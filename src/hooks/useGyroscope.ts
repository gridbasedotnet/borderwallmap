"use client";

import { useEffect, useRef, useState } from "react";

interface GyroscopeState {
  x: number; // -1 to 1 (left/right tilt)
  y: number; // -1 to 1 (front/back tilt)
  supported: boolean;
}

const MAX_TILT = 20; // degrees of tilt that maps to full range
const SMOOTHING = 0.08; // lower = smoother/slower response

export function useGyroscope(): GyroscopeState {
  const [supported, setSupported] = useState(false);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [state, setState] = useState<GyroscopeState>({
    x: 0,
    y: 0,
    supported: false,
  });
  const rafId = useRef<number>(0);

  useEffect(() => {
    // Only on mobile / devices with orientation sensors
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      return;
    }

    let active = true;

    function handleOrientation(e: DeviceOrientationEvent) {
      if (e.gamma === null || e.beta === null) return;
      if (!supported) setSupported(true);

      // gamma = left/right tilt (-90 to 90)
      // beta = front/back tilt (-180 to 180)
      const x = Math.max(-1, Math.min(1, (e.gamma || 0) / MAX_TILT));
      const y = Math.max(-1, Math.min(1, ((e.beta || 0) - 30) / MAX_TILT));
      target.current = { x, y };
    }

    function animate() {
      if (!active) return;
      // Lerp toward target for smooth movement
      current.current.x += (target.current.x - current.current.x) * SMOOTHING;
      current.current.y += (target.current.y - current.current.y) * SMOOTHING;

      setState({
        x: current.current.x,
        y: current.current.y,
        supported: true,
      });
      rafId.current = requestAnimationFrame(animate);
    }

    // iOS 13+ requires permission
    const doe = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof doe.requestPermission === "function") {
      // We'll request permission on first user interaction
      const requestOnInteraction = () => {
        doe.requestPermission!().then((permission: string) => {
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
            rafId.current = requestAnimationFrame(animate);
          }
        });
        window.removeEventListener("touchstart", requestOnInteraction);
      };
      window.addEventListener("touchstart", requestOnInteraction, {
        once: true,
      });
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
      rafId.current = requestAnimationFrame(animate);
    }

    return () => {
      active = false;
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [supported]);

  return state;
}
