import { createSignal, For } from "solid-js";
import { Button } from "~/components/ui/Button";
import Radio, { RadioGroup } from "~/components/ui/Radio";

export default function MemberOnboard() {
  const [martialArt, setMartialArt] = createSignal("");
  const plans = [
    {
      program: "boxing",
      price: "70",
    },
    {
      program: "jiu-jitsu",
      price: "100",
    },
    {
      program: "mma",
      price: "120",
    }
  ];


  return (
    <div class="w-fit m-auto flex flex-col gap-6">
      <h1 class="text-3xl text-center font-bold">Choose Your Martial Art</h1>
      <RadioGroup initialValue={martialArt()} onChange={(program: string) => setMartialArt(program)}>
        <div class="flex flex-col gap-4 justify-center">
          <For each={plans}>
            {(plan) => (
              <Radio value={plan.program}>
                <div class="flex gap-4 items-center">
                  <img src={`/images/${plan.program}.png`} alt={plan.program} class="size-16" />
                  <div class="flex flex-col">
                    <h2 class="text-2xl uppercase font-semibold">{plan.program}</h2>
                    <span class=" font-medium">${plan.price} / month</span>
                  </div>
                </div>
              </Radio>
            )}
          </For>
        </div>
      </RadioGroup>
      <Button class="bg-red-600/90 hover:bg-red-700 text-white text-lg font-semibold py-6 mt-2">Continue</Button>
    </div>
  );
}

