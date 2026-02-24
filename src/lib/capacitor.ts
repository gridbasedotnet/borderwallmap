import { Capacitor } from "@capacitor/core";

/** True when running inside the native iOS/Android shell */
export const isNative = Capacitor.isNativePlatform();

/** Current platform: "ios" | "android" | "web" */
export const platform = Capacitor.getPlatform();

/** True when running in the iOS native shell */
export const isIOS = platform === "ios";
