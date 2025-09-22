<script lang="ts">
  import { LOCALMODE } from "$lib/const";
  import "@khmyznikov/pwa-install";
  import { onMount } from "svelte";
  // console.log(SHAREPOINT_ENV);
  const siteRootPath = window.location.href.split("#")[0];
  // SHAREPOINT_DOMAIN_URL + SHAREPOINT_SITE_NAME + SHAREPOINT_SITE_PAGES
  //@ts-ignore
  import System from "svelte-system-info";
  import { MANIFEST_DATA } from "./manifest";

  if ("serviceWorker" in navigator) {
    if (navigator.serviceWorker.controller) {
      console.log("Active service worker found, no need to register");
    } else {
      navigator.serviceWorker.register(siteRootPath + "service-worker.js", { scope: siteRootPath }).then(function (reg) {
        console.log(reg, "Service worker registered");
      });
    }
  }

  const handlePWAEvent = (message: any) => {
    // console.log(message);
  };

  const INSTALL_DESCRIPTION = "Install this web app on your device for easy access.";

  onMount(() => {
    var pwaInstall: any = document.getElementById("pwa-install");

    pwaInstall.setAttribute("name", "KaleidoCam");
    pwaInstall.setAttribute("description", "Industry Kaleidoscope 2025");
    pwaInstall.setAttribute("install-description", INSTALL_DESCRIPTION);

    const forceStyle = (style: string) => {
      //TODO: VERIFY - DEVICE STYLES NOT WORKING
      switch (style) {
        case "apple-mobile":
          pwaInstall.isAppleDesktopPlatform = false;
          pwaInstall.isAppleMobilePlatform = true;
          break;
        case "apple-desktop":
          pwaInstall.isAppleMobilePlatform = false;
          pwaInstall.isAppleDesktopPlatform = true;
          break;
        case "chrome":
          pwaInstall.isAppleMobilePlatform = false;
          pwaInstall.isAppleDesktopPlatform = false;
          break;
      }
      // pwaInstall.hideDialog();
      if (!LOCALMODE) pwaInstall.showDialog();
    };

    forceStyle(System.OSName === "macOS" ? "apple-desktop" : System.OSName === "iOS" ? "apple-mobile" : "chrome");

    //EVENTS
    pwaInstall.addEventListener("pwa-install-success-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
    pwaInstall.addEventListener("pwa-install-fail-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
    pwaInstall.addEventListener("pwa-user-choice-result-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
    pwaInstall.addEventListener("pwa-install-available-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
    pwaInstall.addEventListener("pwa-install-how-to-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
    pwaInstall.addEventListener("pwa-install-gallery-event", (event: any) => {
      handlePWAEvent(event.detail.message);
    });
  });
</script>

<pwa-install icon={MANIFEST_DATA.icons && MANIFEST_DATA.icons[0].src} id="pwa-install"> </pwa-install>

<!-- <style>
  :global(.about) {
    display: flex;
    align-items: center;
  }
</style> -->
