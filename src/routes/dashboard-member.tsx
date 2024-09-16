import { clientOnly } from "@solidjs/start";

const MemberDashboard = clientOnly(() => import("~/components/MemberDashboard"));

export default function DashboardMember() {
  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Member Dashboard</h1>
      <MemberDashboard />
    </main>
  );
}
