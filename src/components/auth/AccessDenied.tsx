import { A } from "@solidjs/router";

export default function AccessDenied() {
  return (
    <div class="text-white text-center">
      <p>You do not have access to this page.</p>
      <p>Already have an account? <A href="/login" class="underline text-red-700">Go to login</A></p>
    </div>
  );
}