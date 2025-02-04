import { onMount } from "solid-js";

export default function Hero() {
  let videoRef!: HTMLVideoElement;

  return (
    <section class="relative bg-black text-white">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoplay={true}
        muted={true}
        loop={true}
        playsinline={true}
        class="absolute inset-0 w-full h-full object-cover"
      >
        <source src={import.meta.env.VITE_IBG_VIDEO_URL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div class="relative gradient-bg py-40 xl:py-52 text-center px-5">
        <div class="max-w-4xl mx-auto text-center flex flex-col gap-20">
          <h1 class="text-5xl md:text-6xl font-bold italic uppercase">
            Train Like A{" "}
            <span class="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-primary">
              Champion
            </span>
          </h1>
          <div class="flex gap-4 justify-center">
            <a href="/signup" class="btn btn-primary text-lg md:btn-lg uppercase">
              Sign Up
            </a>
            <a href="/pricingschedule" class="btn btn-accent text-lg md:btn-lg uppercase">
              Schedule
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
