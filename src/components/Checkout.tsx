import { createSignal, For } from "solid-js";
import { Button } from "~/components/ui/Button";
import Radio, { RadioGroup } from "~/components/ui/Radio";

interface CheckoutProps {
  customerId: string;
}
interface CheckoutSessionResponse {
  url: string;
}

export default function Checkout(props: CheckoutProps) {
  const [martialArt, setMartialArt] = createSignal("");
  const [message, setMessage] = createSignal("");

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

  const handleSubmit = (async (event: Event) => {
    event.preventDefault();

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
              customerId: props.customerId,
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
          setMessage("Internal server error. Try again later.");
        }
      }
    }

    // if for loop of plans is exhausted: 
    if (message() === "") {
      setMessage("You must select a martial art");
    }
  });


  return (
    <form onSubmit={handleSubmit} class="w-fit m-auto flex flex-col gap-6">
      <h1 class="text-3xl text-center font-bold">Choose Your Martial Art</h1>
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
      {message() &&
        <p class="text-red-500">{message()}</p>
      }
      <Button type="submit" class="bg-red-600/90 hover:bg-red-700 text-white text-lg font-semibold py-6 mt-2">Continue</Button>
    </form >
  );
}

