export default function FacilityGallery() {
  return (
    <div class="py-8 px-[5%] md:px-[13%] ">
      {/*image-container*/}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
        <img
          class="md:col-span-2"
          src="/images/facility/heavybagroom.jpg"
          alt="heavy bag room"
        />
        <img src="/images/facility/sparring.jpg" alt="sparring session" />
        <img src="/images/facility/ibg-ring.jpg" alt="boxing ring" />
        <img
          class="md:col-span-2"
          src="/images/facility/mattroom.jpg"
          alt="matt room"
        />
        <img src="/images/facility/jiu-jitsu-class.jpg" alt="jiu jitsu class" />
        <img src="/images/facility/mma-class.jpg" alt="martial arts class" />
      </div>
    </div>
  );
}
