export default function About() {
  return (
    <section class="py-16 bg-gray-900 flex justify-evenly">
      <div class="flex flex-col gap-5">
        <h1 class="font-bold text-4xl">Indiana's <span class="text-primary">Elite</span> Martial Arts Gym</h1>
        <p class="text-lg">Indy Boxing and Grappling is located on the near Eastside of Indianapolis and offers the highest level of training you could ask for. IBG is home to competitors in professional MMA, professional boxing, and professional jiu-jitsu. Come see the level of training that has allowed members of the sport to reach top level competition such as the UFC, Bellator, and BKFC.</p>
        <p class="text-lg">Whether you're a serious competitor or a hobbyist just looking to get in shape, we are certain IBG will help you to succeed in your goals.</p>
        <div>
          <a href="/signup" class="btn btn-primary text-lg">Join Now</a>
        </div>
      </div>
      <div>
        <img src="/images/ufc-staredown.jpg" alt="IBG fighter at UFC" />
      </div>
    </section>
  );
}
