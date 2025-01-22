export default function FacilityGallery() {
  return (
    <div class="py-8 px-[5%] md:px-[13%] ">
      {/*image-container*/}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
        <img
          class="md:col-span-2"
          src="/images/facility/heavybagroom.webp"
          alt="heavy bag room"
        />
        <img src="/images/facility/sparring.webp" alt="sparring session" />
        <img src="/images/facility/ibg-ring.webp" alt="boxing ring" />
        <img
          class="md:col-span-2"
          src="/images/facility/mattroom.webp"
          alt="matt room"
        />
        <img
          src="/images/facility/jiu-jitsu-class.webp"
          alt="jiu jitsu class"
        />
        <img src="/images/facility/mma-class.webp" alt="martial arts class" />
      </div>
    </div>
  );
}
