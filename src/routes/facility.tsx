import { Title } from "@solidjs/meta";
import FacilityGallery from "~/components/FacilityGallery";
import Footer from "~/components/Footer";

export default function Facility() {
  return (
    <>
      <Title>Our Gym - Indy Boxing and Grappling</Title>
      <main>
        <section class="bg-gray-900">
          <div class="flex flex-col gap-5 pt-16 pb-8 px-8 md:px-[13%]">
            <h1 class="font-bold text-4xl">Our Gym</h1>
            <p class="text-xl leading-relaxed">
              Indy Boxing and Grappling has everything you need to train, compete, and lose weight. Our gym features a professional-sized boxing ring, heavy bags, Thai bags, speed bags, and a spacious mat area for a complete training experience. Whether you're here to get in shape or step into the ring, we've got you covered. Stop by for a tour and see it for yourself!
            </p>
          </div>
          <FacilityGallery />
        </section>
        <Footer />
      </main>
    </>
  );
}
