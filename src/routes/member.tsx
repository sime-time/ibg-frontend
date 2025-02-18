import { Title } from "@solidjs/meta";
import { usePocket } from "~/context/PocketbaseContext";
import { Switch, Match, createSignal, createEffect, onMount } from "solid-js";
import { clientOnly } from "@solidjs/start";

const AccessDenied = clientOnly(() => import("~/components/AccessDenied"));
const MemberContactInfo = clientOnly(
  () => import("~/components/member/MemberContactInfo")
);
const MemberPricingTable = clientOnly(
  () => import("~/components/member/MemberPricingTable")
);
const MemberDashboard = clientOnly(
  () => import("~/components/member/MemberDashboard")
);
const MemberWaiver = clientOnly(
  () => import("~/components/member/MemberWaiver")
);

export default function Member() {
  const { user, userIsMember, refreshMember } = usePocket();

  const [hasContactInfo, setHasContactInfo] = createSignal<boolean>(Boolean(user()?.phone_number))
  const [hasAcceptedWaiver, setHasAcceptedWaiver] = createSignal<boolean>(Boolean(user()?.waiver_accepted))
  const [isSubscribed, setIsSubscribed] = createSignal(user()?.is_subscribed);

  createEffect(async () => {
    /* when user is redirected back to member page from stripe checkout
    this member must be refreshed to check if user is subscribed again.*/
    refreshMember().then(() => {
      setHasContactInfo(Boolean(user()?.phone_number));
      setHasAcceptedWaiver(Boolean(user()?.waiver_accepted));
      setIsSubscribed(user()?.is_subscribed);
    });
  });

  onMount(() => {
    setHasContactInfo(Boolean(user()?.phone_number));
    setHasAcceptedWaiver(Boolean(user()?.waiver_accepted));
    setIsSubscribed(user()?.is_subscribed);
  });

  return (
    <>
      <Title>Member Dashboard</Title>
      <main class="flex justify-center mt-4">
        <Switch
          fallback={<span class="loading loading-spinner loading-md"></span>}
        >
          <Match when={hasContactInfo() && isSubscribed() && hasAcceptedWaiver()}>
            <MemberDashboard />
          </Match>
          <Match when={!userIsMember()}>
            <AccessDenied />
          </Match>
          <Match when={!hasContactInfo()}>
            <MemberContactInfo />
          </Match>
          <Match when={!hasAcceptedWaiver()}>
            <MemberWaiver />
          </Match>
          <Match when={!isSubscribed()}>
            <MemberPricingTable />
          </Match>
        </Switch>
      </main>
    </>
  );
}
