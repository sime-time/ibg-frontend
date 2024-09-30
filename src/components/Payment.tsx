import { onMount, createSignal } from "solid-js";
import { Stripe, StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "solid-stripe";
import CheckoutForm from "./forms/CheckoutForm";

export default function Payment() {
  const [stripe, setStripe] = createSignal<Stripe | null>(null);
  const [clientSecret, setClientSecret] = createSignal<StripeElementsOptions>();

  onMount(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/public-key`);
      const data = await response.json();
      const stripeInstance = await loadStripe(data.key);
      setStripe(stripeInstance);
    } catch (error) {
      console.error("Error fetching key: ", error);
    }
  });

  onMount(() => {
    fetch(`${import.meta.env.VITE_POCKETBASE_URL}/create-payment-intent`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error("Error creating payment intent: ", error));
  });

  return (
    <>
      {stripe() && clientSecret() && (
        <Elements stripe={stripe()} options={clientSecret()}>
          <CheckoutForm />
        </Elements>)
      }
    </>
  );
}