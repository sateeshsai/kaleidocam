<div class="shutter" style="--flaps: 6">
  <div class="flap" style="--i: 0"></div>
  <div class="flap" style="--i: 1"></div>
  <div class="flap" style="--i: 2"></div>
  <div class="flap" style="--i: 3"></div>
  <div class="flap" style="--i: 4"></div>
  <div class="flap" style="--i: 5"></div>
</div>

<style>
  .flap {
    width: 150vmax;
    height: 150vmax;
    position: absolute;
    bottom: 50%;
    right: 50%;
    pointer-events: none;
    will-change: transform;

    background: hsl(calc(1turn * var(--p)), 80%, 80%);

    background: linear-gradient(35deg, #555, black);
    border: solid 4px #999;

    --p: calc(var(--i) / var(--flaps));

    animation: click 0.9s cubic-bezier(0.5, 0, 0.5, 1) 0.1s;

    transform-origin: bottom right;
    transform: rotate(-0.5turn) rotate(calc(1turn * var(--p))) skewX(30deg) translateX(-100%) translateY(90%);

    @keyframes click {
      48%,
      52% {
        transform: rotate(-0.25turn) rotate(calc(1turn * var(--p))) skewX(30deg) translateX(0%) translateY(0%);
      }
    }
  }
</style>
