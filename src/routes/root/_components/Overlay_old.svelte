<script lang="ts">
  import { cn } from "$lib/utils";

  let { height, width }: { height: string; width: string } = $props();
</script>

<div class={cn(" pointer-events-none absolute left-0 top-0")} style="width: {width}; height:{height}; ">
  <div class="left absolute left-0 bottom-0">
    <svg width="43" height="131" viewBox="0 0 43 131" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.447754 111.744V62.2319L41.3163 79.1156L0.447754 111.744Z" fill="#00B0C1" />
      <path d="M0.447754 130.905L42.389 85.5059L33.4933 129.781L0.447754 130.905Z" fill="#6FBE44" />
      <path d="M33.4933 38.2511L0.447754 35.5938V60.8351L33.4933 38.2511Z" fill="white" />
      <path d="M0.395508 31.4473V0.905273L30.8128 26.3023L0.395508 31.4473Z" fill="#00A651" />
    </svg>
  </div>

  <h1 class="text-white absolute bottom-[2svh] left-[50%] translate-x-[-50%] font-extrabold text-2xl whitespace-nowrap drop-shadow-lg">INDUSTRY <span class="text-[#6fbe44]">KALEIDOSCOPE</span></h1>

  <div class="right absolute bottom-0 right-0">
    <svg width="39" height="113" viewBox="0 0 39 113" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38.3603 0.80957V23.5128L5.96191 5.834L38.3603 0.80957Z" fill="#00B0C1" />
      <path d="M38.3603 26.6582L9.78076 34.828L38.3603 53.4407V26.6582Z" fill="#6FBE44" />
      <path d="M0.0117188 60.5336L38.3602 60.4116V112.093L0.0117188 60.5336Z" fill="#00A651" />
    </svg>
  </div>

  <div class="top-right absolute top-0 right-0">
    <svg width="43" height="130" viewBox="0 0 43 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M42.3369 19.161V68.6733L1.46834 51.7897L42.3369 19.161Z" fill="#00B0C1" />
      <path d="M42.3369 2.87443e-05L0.39569 45.3994L9.29133 1.12467L42.3369 2.87443e-05Z" fill="#6FBE44" />
      <path d="M9.29133 92.6542L42.3369 95.3115V70.0702L9.29133 92.6542Z" fill="white" />
      <path d="M42.3892 99.458V130L11.9718 104.603L42.3892 99.458Z" fill="#00A651" />
    </svg>
  </div>

  <div class="absolute left-0 top-0 h-full w-2 bg-[#00a651]" style="--padding:12px;"></div>
  <div class="absolute left-0 top-0 w-full h-2 bg-[#00b0c1]" style="--padding:12px;"></div>
  <div class="absolute right-0 top-0 h-full w-2 bg-[#007340]" style="--padding:12px;"></div>
  <div class="absolute left-0 bottom-0 w-full h-2 bg-[#6fbe44]" style="--padding:12px;"></div>
</div>
