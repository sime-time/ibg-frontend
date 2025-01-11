import { createSignal, Show } from "solid-js";
import { Title } from "@solidjs/meta";
import { FaBrandsGoogle, FaBrandsSquareFacebook, FaBrandsInstagram, FaSolidEnvelope } from 'solid-icons/fa'
import EmailSignUp from "~/components/auth/EmailSignUp";
import FacebookSDK from "~/components/auth/FacebookSDK";

export default function SignUp() {
  const [openEmailSignUp, setOpenEmailSignUp] = createSignal(false);

  return <>
    <Title>Sign Up - Indy Boxing and Grappling</Title>
    <FacebookSDK appId={""} />
    <main class="flex items-start justify-center min-h-full mt-4">
      <Show when={openEmailSignUp()} fallback={
        <div class="card bg-base-100 shadow-xl w-fit md:w-96">
          <div class="card-body">
            <h1 class="card-title text-2xl font-bold mb-3">Sign Up</h1>
            <div class="flex flex-col gap-4">
              <button class="btn btn-accent flex gap-3"><FaBrandsGoogle class="w-5 h-5 opacity-70" /> Continue with Google</button>
              <button class="btn btn-primary flex gap-3"><FaBrandsInstagram class="w-5 h-5 opacity-70" /> Continue with Instagram</button>
              <button class="btn btn-secondary flex gap-3"><FaBrandsSquareFacebook class="w-5 h-5 opacity-70" /> Continue with Facebook</button>
              <button class="btn btn-neutral flex gap-3" onClick={() => setOpenEmailSignUp(true)}><FaSolidEnvelope class="w-5 h-5 opacity-70" /> Continue with Email</button>
            </div>
          </div>
        </div>
      }>
        <EmailSignUp />
      </Show>
    </main>
  </>
}
