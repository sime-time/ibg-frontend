import { clientOnly } from "@solidjs/start";
import Pocketbase from "pocketbase";
import { createEffect, createSignal, Match, Switch } from "solid-js";

const AccessDenied = clientOnly(() => import("~/components/AccessDenied"))
const OnboardForm = clientOnly(() => import("~/components/forms/OnboardForm"))
const ChooseProgram = clientOnly(() => import("~/components/ChooseProgram"))
const MemberDashboard = clientOnly(() => import("~/components/MemberDashboard"));

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function MemberPage() {
  const [isMember, setIsMember] = createSignal<boolean>(false);
  const [hasBirthDate, setHasBirthDate] = createSignal<boolean>(false);
  const [isSubscribed, setIsSubscribed] = createSignal<boolean>(false);

  const member = pb.authStore.model;

  createEffect(() => {
    setIsMember(Boolean(!pb.authStore.isValid || pb.authStore.isAdmin));
    setHasBirthDate(Boolean(member?.birth_date));
    setIsSubscribed(Boolean(member?.is_subscribed));
    console.log("Is Member: ", isMember());
    console.log("Birthdate: ", hasBirthDate());
    console.log("Is Subscribed: ", isSubscribed());
  });

  return (
    //class="m-auto p-4 flex flex-col gap-6 items-center w-full"
    <main >
      <Switch>
        <Match when={isMember() == false}>
          <AccessDenied />
        </Match>
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
