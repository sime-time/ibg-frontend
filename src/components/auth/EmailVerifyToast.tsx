import { createSignal, Show } from "solid-js";
import { IoClose } from "solid-icons/io";
import { usePocket } from "~/context/PocketbaseContext";

interface EmailVerifyToastProps {
  email: string;
}

export default function EmailVerifyToast(props: EmailVerifyToastProps) {
  const { requestVerification } = usePocket();
  const [showToast, setShowToast] = createSignal(true);

  return (
    <Show when={showToast()}>
      <div class="toast toast-bottom md:toast-top toast-center md:toast-end">
        <div class="alert alert-warning flex flex-col items-start text-sm md:text-base">
          <div class="flex justify-between w-full">
            <strong>Please verify your email.</strong>
            <button onClick={() => setShowToast(false)}><IoClose class="w-5 h-5" /></button>
          </div>
          <span>We've sent a verification email to: {props.email}</span>
          <span>Didn't receive the email? <button onClick={() => requestVerification(props.email)} class="link">Resend verification email</button></span>
        </div>
      </div>
    </Show>

  );
}
