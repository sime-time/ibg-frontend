import MemberPricingTable from "./member/MemberPricingTable";
import { createSignal, For } from "solid-js";
import { FaSolidCircleCheck } from "solid-icons/fa";
import { PlanProps, plans } from "~/types/PlanType";

const [showYearly, setShowYearly] = createSignal(false);

export default function Plans() {
  return (
    <section
      id="plans"
      class="py-16 px-1 md:px-16 flex flex-col justify-center items-center gap-0 md:gap-7"
    >
      <div
        role="tablist"
        class="tabs tabs-md tabs-boxed bg-gray-100 bg-opacity-10 border border-gray-400/40 rounded-xl w-fit md:w-1/3 "
      >
        <button
          role="tab"
          onClick={() => setShowYearly(false)}
          class={`tab ${showYearly() ? "" : "tab-active"}`}
        >
          Monthly
        </button>
        <button
          role="tab"
          onClick={() => setShowYearly(true)}
          class={`tab flex gap-2 ${showYearly() ? "tab-active" : ""}`}
        >
          Yearly <span class="badge badge-success">16% off</span>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <For each={plans}>
          {(plan) => (
            <Plan
              id={plan.id}
              name={plan.name}
              description={plan.description}
              price={showYearly() ? plan.price * 10 : plan.price}
              features={plan.features}
              popular={plan.popular}
            />
          )}
        </For>
      </div>
    </section>
  );
}

function Plan(props: PlanProps) {
  return (
    <div
      id={props.id}
      class={`flex flex-col justify-between gap-9 p-9 rounded-xl ${props.popular
          ? "bg-gray-100 bg-opacity-10 border border-gray-400/40"
          : ""
        }`}
    >
      <div class="flex flex-col gap-2">
        {props.popular ? (
          <div class="badge badge-ghost text-xs opacity-70">Most popular</div>
        ) : (
          <div>
            <br />
          </div>
        )}
        <div class="flex flex-col gap-2">
          <h2 class="font-semibold text-xl">{props.name}</h2>
          <p class="text-sm text-gray-400 text-wrap">{props.description}</p>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <h3 class="text-4xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              trailingZeroDisplay: "stripIfInteger",
            }).format(props.price)}
          </h3>
          <span class="text-sm text-gray-400 leading-none">
            per
            <br />
            {showYearly() ? "year" : "month"}
          </span>
        </div>
        <div class="flex flex-col gap-3">
          <a href="/signup" class="btn btn-primary w-full">
            Sign Up
          </a>
          <ul class="text-sm opacity-80 leading-loose">
            <li>This includes:</li>
            <For each={props.features}>
              {(feature) => (
                <li class="flex gap-3 items-center">
                  <FaSolidCircleCheck />
                  {feature}
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
}
