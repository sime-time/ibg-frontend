export default function About() {
  return (
    <section class="bg-gray-900 py-16 px-8 md:px-16 flex flex-col md:flex-row justify-evenly gap-10 md:gap-0">
      <div class="flex flex-col gap-5 md:w-1/2">
        <h1 class="font-bold text-4xl">Indiana's <span class="text-primary">Elite</span> Martial Arts Gym</h1>
        <p class="text-lg leading-relaxed">Indy Boxing and Grappling is located on the near Eastside of Indianapolis and offers the <span class="text-primary">highest level of training</span> you could ask for. IBG is home to competitors in professional MMA, professional boxing, and professional jiu-jitsu.</p>
        <p class="text-lg leading-relaxed">Come see the level of training that has allowed members of the sport to reach top level competition such as the <span class="text-primary">UFC, Bellator, and BKFC.</span></p>
        <p class="text-lg leading-relaxed">Whether you're a serious competitor or a hobbyist just looking to <span class="text-primary">get in shape,</span> we are certain IBG will help you to <span class="text-primary">succeed in your goals.</span></p>
        <div class="mt-4">
          <a href="/signup" class="btn btn-primary text-lg md:btn-lg">Join Now</a>
        </div>
      </div>
      <div class="md:w-80">
        <img src="/images/ufc-staredown.jpg" alt="IBG fighter at UFC" />
      </div>
    </section>
  );
}
