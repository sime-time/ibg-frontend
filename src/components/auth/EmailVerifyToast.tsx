import { createSignal, Show } from "solid-js";
import { IoClose } from "solid-icons/io";
import { usePocket } from "~/context/PocketbaseContext";

interface EmailVerifyToastProps {
  email: string;
}

export default function EmailVerifyToast(props: EmailVerifyToastProps) {
  const { requestVerification } = usePocket();
  const [showToast, setShowToast] = createSignal(true);

  let toastRef!: HTMLDivElement;

  const handleResendEmail = async (email: string) => {
    try {
      const sent: boolean = await requestVerification(email);
      if (sent) {
        const resendDiv = document.createElement("div");
        resendDiv.className = "alert alert-success text-sm md:text-base";
        resendDiv.textContent = "Verification email resent successfuly!";
        toastRef.appendChild(resendDiv);

        // Remove the message after few seconds
        setTimeout(() => {
          toastRef.removeChild(resendDiv);
        }, 3000);
      }
    } catch (err) {
      console.error("Email resend failed: ", err);
      const errorDiv = document.createElement("div");
      errorDiv.className = "alert alert-error text-sm md:text-base";
      errorDiv.textContent = "Failed to resend the verification email.";
      toastRef.appendChild(errorDiv);

      // Remove the message after few seconds
      setTimeout(() => {
        toastRef.removeChild(errorDiv);
      }, 3000);
    }
  }

  return (
    <Show when={showToast()}>
      <div ref={toastRef} class="toast toast-bottom md:toast-top toast-center md:toast-end">
        <div class="alert alert-warning flex flex-col items-start text-sm md:text-base">
          <div class="flex justify-between w-full">
            <strong>Please verify your email.</strong>
            <button onClick={() => setShowToast(false)}><IoClose class="w-5 h-5" /></button>
          </div>
          <span>We've sent a verification email to: {props.email}</span>
          <span>Didn't receive the email? <button onClick={() => handleResendEmail(props.email)} class="link">Resend verification email</button></span>
        </div>
      </div>
    </Show>
  );
}
