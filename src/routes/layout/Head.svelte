<script lang="ts">
  import { ICONS_URL } from "$lib/const";
  import { MANIFEST_DATA } from "./manifest";
</script>

<svelte:head>
  <title>{MANIFEST_DATA?.name}</title>
  <meta name="description" content={MANIFEST_DATA?.description} />
  <meta name="theme-color" content={MANIFEST_DATA?.theme_color} />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="apple-mobile-web-app-title" content={MANIFEST_DATA?.name} />
  <link rel="icon" href={MANIFEST_DATA?.icons && MANIFEST_DATA?.icons[0]?.src} type="image/png" sizes="32x32" />
  <link rel="icon" href={MANIFEST_DATA?.icons && MANIFEST_DATA?.icons[5]?.src} type="image/png" sizes="192x192" />
  <link rel="apple-touch-icon" href={MANIFEST_DATA?.icons && MANIFEST_DATA?.icons[3]?.src} />
  <link rel="icon" type="image/png" href={ICONS_URL + "favicon.ico"} />
  <link crossorigin="use-credentials" rel="manifest" href={"data:application/manifest+json," + encodeURIComponent(JSON.stringify(MANIFEST_DATA))} />
  <!-- CUSTOM -->
  <link rel="stylesheet" href="https://use.typekit.net/rnc3mwp.css" />
  <!-- rel="preload" -->
</svelte:head>
