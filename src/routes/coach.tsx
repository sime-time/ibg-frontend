import { Title } from "@solidjs/meta";
import { Show } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { usePocket } from "~/context/PocketbaseContext";

const AccessDenied = clientOnly(() => import("~/components/AccessDenied"));
const CoachDashboard = clientOnly(() => import("~/components/coach/CoachDashboard"));

export default function Coach() {
  const { userIsAdmin } = usePocket();

  return <>
    <Title>Coach Dashboard</Title>
    <main class="flex justify-center min-h-full mt-4">
      <Show when={userIsAdmin()} fallback={<AccessDenied />}>
        <CoachDashboard />
      </Show>
    </main>
  </>
}
