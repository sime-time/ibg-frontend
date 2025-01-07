import { FaBrandsInstagram, FaBrandsSquareFacebook } from 'solid-icons/fa'
export default function Contact() {
  return (
    <section class="bg-gray-900 py-16 px-8 md:px-16 flex flex-col md:flex-row justify-evenly gap-10 md:gap-0">
      <div class="flex flex-col gap-5 md:w-1/2">
        <h1 class="font-bold text-4xl">Get In Touch</h1>
        <p class="text-lg leading-relaxed">The best way to contact IBG is through directly messaging our Instagram and Facebook profiles. Please refer to the FAQ and then follow up with any questions we may not have answered there.
        </p>
        <p class="text-lg leading-relaxed">We always welcome walk-ins. So if you're not sure, or have more questions, just visit the gym for any class and we can help you get the information you need!</p>
      </div>
      <div class="flex flex-col justify-evenly gap-6 md:gap-0">
        <a href="https://www.instagram.com/indy.boxing/" class="btn btn-lg btn-primary text-sm">
          <FaBrandsInstagram class="size-12" />
          @indy.boxing
        </a>
        <a href="https://www.facebook.com/IndyBoxingandGrappling" class="btn btn-lg btn-secondary text-sm">
          <FaBrandsSquareFacebook class="size-12" />
          @IndyBoxingandGrappling
        </a>
      </div>
    </section>
  );
}
