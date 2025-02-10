import { Title } from "@solidjs/meta";
import { Show } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import AccessDenied from "~/components/AccessDenied";
import { CoachContextProvider } from "~/context/CoachContext";
import { clientOnly } from "@solidjs/start";

const CoachDashboard = clientOnly(() => import("~/components/coach/CoachDashboard"));

export default function Coach() {
  const { userIsAdmin } = usePocket();
  return (
    <CoachContextProvider>
      <Title>Coach Dashboard</Title>
      <main class="w-full flex justify-center mt-4 mb-20">
        <Show when={userIsAdmin()} fallback={<AccessDenied />}>
          <CoachDashboard />
        </Show>
      </main>
    </CoachContextProvider>
  );
}
