"use client";

import { useEffect } from "react";
import { isNative, isIOS } from "@/lib/capacitor";

/**
 * Initializes native iOS plugins when running inside Capacitor.
 * Render this once at the root layout. It's a no-op on the web.
 */
export default function NativeBridge() {
  useEffect(() => {
    if (!isNative) return;

    async function init() {
      const { StatusBar, Style } = await import("@capacitor/status-bar");
      const { SplashScreen } = await import("@capacitor/splash-screen");

      await StatusBar.setStyle({ style: Style.Dark });
      if (isIOS) {
        await StatusBar.setOverlaysWebView({ overlay: true });
      }
      await SplashScreen.hide({ fadeOutDuration: 300 });
    }

    init();
  }, []);

  return null;
}
