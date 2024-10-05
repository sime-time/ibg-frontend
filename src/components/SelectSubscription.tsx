import { createSignal, For } from "solid-js";
import { Button } from "~/components/ui/Button";
import Radio, { RadioGroup } from "~/components/ui/Radio";

interface SelectSubscriptionProps {
  email: string;
}

export default function SelectSubscription(props: SelectSubscriptionProps) {
  const [martialArt, setMartialArt] = createSignal("");
  const [errorMessage, setErrorMessage] = createSignal("");

  const plans = [
    {
      name: "boxing",
      price: "70",
      paymentLink: "https://buy.stripe.com/test_eVadSg3P373W7hS144",
    },
    {
      name: "jiu-jitsu",
      price: "100",
      paymentLink: "https://buy.stripe.com/test_eVadSg3P373W7hS144",
    },
    {
      name: "mma",
      price: "120",
      paymentLink: "https://buy.stripe.com/test_eVadSg3P373W7hS144",
    }
  ];

  // percent encode the email address 
  const encodedEmail = props.email.replace("@", "%40")

  const handleSubmit = (async (event: Event) => {
    event.preventDefault();
    console.log(martialArt());

    // use martial art to redirect to the correct payment link 
    for (let i = 0; i < plans.length; i++) {
      if (martialArt() === plans[i].name) {
        window.location.href = `${plans[i].paymentLink}?prefilled_email=${encodedEmail}`;
      }
    }
    setErrorMessage("You must select a martial art");
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
      {errorMessage() &&
        <p class="text-red-500">{errorMessage()}</p>
      }
      <Button type="submit" class="bg-red-600/90 hover:bg-red-700 text-white text-lg font-semibold py-6 mt-2">Continue</Button>
    </form >
  );
}

