import { NavMenu } from "./Nav";
import { FaBrandsInstagram, FaBrandsSquareFacebook, FaSolidLocationDot } from "solid-icons/fa";

export default function Footer() {
  return (
    <footer class="py-16 px-4 md:px-16 lg:px-32">
      <div class="container mx-auto flex flex-col md:grid grid-cols-2 gap-8">

        <div class="grid grid-cols-2 gap-5">
          <div>
            <a class="flex flex-col gap-3" href="/">
              <img src="/logo.svg" alt="IBG Logo" width="100%" height="auto" class="max-w-32" />
              <img src="/images/indyboxing.png" alt="Indy Boxing Logo" width="100%" height="auto" class="max-w-32" />
            </a>
          </div>

          <ul class="leading-loose opacity-70">
            <li class="font-bold underline">Connect</li>
            <li class="flex items-center gap-2">
              <FaSolidLocationDot />
              <a href="https://maps.app.goo.gl/o84UTdgM7tfjiras7" target="_blank">4903 E 23rd St</a>
            </li>
            <li class="flex items-center gap-2">
              <FaBrandsInstagram />
              <a href="https://www.instagram.com/indy.boxing/" target="_blank">Instagram</a>
            </li>
            <li class="flex items-center gap-2">
              <FaBrandsSquareFacebook />
              <a href="https://www.facebook.com/IndyBoxingandGrappling" target="_blank">Facebook</a>
            </li>
          </ul>
        </div>

        <div class="grid grid-cols-2 gap-5 opacity-70 ">
          <ul class="leading-loose pl-6 md:pl-0">
            <li class="font-bold underline">Browse</li>
            <NavMenu />
          </ul>

          <ul class="leading-loose">
            <li class="font-bold underline">Programs</li>
            <li><a href="/pricingschedule#comp-boxing">Competitive Boxing</a></li>
            <li><a href="/pricingschedule#unlimited-boxing">Unlimited Boxing</a></li>
            <li><a href="/pricingschedule#jiu-jitsu">Jiu-Jitsu</a></li>
            <li><a href="/pricingschedule#mma">Mixed Martial Arts</a></li>
          </ul>
        </div>
      </div>

      <div class="text-center text-sm opacity-70 mt-8">
        <p>&copy; 2025 Indy Boxing and Grappling. All rights reserved.</p>
        <div class="flex gap-2 justify-center">
          <a href="/privacypolicy" class="link">Privacy Policy</a>
          <a href="/termsconditions" class="link">Terms and Conditions</a>
        </div>
        <p class="mt-2">website + app built by <a href="https://webundance.com" target="_blank" class="link">Simeon Dunn</a></p>
      </div>
    </footer>
  );
}
