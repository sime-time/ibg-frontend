import { clientOnly } from "@solidjs/start";
import Pocketbase from "pocketbase";
import { createEffect, createSignal, Match, Switch } from "solid-js";

const AccessDenied = clientOnly(() => import("~/components/AccessDenied"))
const OnboardForm = clientOnly(() => import("~/components/forms/OnboardForm"))
const MemberDashboard = clientOnly(() => import("~/components/MemberDashboard"));

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function MemberPage() {
  const [isMember, setIsMember] = createSignal<boolean>(false);
  const [hasBirthDate, setHasBirthDate] = createSignal<boolean>(false);
  const [memberName, setMemberName] = createSignal("");

  createEffect(() => {
    pb.collection("member").authRefresh();
    const member = pb.authStore.model;

    setIsMember(Boolean(pb.authStore.isValid && !pb.authStore.isAdmin));
    setHasBirthDate(Boolean(member?.birth_date));
    setMemberName(String(member?.name));

    console.log("Is Member: ", isMember());
    console.log("Birthdate: ", hasBirthDate());
  });

  return (
    <main>
      <Switch>
        <Match when={isMember() == false}>
          <AccessDenied />
        </Match>
        <Match when={hasBirthDate() == false}>
          <OnboardForm memberName={memberName()} />
        </Match>
        <Match when={hasBirthDate()}>
          <MemberDashboard pb={pb} />
        </Match>
      </Switch>
    </main>
  );
}
