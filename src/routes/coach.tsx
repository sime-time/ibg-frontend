import { clientOnly } from "@solidjs/start";
import Pocketbase from "pocketbase";
import AccessDenied from "../components/AccessDenied";

const CoachDashboard = clientOnly(() => import("~/components/CoachDashboard"));

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function CoachPage() {
  if (!pb.authStore.isValid || !pb.authStore.isAdmin) {
    return <AccessDenied />;
  }

  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Coach Dashboard</h1>
      <CoachDashboard pb={pb} />
    </main>
  );
}