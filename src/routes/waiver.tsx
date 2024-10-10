import Pocketbase from "pocketbase";
import { A } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { Show, createSignal } from "solid-js";

const ContactMemberForm = clientOnly(() => import("~/components/forms/ContactMemberForm"));
const LiabilityWaiver = clientOnly(() => import("~/components/forms/LiabilityWaiver"));

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function Waiver() {
  const [hasBirthDate, setHasBirthDate] = createSignal(false)
  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return (
      <div class="text-white text-center">
        <p>You do not have access to this page.</p>
        <p>Already have an account? <A href="/login" class="underline text-red-700">Go to login</A></p>
      </div>
    );
  }

  const member = pb.authStore.model;

  // show liability waiver after member inputs birth date 
  // if member under 18, require guardian signature
  if (member?.birth_date) {
    setHasBirthDate(true);

  }

  return (
    <main class="w-full">
      <Show when={hasBirthDate()} fallback={
        <ContactMemberForm />
      }>
        <LiabilityWaiver />
      </Show>
    </main>
  );
}