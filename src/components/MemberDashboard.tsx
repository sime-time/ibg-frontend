import Pocketbase from "pocketbase";
import { useNavigate, A } from "@solidjs/router";
import LogoutButton from "./LogoutButton";

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function MemberDashboard() {
  const navigate = useNavigate();
  const logOut = async () => {
    pb.authStore.clear();
    navigate("/login");
  }

  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return (
      <div class="text-white text-center">
        <p>You do not have access to this page.</p>
        <p>Already have an account? <A href="/login" class="underline text-red-700">Go to login</A></p>
      </div>
    );
  }

  const member = pb.authStore.model;

  return (
    <>
      <h2 class="text-2xl">Welcome, {member?.name}!</h2>
      <LogoutButton pb={pb} />
    </>
  );
}