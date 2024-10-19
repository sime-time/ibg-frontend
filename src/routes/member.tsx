import { clientOnly } from "@solidjs/start";
import { createSignal, Show, onMount } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import Pocketbase from "pocketbase";
import AccessDenied from "~/components/auth/AccessDenied";

const MemberDashboard = clientOnly(() => import("~/components/MemberDashboard"));
const Checkout = clientOnly(() => import("~/components/ChooseProgram"));

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function MemberPage() {
  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return (
      <AccessDenied />
    );
  }


  onMount(() => {
    const member = pb.authStore.model;
    const navigate = useNavigate();

    // if member has no birthdate, they have not completed onboarding yet
    if (!member?.birth_date) {
      navigate("/onboard");
    }

    // if member has not subscribed, lead them to checkout 
    if (member?.is_subscribed === false) {
      navigate("/checkout")
    }


  });

  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center w-full">
      <MemberDashboard pb={pb} />
    </main>
  );
}
