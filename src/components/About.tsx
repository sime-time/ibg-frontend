export default function About() {
  return (
    <section class="bg-gray-900 py-16 px-8 md:px-16 flex flex-col md:flex-row justify-evenly gap-10 md:gap-0">
      <div class="flex flex-col gap-5 md:w-1/2">
        <h1 class="font-bold text-4xl">
          Indiana's <span class="text-primary">Elite</span> Martial Arts Gym
        </h1>
        <p class="text-lg leading-relaxed">
          <span class="font-bold">Indy Boxing and Grappling (IBG)</span> is
          located on the near Eastside of Indianapolis and offers the{" "}
          <span class="font-bold italic text-primary">highest level</span> of
          training. <span class="font-bold">IBG</span> is home to competitors in
          professional MMA, professional boxing, and professional jiu-jitsu.
        </p>
        <p class="text-lg leading-relaxed">
          Come see the level of training that has allowed members of the sport
          to reach top level competition such as the{" "}
          <span class="text-primary font-bold italic">
            UFC, Bellator, and BKFC.
          </span>
        </p>
        <p class="text-lg leading-relaxed">
          Whether you're striving to{" "}
          <span class="text-primary font-bold italic">dominate</span> the
          competition or looking to build{" "}
          <span class="text-primary font-bold italic">confidence</span>,
          strength, and resilience, <span class="font-bold">IBG</span> is the
          ultimate place to{" "}
          <span class="text-primary font-bold italic">push your limits</span>,{" "}
          achieve your goals, and become the best version of yourself!
        </p>

        <div class="mt-4 flex gap-4">
          <a href="/signup" class="btn btn-primary text-lg md:btn-lg">
            Join Now
          </a>
          <a href="/pricingschedule" class="btn btn-outline text-lg md:btn-lg">
            See Schedule
          </a>
        </div>
      </div>
      <div class="md:w-80 flex">
        <img src="/images/ufc-staredown.jpg" alt="IBG member at the UFC" />
      </div>
    </section>
  );
}
