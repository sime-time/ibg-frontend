import { clientOnly } from "@solidjs/start";

const CoachDashboard = clientOnly(() => import("~/components/CoachDashboard"));

export default function DashboardCoach() {
  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Coach Dashboard</h1>
      <CoachDashboard />
    </main>
  );
}