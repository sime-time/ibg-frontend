import ContactMemberForm from "~/components/forms/ContactMemberForm";
import Pocketbase from "pocketbase";
import { A } from "@solidjs/router";


const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function Waiver() {
  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return (
      <div class="text-white text-center">
        <p>You do not have access to this page.</p>
        <p>Already have an account? <A href="/login" class="underline text-red-700">Go to login</A></p>
      </div>
    );
  }

  const member = pb.authStore.model;

  // show liability waiver after member inputs birth date 
  // if member under 18, require guardian signature


  return (
    <main class="w-full">
      <ContactMemberForm />
    </main>
  );
}