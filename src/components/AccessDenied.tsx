import { A } from "@solidjs/router";

export default function AccessDenied() {
  return (
    <div class="text-white text-center">
      <p>You do not have access to this page.</p>
      <p>Not a member yet? <A href="/signup" class="underline text-red-700">Sign up here</A></p>
    </div>
  );
}