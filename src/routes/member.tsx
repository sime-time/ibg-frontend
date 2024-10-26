import { Title } from "@solidjs/meta";
import { usePocket } from "~/context/PocketbaseContext";
import { Switch, Match, createEffect, createSignal } from "solid-js";
import { clientOnly } from "@solidjs/start";

const AccessDenied = clientOnly(() => import("~/components/AccessDenied"));
const MemberContactInfo = clientOnly(() => import("~/components/MemberContactInfo"));
const MemberSubscribe = clientOnly(() => import("~/components/MemberSubscribe"));
const MemberDashboard = clientOnly(() => import("~/components/MemberDashboard"));


export default function Member() {
  const { user, userIsMember, refreshMember } = usePocket();
  const hasContactInfo: boolean = Boolean(user()?.phone_number);
  const [isSubscribed, setIsSubscribed] = createSignal(user()?.is_subscribed);

  createEffect(async () => {
    refreshMember().then(setIsSubscribed(user()?.is_subscribed))
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