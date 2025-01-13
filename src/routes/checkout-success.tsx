import { A } from "@solidjs/router"

export default function CheckoutSuccess() {
  return (
    <main class="flex flex-col gap-4 mt-24 text-center mx-auto">
      <h2 class="text-2xl font-bold">Checkout Successful <br />Thank You!</h2>
      <div><A href="/member" class="btn btn-primary">Go to your dashboard</A></div>
    </main>
  );
}
