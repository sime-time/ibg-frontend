import { clientOnly } from "@solidjs/start";
import Pocketbase from "pocketbase";

const AccessDenied = clientOnly(() => import("~/components/AccessDenied"))
const OnboardForm = clientOnly(() => import("~/components/forms/OnboardForm"))
const ChooseProgram = clientOnly(() => import("~/components/ChooseProgram"))
const MemberDashboard = clientOnly(() => import("~/components/MemberDashboard"));

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function MemberPage() {
  const member = pb.authStore.model;
  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return <main><AccessDenied /></main>;

  } else if (!member?.birth_date) {
    return <main><OnboardForm memberName={member?.name} /></main>;

  } else if (!member?.is_subscribed) {
    return <main><ChooseProgram customerId={String(member?.stripe_customer_id)} /></main>

  } else {
    return (
      <main class="m-auto p-4 flex flex-col gap-6 items-center w-full">
        <MemberDashboard pb={pb} />
      </main>
    );
  }
}
