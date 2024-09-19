import Pocketbase from "pocketbase";
import { A } from "@solidjs/router";
import LogoutButton from "./LogoutButton";


const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function MemberDashboard() {

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
      <h1>Choose a martial art</h1>
      <div class="flex gap-10">
        <button class="size-32 bg-red-600/90 rounded-md">
          <img src="/images/boxing-gloves.png" alt="boxing" />
        </button>
        <button class="size-32 bg-red-600/90 rounded-md">
          <img src="/images/bjj-belt.png" alt="brazilian jiu jitsu" />
        </button>
      </div>
      <LogoutButton pb={pb} />
    </>
  );
}