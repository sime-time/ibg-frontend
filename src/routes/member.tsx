import { Title } from "@solidjs/meta";
import { usePocket } from "~/context/PocketbaseContext";
import { createEffect, createSignal, Match, Switch } from "solid-js";
import { clientOnly } from "@solidjs/start";

const AccessDenied = clientOnly(() => import("~/components/AccessDenied"));
const MemberContactInfo = clientOnly(() => import("~/components/MemberContactInfo"));


export default function Member() {
  const { user, userIsMember } = usePocket();
  const [hasContactInfo, setHasContactInfo] = createSignal<boolean>(false);
  const [isSubscribed, setIsSubscribed] = createSignal<boolean>(false);

  createEffect(async () => {
    if (userIsMember()) {
      setHasContactInfo(Boolean(user()?.birth_date));
      setIsSubscribed(Boolean(user()?.is_subscribed));
    }
    console.log("Member has contact info: ", hasContactInfo());
    console.log("Member is subscribed: ", isSubscribed());
  });

  return <>
    <Title>Member Dashboard</Title>
    <main class="flex justify-center min-h-full mt-4">
      <Switch>
        <Match when={hasContactInfo() && isSubscribed()}>
          <div>Member dashboard</div>
        </Match>
        <Match when={!userIsMember()}>
          <AccessDenied />
        </Match>
        <Match when={!hasContactInfo()}>
          <MemberContactInfo />
        </Match>
        <Match when={!isSubscribed()}>
          <div>Select Martial Art</div>
        </Match>
      </Switch>
    </main>
  </>
}