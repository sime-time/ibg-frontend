import { onMount, createSignal, onCleanup } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";

interface ClientSecretResponse {
  client_secret: string;
}

export default function MemberPricingTable() {
  const { user } = usePocket();
  const [clientSecret, setClientSecret] = createSignal("");

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
      const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/client-secret`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          customerId: user()?.stripe_customer_id,
        }),
      });
      console.log(response);

      const data: ClientSecretResponse = await response.json();
      console.log(data.client_secret)

      if (response.ok && data.client_secret) {
        setClientSecret(data.client_secret)
      }
    } catch (error) {
      console.error("Error fetching client secret: ", error);
    }

    const table = document.createElement("stripe-pricing-table");
    table.setAttribute("pricing-table-id", "prctbl_1Qcc7W06MCKUDe5TcRdGW1ja");
    table.setAttribute(
      "publishable-key",
      "pk_test_51Q04BE06MCKUDe5Ti0qzgC33iHkBhtj8JBDUkqGjPhlVSE0w25kTDYAcFVUrJIO51Eyh8o5X4ODIBPjymDb7ja2c00xMvh4rXc"
    );
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

  return (<div ref={divRef} class="w-full"></div>);
}
