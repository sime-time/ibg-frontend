export default function CheckoutCancel() {
  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 font-thin uppercase ">Checkout Cancelled</h1>
      <div>
        <a href="/" class="rounded-md bg-red-600/90 hover:bg-red-700 text-white py-3 px-5">Return to Home page</a>
      </div>
    </main>
  );
}