import Pocketbase from "pocketbase";
import AccessDenied from "../components/AccessDenied";
import ChooseProgram from "~/components/ChooseProgram";

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function Checkout() {
  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return <AccessDenied />;
  }
  const member = pb.authStore.model;

  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <ChooseProgram customerId={member?.stripe_customer_id} />
    </main>
  );
}