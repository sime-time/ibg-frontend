import ChooseProgram from "~/components/ChooseProgram";
import Pocketbase from "pocketbase";
import AccessDenied from "~/components/auth/AccessDenied";
import { onMount } from "solid-js";

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function Checkout() {
  if (!pb.authStore.isValid) {
    return (
      <AccessDenied />
    );
  }
  const member = pb.authStore.model

  return (
    <main>
      <ChooseProgram customerId={String(member?.stripe_customer_id)} />
    </main>
  );
}