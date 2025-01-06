export default function Hero() {
  return (
    <section class="relative bg-black text-white">
      {/* Background Video */}
      <video
        autoplay={true}
        muted={true}
        loop={true}
        playsinline={true}
        class="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/ibg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div class="relative gradient-bg py-32 px-6 md:px-12 lg:px-24">
        <div class="max-w-4xl mx-auto text-center flex flex-col gap-16">
          <h1 class="text-4xl md:text-6xl font-bold uppercase leading-tight">
            Train Like A <span class="text-primary">Champion</span>
          </h1>
          <div>
            <a
              href="#"
              class="btn btn-primary uppercase"
            >
              Join Now
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}
