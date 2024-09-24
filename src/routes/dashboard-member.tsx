import { clientOnly } from "@solidjs/start";

const MemberDashboard = clientOnly(() => import("~/components/MemberDashboard"));
const MemberOnboard = clientOnly(() => import("~/components/MemberOnboard"));

export default function DashboardMember() {
  // determine if member needs to be onboarded (no subscription)
  const isSubscribed: boolean = false;


  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center w-full">
      <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Member Dashboard</h1>
      {isSubscribed ? <MemberDashboard /> : <MemberOnboard />}
    </main>
  );
}
