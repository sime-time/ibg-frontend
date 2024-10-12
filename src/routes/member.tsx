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

  const member = pb.authStore.model;
  const navigate = useNavigate();

  // temp variables
  const isSubscribed: boolean = false;
  const waiverSigned: boolean = false;

  // if member has not subscribed or signed the liability waiver, redirect them 
  if (waiverSigned === false) {
    navigate("/waiver");
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
