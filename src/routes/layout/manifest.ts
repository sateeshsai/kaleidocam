import { ICONS_URL, SCREENSHOTS_URL } from "$lib/const";
// @ts-expect-error
import type { WebAppManifest } from "web-app-manifest";

type DisplayOverride = "browser" | "fullscreen" | "minimal-ui" | "standalone" | "tabbed" | "window-controls-overlay";
interface FixedWebAppManifest extends WebAppManifest {
  icons: any;
  display_override: DisplayOverride[];
  // screenshots: { src: string; sizes: string; form_factor?: string }[];
}

export const MANIFEST_DATA: FixedWebAppManifest = {
  // @ts-expect-error
  name: "KaleidoCam",
  short_name: "KaleidoCam",
  start_url: window.location.href.split("#")?.[0],
  description: "Industry Kaleidoscope 2025",
  background_color: "black",
  display: "standalone",
  display_override: ["window-controls-overlay"],
  icons: [
    { src: ICONS_URL + "32x32.png", sizes: "32x32" },
    { src: ICONS_URL + "128x128.png", sizes: "128x128" },
    { src: ICONS_URL + "144x144.png", sizes: "144x144" },
    { src: ICONS_URL + "152x152.png", sizes: "152x152" },
    { src: ICONS_URL + "192x192.png", sizes: "192x192" },
    { src: ICONS_URL + "256x256.png", sizes: "256x256" },
    { src: ICONS_URL + "512x512.png", sizes: "512x512" },
    { src: ICONS_URL + "maskable_icon.png", sizes: "640x640" },
  ],
  screenshots: [
    { src: SCREENSHOTS_URL + "551x979-1.png", sizes: "551x979" },
    { src: SCREENSHOTS_URL + "518x922-2.png", sizes: "518x922" },
    { src: SCREENSHOTS_URL + "518x922-3.png", sizes: "518x922" },
    { src: SCREENSHOTS_URL + "2000x1073-1.png", sizes: "2000x1073", form_factor: "wide" },
    { src: SCREENSHOTS_URL + "1270x800-1.png", sizes: "1270x800", form_factor: "wide" },
    { src: SCREENSHOTS_URL + "1270x800-2.png", sizes: "1270x800", form_factor: "wide" },
    { src: SCREENSHOTS_URL + "1270x800-2.png", sizes: "1270x800", form_factor: "wide" },
  ],
};

// console.log(MANIFEST_DATA);
