<script lang="ts">
  import { onMount, tick } from "svelte";
  import { Slider } from "$lib/components/ui/slider/index.js";

  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Zap from "@lucide/svelte/icons/zap";
  import ZoomIn from "@lucide/svelte/icons/zoom-in";
  import ZoomOut from "@lucide/svelte/icons/zoom-out";
  import ZapOff from "@lucide/svelte/icons/zap-off";
  import SwitchCamera from "@lucide/svelte/icons/switch-camera";
  import Overlay from "./_components/Overlay.svelte";
  let imageCapture: ImageCapture;
  let errorMessage = $state("");
  import domtoimage from "dom-to-image";
  import * as htmlToImage from "html-to-image";
  import { scale, slide } from "svelte/transition";
  import { cn } from "$lib/utils";
  import { fitToViewport } from "./size";

  const overlaySizes = $state({
    height: "0px",
    width: "0px",
    scale: "1",
  });

  const imageNaturalSizes = $state({
    width: 0,
    height: 0,
    scale: 1,
  });

  const userMediaConstraints = $state({
    video: {
      facingMode: { exact: "environment" },
      // width: { exact: 1920 },
      // height: { exact: 1080 },
      // width: { ideal: 4032 },
      // height: { ideal: 3024 },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      //   width: { exact: window.innerWidth * 2 },
      //   height: { exact: window.innerWidth * 2 },

      focusMode: "continuous",
      zoom: 1,
    },
    audio: false,
  });

  onMount(() => {
    console.log(userMediaConstraints.video.zoom);
    onGetUserMediaButtonClick();
  });

  let startTime = 0;
  let videoEl: HTMLVideoElement | undefined = $state();
  let videoElWrapper: HTMLElement | undefined = $state();
  let overlayPreviewEl: HTMLElement | undefined = $state();

  let loading = $state(false);
  let stream: MediaStream | undefined = undefined;

  let takePhotoOptions: { fillLightMode: "auto" | "off" | "flash"; imageWidth: number; imageHeight: number } = $state({
    fillLightMode: "off",
    imageWidth: 1500,
    imageHeight: 1000,
  });

  let scaledSize = $state();

  async function onGetUserMediaButtonClick() {
    loading = true;
    console.log("onGetUserMediaButtonClick");
    // console.log(navigator.mediaDevices.getSupportedConstraints());

    // stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });

    if (stream) {
      stream.getVideoTracks()[0].stop();
      stream.getTracks().forEach((track) => {
        console.log(track);
        track.stop();
      });
    }

    navigator.mediaDevices
      .getUserMedia(userMediaConstraints)
      .then((mediaStream) => {
        stream = mediaStream;
        // console.log(mediaStream);
        const track = mediaStream.getVideoTracks()[0];
        imageCapture = new ImageCapture(track);

        imageCapture.takePhoto(takePhotoOptions).then((blob) => {
          // blobToImage(blob);
          const urlCreator = window.URL || window.webkitURL;
          const imageData = urlCreator.createObjectURL(blob);
          const img = new Image();
          img.src = imageData;

          img.onload = async () => {
            if (!imageNaturalSizes.width) {
              imageNaturalSizes.width = img.naturalWidth;
              imageNaturalSizes.height = img.naturalHeight;
              imageNaturalSizes.scale = window.innerWidth / img.naturalWidth;

              scaledSize = fitToViewport(imageNaturalSizes, { width: window.innerWidth, height: window.innerHeight });
              console.log(imageNaturalSizes);

              if (videoEl) {
                videoEl.srcObject = mediaStream;
                videoEl.style.width = imageNaturalSizes.width + "px";
                videoEl.style.height = imageNaturalSizes.height + "px";
                videoEl.style.scale = ".5";
                // videoEl.style.scale = "0.8";
              }

              if (videoElWrapper) {
                // videoElWrapper.style.width = imageNaturalSizes.width + "px";
                // videoElWrapper.style.height = imageNaturalSizes.height + "px";
                // videoElWrapper.style.scale = ".5";
              }

              if (overlayPreviewEl) {
                overlayPreviewEl.style.width = imageNaturalSizes.width + "px";
                overlayPreviewEl.style.height = imageNaturalSizes.height + "px";
                // overlayPreviewEl.style.scale = imageNaturalSizes.scale.toString();
              }

              const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
              console.log(canvas);
              canvas.width = imageNaturalSizes.width;
              canvas.height = imageNaturalSizes.height;
              canvas.style.width = imageNaturalSizes.width + "px";
              canvas.style.height = imageNaturalSizes.height + "px";

              if (compositionEl) compositionEl.style.width = imageNaturalSizes.width + "px";
              if (compositionEl) compositionEl.style.height = imageNaturalSizes.height + "px";
            }

            setTimeout(() => {
              loading = false;
            }, 500);
          };
        });
      })
      .catch((error) => {
        errorMessage = error;
        console.log("getUserMedia", error);
        loading = false;
      });
  }

  function onGrabFrameButtonClick() {
    imageCapture
      .grabFrame()
      .then((imageBitmap) => {
        const canvas = document.querySelector("#grabFrameCanvas")! as HTMLCanvasElement;
        drawCanvas(canvas, imageBitmap);
      })
      .catch((error) => console.log(error));
  }

  //   const blobToImage = (blob: Blob) => {
  //     return new Promise((resolve) => {
  //       const url = URL.createObjectURL(blob);
  //       imgEl.onload = () => {
  //         URL.revokeObjectURL(url);
  //         resolve(imgEl);
  //       };
  //       imgEl.src = url;
  //       console.log(imgEl);
  //     });
  //   };

  function handleFlashSetting() {
    if (takePhotoOptions.fillLightMode === "auto") {
      takePhotoOptions.fillLightMode = "off";
      return;
    }

    if (takePhotoOptions.fillLightMode === "off") {
      takePhotoOptions.fillLightMode = "flash";
      return;
    }

    if (takePhotoOptions.fillLightMode === "flash") {
      takePhotoOptions.fillLightMode = "auto";
      return;
    }
  }

  //   2000,1500 - 3590x4787
  // 1500x1000 - 2524x3366
  let processing = $state(false);
  //   let imageWidth = 100;
  async function onTakePhotoButtonClick() {
    console.log("onTakePhotoButtonClick");
    startTime = window.performance.now();

    // const photoCapabilities = await imageCapture.getPhotoCapabilities();
    // console.log(photoCapabilities);
    // takePhotoOptions.imageWidth = photoCapabilities.imageWidth?.max!;
    // takePhotoOptions.imageHeight = photoCapabilities.imageHeight?.max!;

    imageCapture.takePhoto(takePhotoOptions).then((blob) => {
      processing = true;
      console.log("takePhoto");
      // blobToImage(blob);
      const urlCreator = window.URL || window.webkitURL;
      const imageData = urlCreator.createObjectURL(blob);
      console.log(imageData);
      const img = new Image();
      img.src = imageData;

      img.onload = () => {
        console.log("img.onload");

        console.log({
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          width: img.width,
          height: img.height,
        });

        img.style.width = img.naturalWidth + "px";
        img.style.height = img.naturalWidth + "px";

        const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
        // canvas.width = img.naturalWidth;
        // canvas.height = img.naturalHeight;
        // console.log(canvas.height, canvas.width);
        const context = canvas.getContext("2d")!;
        context.drawImage(img, 0, 0);

        // overlaySizes.width = img.naturalWidth + "px";
        // overlaySizes.height = img.naturalHeight + "px";
        // console.log(compositionEl?.style.width);

        // console.log(img);
        htmlToImage
          .toPng(compositionEl as HTMLElement, {
            pixelRatio: window.devicePixelRatio,
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
            console.log("TIME TAKEN: " + String((window.performance.now() - startTime) / 1000));
            setTimeout(() => {
              processing = false;
            }, 1000);
          })
          .catch((err) => {
            console.error("oops, something went wrong!", err);
          });
        //   domtoimage
        //     .toPng(compositionEl)
        //     .then(function (dataUrl: string) {
        //       console.log(dataUrl);
        //       var img = new Image();
        //       img.src = dataUrl;
        //       var link = document.createElement("a");
        //       link.download = "test.png";
        //       link.href = dataUrl;
        //       //   link.click();
        //     })
        //     .catch(function (error: string) {
        //       console.error("oops, something went wrong!", error);
        //     });
      };
      // var link = document.getElementById("link")!;
      // link.setAttribute("download", "MintyPaper" + new Date().toISOString());
      // link.setAttribute("href", imageData);
      // link.click();
      // return createImageBitmap(blob);
    });
    //   .then((imageBitmap) => {
    //     const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
    //     // drawCanvas(canvas, imageBitmap);
    //   })
    //   .catch((error) => console.log(error));
  }

  /* Utils */

  function drawCanvas(canvas: HTMLCanvasElement, img: ImageBitmap) {
    canvas.width = +getComputedStyle(canvas).width.split("px")[0];
    canvas.height = +getComputedStyle(canvas).height.split("px")[0];
    let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    let x = (canvas.width - img.width * ratio) / 2;
    let y = (canvas.height - img.height * ratio) / 2;
    // @ts-ignore
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    // @ts-ignore
    canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
  }

  let imgEl: HTMLImageElement;

  let compositionEl: HTMLElement | undefined = $state();
</script>

<div class="max-h-[100svh] max-w-[100vw] overflow-hidden absolute top-0 left-0">
  <!-- {#if processing || loading} -->
  <div id="composition" class="absolute top-0 left-0 bg-blue-700 pointer-events-none" bind:this={compositionEl}>
    <canvas class="absolute left-0 top-0 border border-blue-500" width="200" height="200" id="canvas"></canvas>
    <!-- <Overlay width={overlaySizes.width} height={overlaySizes.height} /> -->
    <div bind:this={overlayPreviewEl} class="pointer-events-none absolute top-0 left-0 origin-top-left w-full h-full">
      <Overlay />
    </div>
  </div>
  <!-- {/if} -->
</div>

<div class="h-[88svh] grid content-center bg-black relative">
  <div class="fixed z-100 top-0 left-0 text-white">
    <p>
      {JSON.stringify(window.innerHeight + " x " + window.innerWidth, null, 2)}
    </p>
    <p>{JSON.stringify(imageNaturalSizes, null, 2)}</p>
    <p>{JSON.stringify(scaledSize, null, 2)}</p>
  </div>

  <video bind:this={videoEl} autoplay class="block m-auto absolute top-0 left-0 w-full h-full origin-top-left border-2 border-red-500">
    <track kind="captions" />
  </video>

  <!-- <div bind:this={overlayPreviewEl} class="pointer-events-none absolute top-0 left-0 origin-top-left w-full h-full">
    style="width: {overlaySizes?.width}; height: {overlaySizes.height};scale:{overlaySizes.scale};"
    <Overlay />
  </div> -->
</div>
<!-- {#if loading || processing}
  <div transition:slide|global={{ axis: "y" }} class="loading h-full w-full absolute top-0 left-0 bg-black grid place-items-center text-background">
    <LoaderCircle class="animate-spin" />
  </div>
{/if} -->

<div
  class={cn(
    "menu fixed bottom-0 left-0 bg-foreground w-full h-[12svh] grid grid-cols-3 justify-items-center items-center z-100 border-t-[.5px] border-muted/50 px-6",
    loading || processing ? " pointer-events-none" : ""
  )}
>
  <div class="flash flex gap-6 justify-self-between">
    <button class="flex gap-2 items-center uppercase text-sm" onclick={handleFlashSetting}>
      <div class=" relative rounded-full p-1 aspect-square text-muted">
        {#if takePhotoOptions.fillLightMode === "flash"}
          <Zap />
        {:else if takePhotoOptions.fillLightMode === "off"}
          <ZapOff />
        {:else}
          <Zap />
          <p class="text-[10px] font-bold bottom-0 right-1 absolute">A</p>
        {/if}
      </div>

      <!-- <p class="text-background font-bold">Flash {takePhotoOptions.fillLightMode === "flash" ? "ON" : takePhotoOptions.fillLightMode}</p> -->
    </button>

    <button
      class="flex gap-2 items-center uppercase text-sm"
      onclick={() => {
        console.log("HELLO");
        if (userMediaConstraints.video.facingMode.exact === "user") {
          userMediaConstraints.video.facingMode.exact = "environment";
          onGetUserMediaButtonClick();
          return;
        }
        if (userMediaConstraints.video.facingMode.exact === "environment") {
          userMediaConstraints.video.facingMode.exact = "user";
          onGetUserMediaButtonClick();
          return;
        }
      }}
    >
      <div class=" relative rounded-full p-1 aspect-square text-muted">
        <SwitchCamera />
        <!-- {userMediaConstraints.video.facingMode.exact.charAt(0)} -->
      </div>
    </button>
  </div>
  <button onclick={onTakePhotoButtonClick} class=" w-18 h-18 rounded-full grid place-items-center p-2 bg-muted-foreground" aria-label="click photo">
    <div class=" w-full h-full bg-white rounded-full"></div>
  </button>
  <div class="flash flex gap-6 justify-self-between">
    <button
      disabled={userMediaConstraints.video.zoom > 4}
      class="flex gap-2 items-center uppercase text-sm disabled:opacity-50"
      onclick={() => {
        userMediaConstraints.video.zoom += 1;
        onGetUserMediaButtonClick();
      }}
    >
      <div class=" relative rounded-full p-1 aspect-square text-muted">
        <ZoomIn />
      </div>
    </button>

    <button
      disabled={userMediaConstraints.video.zoom < 2}
      class="flex gap-2 items-center uppercase text-sm disabled:opacity-50"
      onclick={() => {
        userMediaConstraints.video.zoom -= 1;
        onGetUserMediaButtonClick();
      }}
    >
      <div class=" relative rounded-full p-1 aspect-square text-muted">
        <ZoomOut />
      </div>
    </button>
  </div>

  <!-- {#if loading}
    <div transition:slide|global={{ axis: "y" }} class="loading h-full w-full absolute top-0 left-0 bg-black/90 grid place-items-center text-background">
      <LoaderCircle class="animate-spin" />
    </div>
  {/if} -->
</div>

<!-- <button id="getUserMediaButton">Get User Media</button> -->
<!-- <Overlay scale={overlaySizes.scale} width={overlaySizes.width} height={overlaySizes.height} /> -->
<!-- <Overlay width="100vw" height="90svh" /> -->

<!-- <div> -->

<!-- <button id="grabFrameButton" disabled>Grab Frame</button> -->
<!-- </div> -->
<!-- <div class="absolute opacity-0">
    <canvas id="takePhotoCanvas"></canvas>
    <button id="takePhotoButton" disabled>Take Photo</button>
  </div> -->
