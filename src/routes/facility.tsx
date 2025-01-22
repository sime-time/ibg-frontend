import { Title } from "@solidjs/meta";
import FacilityGallery from "~/components/FacilityGallery";
import Footer from "~/components/Footer";

export default function Facility() {
  return (
    <>
      <Title>Contact Us - Indy Boxing and Grappling</Title>
      <main>
        <section class="bg-gray-900">
          <div class="flex flex-col gap-5 pt-16 pb-8 px-8 md:px-[13%]">
            <h1 class="font-bold text-4xl">Our Facility</h1>
            <p class="text-xl leading-relaxed">
              Indy Boxing and Grappling provides our members with all the
              necessary tools for success. A professional-sized boxing ring,
              heavy/Thai bags, and a huge mat space combine for a complete
              training experience for our team. Visit us in person for a tour.
            </p>
          </div>
          <FacilityGallery />
        </section>
        <Footer />
      </main>
    </>
  );
}
