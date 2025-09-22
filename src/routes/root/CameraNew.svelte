<script lang="ts">
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";
  import Overlay from "./_components/Overlay.svelte";
  import * as htmlToImage from "html-to-image";
  import SwitchCamera from "@lucide/svelte/icons/switch-camera";
  import ZoomIn from "@lucide/svelte/icons/zoom-in";
  import ZoomOut from "@lucide/svelte/icons/zoom-out";
  import { slide } from "svelte/transition";

  let stream: MediaStream | undefined = undefined;
  let imageCapture: ImageCapture;

  let overlayPreviewEl: HTMLElement | undefined = $state();
  let overlayForCanvasEl: HTMLElement | undefined = $state();
  let compositionEl: HTMLElement | undefined = $state();

  let takePhotoOptions: { fillLightMode: "auto" | "off" | "flash"; imageWidth: number; imageHeight: number } = $state({
    fillLightMode: "off",
    imageWidth: 1500,
    imageHeight: 1000,
  });

  let loading = $state(false);

  const videoSizes = {
    width: 0,
    height: 0,
  };

  let scaleFactor = $state(window.innerHeight / 1280);
  window.addEventListener("deviceorientation", handleOrientation);

  function handleOrientation() {
    if (window.innerWidth > window.innerHeight) {
      scaleFactor = window.innerWidth / 1280;
      if (canvasEl) {
        canvasEl.width = 1280;
        canvasEl.height = 720;
      }
    } else {
      scaleFactor = window.innerHeight / 1280;
      if (canvasEl) {
        canvasEl.width = 720;
        canvasEl.height = 1280;
      }
    }
  }

  const constraints = {
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
      //   width: { ideal: 4096 },
      //   height: { ideal: 4096 },
      focusMode: "continuous",
      zoom: 1,
    },
  };
  function startVideo() {
    loading = true;

    if (stream) {
      stream.getVideoTracks()[0].stop();
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
      console.log(mediaStream);
      stream = mediaStream;
      if (videoEl) videoEl.srcObject = mediaStream;
      // videoEl?.addEventListener(
      //   "loadedmetadata",
      //   function (e) {
      //     videoSizes.height = this?.videoHeight;
      //     videoSizes.width = this?.videoWidth;

      //     console.log(videoSizes);
      //     if (videoEl) {
      //       //   videoEl.style.width = videoSizes?.width + "px";
      //       //   videoEl.style.height = videoSizes?.height + "px";
      //     }
      //     if (canvasEl) {
      //       //   canvasEl.width = videoSizes?.width;
      //       //   canvasEl.height = videoSizes?.height;
      //     }
      //     if (overlayForCanvasEl) {
      //       //   overlayForCanvasEl.style.width = videoSizes?.width + "px";
      //       //   overlayForCanvasEl.style.height = videoSizes?.height + "px";
      //     }
      //   },
      //   false
      // );
      const track = mediaStream.getVideoTracks()[0];
      imageCapture = new ImageCapture(track);
      loading = false;
    });
  }

  function grabFrame() {
    loading = true;
    imageCapture
      .grabFrame()
      .then((imageBitmap) => {
        console.log(imageBitmap);

        if (canvasEl) {
          drawCanvas(canvasEl, imageBitmap);
        }

        // return;

        const startTime = window.performance.now();

        htmlToImage
          .toPng(compositionEl as HTMLElement, {
            pixelRatio: 1,
            // width: img.naturalWidth, height: img.naturalHeight,
          })
          .then((dataUrl) => {
            console.log(dataUrl);
            const img = new Image();
            img.src = dataUrl;
            var link = document.createElement("a");
            link.download = new Date().toString() + "-test.png";
            link.href = dataUrl;
            link.click();
            console.log("Canvas", canvasEl?.width, canvasEl?.height);
            console.log("Overlay", overlayForCanvasEl?.clientWidth, overlayForCanvasEl?.clientHeight);
            console.log("TIME TAKEN: " + String((window.performance.now() - startTime) / 1000));
            loading = false;
          })
          .catch((err) => {
            console.error("oops, something went wrong!", err);
          });
      })
      .catch((error) => console.log(error));
  }

  function drawCanvas(canvas: HTMLCanvasElement, img: ImageBitmap) {
    if (!videoEl) return;
    // canvas.width = +getComputedStyle(videoEl).width.split("px")[0];
    // canvas.height = +getComputedStyle(videoEl).height.split("px")[0];
    let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    let x = (canvas.width - img.width * ratio) / 2;
    let y = (canvas.height - img.height * ratio) / 2;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext("2d")!.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
  }

  onMount(() => {
    handleOrientation();
    startVideo();
  });

  let imgEl: HTMLImageElement | undefined = $state();
  let videoEl: HTMLVideoElement | undefined = $state();
  let canvasEl: HTMLCanvasElement | undefined = $state();
</script>

<main in:slide|global class=" relative max-w-[100vw] max-h-[100svh] overflow-hidden bg-black">
  <div class="relative h-[100svh] max-w-[100vw] grid content-start z-10">
    <video bind:this={videoEl} class=" border-2 border-purple-50 bg-black object-cover min-h-[100svh] min-w-[101vw] max-w-[101vw]" autoplay>
      <track kind="captions" />
    </video>

    <div bind:this={overlayForCanvasEl} class="pointer-events-none absolute top-0 left-0 origin-top-left w-[720px] h-[1280px] landscape:h-[720px] landscape:w-[1280px]" style="scale: {scaleFactor};">
      <Overlay />
    </div>
  </div>

  <div class={cn("menu fixed bottom-12 left-0 w-full h-[12svh] flex justify-center justify-items-center items-center z-100 px-6", loading ? " pointer-events-none" : "")}>
    <button onclick={grabFrame} class=" w-20 h-20 rounded-full grid place-items-center p-1.5 bg-black border-2 border-[#0df200] drop-shadow-xl" aria-label="click photo">
      <div class=" w-full h-full bg-white rounded-full"></div>
    </button>

    <div class="settings fixed top-4 right-4 flex gap-4">
      <button
        class="flex gap-2 items-center uppercase text-sm bg-black w-[36px] h-[36px] justify-center rounded-full"
        onclick={() => {
          console.log("HELLO");
          if (constraints.video.facingMode === "user") {
            constraints.video.facingMode = "environment";
            startVideo();
            return;
          }
          if (constraints.video.facingMode === "environment") {
            constraints.video.facingMode = "user";
            startVideo();
            return;
          }
        }}
      >
        <div class=" relative rounded-full aspect-square text-muted">
          <SwitchCamera size="22" />
          <!-- {userMediaConstraints.video.facingMode.exact.charAt(0)} -->
        </div>
      </button>
      <button
        class="flex gap-2 items-center uppercase text-sm disabled:opacity-50 bg-black w-[36px] h-[36px] justify-center rounded-full"
        onclick={() => {
          constraints.video.zoom += 1;
          startVideo();
        }}
      >
        <div class=" relative rounded-full p-1 aspect-square text-muted">
          <ZoomIn />
        </div>
      </button>

      <button
        class="flex gap-2 items-center uppercase text-sm disabled:opacity-50 bg-black w-[36px] h-[36px] justify-center rounded-full"
        onclick={() => {
          constraints.video.zoom -= 1;
          startVideo();
        }}
      >
        <div class=" relative rounded-full p-1 aspect-square text-muted">
          <ZoomOut />
        </div>
      </button>
    </div>
  </div>

  <div class="grid absolute left-0 top-0 w-[720px] h-[1280px] landscape:h-[710px] landscape:w-[1278px]" bind:this={compositionEl}>
    <canvas bind:this={canvasEl} width="720" height="1280" class="absolute top-0 left-0 origin-top-left"></canvas>
    <div bind:this={overlayForCanvasEl} class="pointer-events-none absolute top-0 left-0 origin-top-left w-[720px] h-[1280px] landscape:h-[720px] landscape:w-[1280px]">
      <Overlay />
    </div>
  </div>
</main>

{#if loading}
  <div transition:slide|global={{ axis: "y" }} class="loading h-full w-full absolute top-0 left-0 bg-black grid place-items-center text-background z-100">
    <LoaderCircle class="animate-spin" />
  </div>
{/if}
