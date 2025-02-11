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
              Indy Boxing and Grappling transforms bodies through intense martial arts training. Our professional facilities offer a boxing ring, heavy bags, and mat areas designed to burn fat and build fighter-level fitness. Cut weight, build muscle, and unleash your inner champion. <span class="link-primary link font-bold">Sign up today!</span>
            </p>
          </div>
          <FacilityGallery />
        </section>
        <Footer />
      </main>
    </>
  );
}
