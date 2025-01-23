import { onMount, createSignal, onCleanup, Show, For } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";

interface ClientSecretResponse {
  client_secret: string;
}

export default function MemberPricingTable() {
  const { memberPayWithCash, user } = usePocket();
  const [clientSecret, setClientSecret] = createSignal("");
  const [error, setError] = createSignal("");
  const [payWithCashSelected, setPayWithCashSelected] = createSignal(false);
  const [submitDisabled, setSubmitDisabled] = createSignal(false);

  let divRef!: HTMLDivElement;

  // add essential stripe <script> to page
  onMount(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.head.appendChild(script);

    onCleanup(() => {
      document.head.removeChild(script);
    });
  });

  onMount(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_POCKETBASE_URL}/client-secret`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            customerId: user()?.stripe_customer_id,
          }),
        }
      );

      const data: ClientSecretResponse = await response.json();

      if (response.ok && data.client_secret) {
        setClientSecret(data.client_secret);
      }
    } catch (error) {
      console.error("Error fetching client secret: ", error);
    }

    const table = document.createElement("stripe-pricing-table");
    table.setAttribute(
      "pricing-table-id",
      import.meta.env.VITE_STRIPE_PRICING_TABLE_ID
    );
    table.setAttribute("publishable-key", import.meta.env.VITE_STRIPE_PUB_KEY);
    table.setAttribute("customer-session-client-secret", clientSecret());

    if (divRef) {
      divRef.appendChild(table);
    }

    return () => {
      if (divRef && divRef.contains(table)) {
        divRef.removeChild(table);
      }
    };
  });

  // "Pay with cash" option sets is_subscribed and pay_with_cash to true for this member
  const setPayWithCash = async (e: Event, program: string) => {
    e.preventDefault();
    setError("");
    setSubmitDisabled(true);
    const memberId = user()?.id;
    try {
      const success = await memberPayWithCash(memberId, true, program);
      if (success) {
        location.reload();
      } else {
        throw new Error("Internal Server Error");
      }
    } catch (err) {
      console.error(err);
      setError(
        "Error paying with cash. Please try again or select a subscription option."
      );
    } finally {
      setSubmitDisabled(false);
    }
  };

  const CashProgramOptions = () => {
    const programs = [
      "Competitive Boxing",
      "Jiu-Jitsu",
      "Unlimited Boxing",
      "MMA",
    ];
    return (
      <form class="flex flex-row gap-5">
        <For each={programs}>
          {(program, index) => (
            <button
              type="submit"
              class="btn btn-success"
              disabled={submitDisabled()}
              onClick={(e: Event) => setPayWithCash(e, program)}
            >
              {program}
            </button>
          )}
        </For>
      </form>
    );
  };

  return (
    <section class="w-full flex flex-col mb-10">
      <div class="w-full flex flex-col justify-center">
        <div class="flex flex-col items-center justify-center gap-5 px-9">
          <Show
            when={payWithCashSelected()}
            fallback={
              <button
                class="btn btn-success w-full md:w-fit text-lg"
                onClick={() => setPayWithCashSelected(true)}
              >
                Pay with Cash
              </button>
            }
          >
            <CashProgramOptions />
          </Show>
          <Show when={error()}>
            <p class="text-error">{error()}</p>
          </Show>
          <p class="opacity-70 text-wrap text-center">
            You must provide payment to the coach in-person every month (cash or
            check).
          </p>
        </div>
        <div class="divider my-10 text-xl font-bold">OR</div>
      </div>
      <div ref={divRef} class="w-full"></div>
    </section>
  );
}
