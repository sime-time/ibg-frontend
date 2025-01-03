import { Title } from "@solidjs/meta";
import { usePocket } from "~/context/PocketbaseContext";
import { Switch, Match, createSignal } from "solid-js";
import { clientOnly } from "@solidjs/start";

const AccessDenied = clientOnly(() => import("~/components/AccessDenied"));
const MemberContactInfo = clientOnly(() => import("~/components/member/MemberContactInfo"));
const MemberSubscribe = clientOnly(() => import("~/components/member/MemberSubscribe"));
const MemberPricingTable = clientOnly((() => import("~/components/member/MemberPricingTable")));
const MemberDashboard = clientOnly(() => import("~/components/member/MemberDashboard"));

export default function Member() {
  const { user, userIsMember, refreshMember } = usePocket();

  const hasContactInfo = Boolean(user()?.phone_number);
  const [isSubscribed, setIsSubscribed] = createSignal(user()?.is_subscribed);

  refreshMember().then(() => {
    setIsSubscribed(user()?.is_subscribed);
  });

  return <>
    <Title>Member Dashboard</Title>
    <main class="flex justify-center min-h-full mt-4">
      <Switch fallback={<span class="loading loading-spinner loading-md"></span>}>
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
          <MemberPricingTable />
        </Match>
      </Switch>
    </main>
  </>
}
