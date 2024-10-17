import Pocketbase from "pocketbase";
import { A } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";

const MemberContactForm = clientOnly(() => import("~/components/forms/MemberContactForm"));

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function Onboard() {
  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return (
      <div class="text-white text-center">
        <p>You do not have access to this page.</p>
        <p>Already have an account? <A href="/login" class="underline text-red-700">Go to login</A></p>
      </div>
    );
  }

  const member = pb.authStore.model;

  return (
    <main class="w-full">
      <MemberContactForm memberName={member?.name} />
    </main>
  );
}