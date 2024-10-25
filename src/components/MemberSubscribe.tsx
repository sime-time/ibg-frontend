import { createSignal, For, Show } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { Radio, RadioGroup } from "./ui/Radio";

interface CheckoutSessionResponse {
  url: string;
}

export default function MemberSubscribe() {
  const [martialArt, setMartialArt] = createSignal("");
  const [submitDisabled, setSubmitDisabled] = createSignal(false);
  const [error, setError] = createSignal("");
  const { user } = usePocket();
  const plans = [
    {
      name: "boxing",
      price: "70",
      priceId: "price_1Q30Yu06MCKUDe5TaDFKUmwn",
    },
    {
      name: "jiu-jitsu",
      price: "100",
      priceId: "price_1Q30ZV06MCKUDe5T8hxKMWhK",
    },
    {
      name: "mma",
      price: "120",
      priceId: "price_1Q3M2m06MCKUDe5TCJbaFfzR",
    }
  ];

  const handleSubmit = (async (e: Event) => {
    e.preventDefault();

    // use martial art to redirect to the correct payment link 
    for (let i = 0; i < plans.length; i++) {
      if (martialArt() === plans[i].name) {
        try {
          const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/checkout-session`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              customerId: user()?.stripe_customer_id,
              priceId: plans[i].priceId,
            }),
          });
          console.log(response);

          const data: CheckoutSessionResponse = await response.json();
          console.log(data)

          if (response.ok && data.url) {
            // redirect to the payment page 
            window.location.href = data.url;
          }
        } catch (error) {
          console.error("Error creating checkout session: ", error);
          setError("Internal server error. Try again later.");
        }
      }
    }
  });

  return (
    <div class="card bg-base-100 shadow-xl w-fit md:w-96">
      <form onSubmit={handleSubmit} class="card-body flex flex-col gap-6">
        <h1 class="card-title text-2xl font-bold">Choose Your Martial Art</h1>
        <RadioGroup initialValue={martialArt()} onChange={(program: string) => { setMartialArt(program) }}>
          <div class="flex flex-col gap-4 justify-center">
            <For each={plans}>
              {(plan) => (
                <Radio value={plan.name}>
                  <div class="flex gap-4 items-center">
                    <img src={`/images/${plan.name}.png`} alt={plan.name} class="size-16" />
                    <div class="flex flex-col">
                      <h2 class="text-2xl uppercase font-semibold">{plan.name}</h2>
                      <span class=" font-medium">${plan.price} / month</span>
                    </div>
                  </div>
                </Radio>
              )}
            </For>
          </div>
        </RadioGroup>
        <Show when={error()}>
          <p class="text-error">{error()}</p>
        </Show>
        <button type="submit" class="btn btn-primary" disabled={submitDisabled() || !martialArt()}>
          {submitDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Continue"}
        </button>
      </form>
    </div>
  );

}