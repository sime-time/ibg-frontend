import { clientOnly } from "@solidjs/start";
import { Show } from "solid-js";
import { A } from "@solidjs/router";
import Pocketbase from "pocketbase";

const MemberDashboard = clientOnly(() => import("~/components/MemberDashboard"));
const SelectSubscription = clientOnly(() => import("~/components/SelectSubscription"));

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function DashboardMember() {
  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return (
      <div class="text-white text-center">
        <p>You do not have access to this page.</p>
        <p>Already have an account? <A href="/login" class="underline text-red-700">Go to login</A></p>
      </div>
    );
  }

  const member = pb.authStore.model;
  // determine if member needs to be onboarded (no subscription)
  const isSubscribed: boolean = false;

  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center w-full">
      <Show when={isSubscribed} fallback={<SelectSubscription email={member?.email} />}>
        <MemberDashboard pb={pb} />
      </Show>
    </main>
  );
}
