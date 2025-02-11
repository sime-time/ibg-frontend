import { Title } from "@solidjs/meta";
import { Show, Switch, Match } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import AccessDenied from "~/components/AccessDenied";
import { CoachContextProvider } from "~/context/CoachContext";
import { clientOnly } from "@solidjs/start";
import LoadingSpinner from "~/components/ui/LoadingSpinner";

const CoachDashboard = clientOnly(() => import("~/components/coach/CoachDashboard"));

export default function Coach() {
  const { userIsAdmin, isAuthLoading } = usePocket();
  return (
    <>
      <Title>Coach Dashboard</Title>
      <main class="w-full flex justify-center mt-4 mb-20">
        <Switch fallback={<LoadingSpinner />}>
          <Match when={isAuthLoading()}>
            <LoadingSpinner />
          </Match>
          <Match when={userIsAdmin()}>
            <CoachContextProvider>
              <CoachDashboard />
            </CoachContextProvider>
          </Match>
          <Match when={!userIsAdmin()}>
            <AccessDenied />
          </Match>
        </Switch>
      </main>
    </>
  );
}
