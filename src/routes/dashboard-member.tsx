import Pocketbase from "pocketbase";
import { Button } from "~/components/ui/Button";
import { useNavigate, A } from "@solidjs/router";

export default function MemberDashboard() {
  const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);
  const navigate = useNavigate();
  const logOut = async () => {
    pb.authStore.clear();
    navigate("/login");
  }

  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return (
      <main class="text-white text-center">
        <p>You do not have access to this page. <A href="/login" class="underline">Go to login</A></p>
      </main>
    );
  }
  const member = pb.authStore.model;

  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Member Dashboard</h1>
      <h2>Welcome, {member?.email}!</h2>
      <Button onClick={logOut} class="bg-red-600/90 hover:bg-red-700 text-white">Logout</Button>
    </main>
  );
}

