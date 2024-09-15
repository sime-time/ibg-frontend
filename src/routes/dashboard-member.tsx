import Pocketbase from "pocketbase";
import { Button } from "~/components/ui/Button";
import { useNavigate, A } from "@solidjs/router";
import { Show } from "solid-js";

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function MemberDashboard() {
  const navigate = useNavigate();
  const logOut = async () => {
    pb.authStore.clear();
    navigate("/login");
  }

  const member = pb.authStore.model;

  return (
    <Show
      when={pb.authStore.isValid && !pb.authStore.isAdmin}
      fallback={
        <main class="text-white text-center">
          <p>You do not have access to this page. <A href="/login" class="underline">Go to login</A></p>
        </main>
      }
    >
      <main class="m-auto p-4 flex flex-col gap-6 items-center">
        <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Member Dashboard</h1>
        <h2>Welcome, {member?.name}!</h2>
        <Button onClick={logOut} class="bg-red-600/90 hover:bg-red-700 text-white">Logout</Button>
      </main>
    </Show>

  );
}

