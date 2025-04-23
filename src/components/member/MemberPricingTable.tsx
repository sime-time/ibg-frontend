import { onMount, createSignal, onCleanup, Show, For, Switch, Match } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { plans, PlanProps } from "~/types/PlanType";
import { SiCashapp } from 'solid-icons/si'
import { FaBrandsApple, FaBrandsCcApplePay, FaBrandsGoogle, FaBrandsGooglePay } from 'solid-icons/fa'
import { BsCreditCard2BackFill, BsCash } from 'solid-icons/bs'

interface ClientSecretResponse {
  client_secret: string;
}

export default function MemberPricingTable() {
  const { memberPayWithCash, user } = usePocket();
  const [clientSecret, setClientSecret] = createSignal("");
  const [error, setError] = createSignal("");
  const [payCashIsVisible, setPayCashIsVisible] = createSignal(false);
  const [submitDisabled, setSubmitDisabled] = createSignal(false);
  const [pricingTableIsVisible, setPricingTableIsVisible] = createSignal(false);

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
    return (
      <form class="flex flex-col md:flex-row gap-5">
        <For each={plans}>
          {(plan, index) => (
            <button
              type="submit"
              class="btn btn-success"
              disabled={submitDisabled()}
              onClick={(e: Event) => setPayWithCash(e, plan.name)}
            >
              {`${plan.name} ($${plan.price} per month)`}

            </button>
          )}
        </For>
      </form>
    );
  };

  return (
    <section class="w-full flex flex-col mb-10">
      <Show when={error()}>
        <p class="text-error">{error()}</p>
      </Show>
      <div class="flex flex-col items-center justify-center gap-5 px-9 w-full" >
        <Show when={!payCashIsVisible() && !pricingTableIsVisible()}>
          <>
            <h1 class="font-semibold text-2xl">How do you prefer to pay?</h1>
            <button
              class="btn btn-primary w-full md:w-fit text-lg"
              onClick={() => setPayCashIsVisible(true)}
            >
              <BsCash />
              Cash
            </button>
            <button
              class="btn btn-secondary w-full md:w-fit text-lg"
              onClick={() => setPricingTableIsVisible(true)}
            >
              <BsCreditCard2BackFill />
              Card
            </button>
            <button
              class="btn w-full md:w-fit text-lg btn-primary text-gray-200 bg-black border-black focus:bg-neutral-700 hover:bg-neutral-700 hover:border-neutral-700"
              onClick={() => setPricingTableIsVisible(true)}
            >
              <FaBrandsApple />
              Apple Pay
            </button>
            <button
              class="btn btn-success w-full md:w-fit text-lg"
              onClick={() => setPricingTableIsVisible(true)}
            >
              <SiCashapp />
              Cash App
            </button>
            <button
              class="btn btn-accent w-full md:w-fit text-lg "
              onClick={() => setPricingTableIsVisible(true)}
            >
              <FaBrandsGoogle />
              Google Pay
            </button>
          </>
        </Show>
        <div class={`w-full flex-col items-center justify-center gap-5 ${payCashIsVisible() ? "flex" : "hidden"}`}>
          <CashProgramOptions />
          <p class="opacity-70 text-wrap text-center">
            You must provide payment to the coach in-person every month (cash or check).
          </p>
          <button class="btn btn-ghost" onClick={() => setPayCashIsVisible(false)}>Return to payment options</button>
        </div>
        <div class={`w-full flex flex-col justify-center items-center gap-5 ${pricingTableIsVisible() ? "visible" : "invisible"}`}>
          <div ref={divRef} class="w-full"></div>
        </div>
      </div>
    </section>
  );
}
