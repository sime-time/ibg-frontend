import { clientOnly } from "@solidjs/start";
import Pocketbase from "pocketbase";
import { createSignal, Match, Switch } from "solid-js";

const AccessDenied = clientOnly(() => import("~/components/AccessDenied"))
const OnboardForm = clientOnly(() => import("~/components/forms/OnboardForm"))
const ChooseProgram = clientOnly(() => import("~/components/ChooseProgram"))
const MemberDashboard = clientOnly(() => import("~/components/MemberDashboard"));

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function MemberPage() {
  const member = pb.authStore.model;
  const [hasBirthDate, setHasBirthDate] = createSignal<boolean>(false);
  const [isSubscribed, setIsSubscribed] = createSignal<boolean>(false);

  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return <main><AccessDenied /></main>;
  } else {
    console.log("Birthdate: ", member?.birth_date);
    console.log("Is Subscribed: ", member?.is_subscribed);

    setHasBirthDate(Boolean(member?.birth_date));
    setIsSubscribed(Boolean(member?.is_subscribed));
  }

  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center w-full">
      <Switch>
        <Match when={hasBirthDate() == false}>
          <OnboardForm memberName={member?.name} />
        </Match>
        <Match when={isSubscribed() == false}>
          <ChooseProgram customerId={String(member?.stripe_customer_id)} />
        </Match>
        <Match when={hasBirthDate() && isSubscribed()}>
          <MemberDashboard pb={pb} />
        </Match>
      </Switch>
    </main>
  );
}
