import { createSignal, onMount } from 'solid-js';
import Payment from '~/components/Payment';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { Button } from '~/components/ui/Button';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from 'solid-stripe';


export default function Checkout() {

  /*
  const handleCheckout = async () => {
    fetch(`${import.meta.env.VITE_POCKETBASE_URL}/my-route`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        payment_method: "pm_card_visa",
        amount: 3999,
        email: "supabase@istrash.com"
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error ->", error);
      });
  };
  */

  return (
    <main>
      <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Checkout</h1>
      <Payment />
    </main>
  );
}