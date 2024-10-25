import { Title } from "@solidjs/meta";
import { usePocket } from "~/context/PocketbaseContext";
import { createEffect, createSignal, Match, Switch } from "solid-js";
import AccessDenied from "~/components/AccessDenied";

export default function Member() {
  const { user, userIsMember } = usePocket();
  const [hasOnboarded, setHasOnboarded] = createSignal<boolean>(false);
  const [isSubscribed, setIsSubscribed] = createSignal<boolean>(false);

  createEffect(async () => {
    if (userIsMember()) {
      // onboarding requires birthdate submission
      setHasOnboarded(Boolean(user()?.birth_date));
      setIsSubscribed(Boolean(user()?.is_subscribed));
    }
    console.log("Member has onboarded: ", hasOnboarded());
    console.log("Member is subscribed: ", isSubscribed());
  });

  return <>
    <Title>Member Dashboard</Title>
    <main class="flex justify-center min-h-full mt-4">
      <Switch>
        <Match when={hasOnboarded() && isSubscribed()}>
          <div>Member dashboard</div>
        </Match>
        <Match when={!userIsMember()}>
          <AccessDenied />
        </Match>
        <Match when={!hasOnboarded()}>
          <div>Onboard process</div>
        </Match>
        <Match when={!isSubscribed()}>
          <div>Select Martial Art</div>
        </Match>
      </Switch>
    </main>
  </>
}