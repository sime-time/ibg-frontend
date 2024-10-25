import { FaBrandsGoogle, FaBrandsFacebook, FaBrandsInstagram } from 'solid-icons/fa'

export default function SocialAuth() {
  return (
    <div class="flex flex-col gap-4">
      <button class="btn btn-neutral flex gap-3"><FaBrandsInstagram class="w-5 h-5 opacity-70" /> Continue with Instagram</button>
      <button class="btn btn-neutral flex gap-3"><FaBrandsFacebook class="w-5 h-5 opacity-70" /> Continue with Facebook</button>
      <button class="btn btn-neutral flex gap-3"><FaBrandsGoogle class="w-5 h-5 opacity-70" /> Continue with Google</button>
    </div>
  );
}