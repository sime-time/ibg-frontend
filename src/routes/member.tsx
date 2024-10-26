import { Title } from "@solidjs/meta";
import { usePocket } from "~/context/PocketbaseContext";
import { Switch, Match, createEffect, createSignal, onMount } from "solid-js";
import { clientOnly } from "@solidjs/start";

const AccessDenied = clientOnly(() => import("~/components/AccessDenied"));
const MemberContactInfo = clientOnly(() => import("~/components/member/MemberContactInfo"));
const MemberSubscribe = clientOnly(() => import("~/components/member/MemberSubscribe"));
const MemberDashboard = clientOnly(() => import("~/components/member/MemberDashboard"));

export default function Member() {
  const { user, userIsMember, refreshMember } = usePocket();

  const hasContactInfo: boolean = Boolean(user()?.phone_number);
  const [isSubscribed, setIsSubscribed] = createSignal(user()?.is_subscribed);

  refreshMember().then(() => {
    setIsSubscribed(user()?.is_subscribed);
    console.log("User subbed: ", isSubscribed());
  });

  return <>
    <Title>Member Dashboard</Title>
    <main class="flex justify-center min-h-full mt-4">
      <Switch>
        <Match when={hasContactInfo && isSubscribed()}>
          <MemberDashboard />
        </Match>
        <Match when={!userIsMember()}>
          <AccessDenied />
        </Match>
        <Match when={!hasContactInfo}>
          <MemberContactInfo />
        </Match>
        <Match when={!isSubscribed()}>
          <MemberSubscribe />
        </Match>
      </Switch>
    </main>
  </>
}