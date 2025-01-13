import { A } from "@solidjs/router"

export default function CheckoutCancel() {
  return (
    <main class="flex flex-col gap-4 mt-24 text-center mx-auto">
      <h2 class="text-2xl font-bold">Checkout Cancelled</h2>
      <A href="/" class="underline text-error">Return to Home Page</A>
    </main>
  );
}
