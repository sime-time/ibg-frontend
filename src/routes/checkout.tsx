import { createSignal, onMount } from 'solid-js';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from 'solid-stripe';

export default function Checkout() {
  const [stripe, setStripe] = createSignal<Stripe | null>(null);

  onMount(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/public-keys`);
      if (!response.ok) {
        throw new Error("Failed to fetch public key");
      }
      const data: any = await response.json();
      console.log("Success:", data.key);
    } catch (err) {
      console.error("Error ->", err);
    }
  });

  return (
    <div>nothing to see here... check console</div>
  )
}