import { clientOnly } from "@solidjs/start";
import { Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import Pocketbase from "pocketbase";

const MemberDashboard = clientOnly(() => import("~/components/MemberDashboard"));
const Checkout = clientOnly(() => import("~/components/Checkout"));

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function MemberPage() {
  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return (
      <div class="text-white text-center">
        <p>You do not have access to this page.</p>
        <p>Already have an account? <A href="/login" class="underline text-red-700">Go to login</A></p>
      </div>
    );
  }

  const navigate = useNavigate();
  const member = pb.authStore.model;
  const isSubscribed: boolean = member?.is_subscribed;

  // if member has no birthdate, they have not completed onboarding yet
  if (!member?.birth_date) {
    navigate("/onboard");
  }

  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center w-full">
      <Show when={isSubscribed} fallback={
        <Checkout customerId={String(member?.stripe_customer_id)} />
      }>
        <MemberDashboard pb={pb} />
      </Show>
    </main>
  );
}
