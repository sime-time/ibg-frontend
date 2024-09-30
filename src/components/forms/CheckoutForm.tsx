import { createSignal } from "solid-js";
import { Button } from "../ui/Button";
import { PaymentElement, useStripe, useElements } from "solid-stripe";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = createSignal("");
  const [isProcessing, setIsProcessing] = createSignal(false);

  const handleCheckout = async (e: Event) => {
    e.preventDefault();
  };

  return (
    <form id="payment-form" onSubmit={handleCheckout}>
      <PaymentElement />
      <button disabled={isProcessing()} type="submit">
        <span id="button-text">
          {isProcessing() ? "Processing ..." : "Pay now"}
        </span>
      </button>

    </form>
  );
}