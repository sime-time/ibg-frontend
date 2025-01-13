import { IoClose } from "solid-icons/io";
import { createSignal, Show } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";

export default function ForgotPassword() {
  const { requestPasswordReset } = usePocket();
  const [userEmail, setUserEmail] = createSignal("");
  const [error, setError] = createSignal("");
  const [submitDisabled, setSubmitDisabled] = createSignal(false);
  const [emailSent, setEmailSent] = createSignal(false);

  const openForgotPassword = (e: Event) => {
    e.preventDefault();
    const dialog = document.getElementById("forgot-password-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  const closeForgotPassword = (e: Event) => {
    e.preventDefault()
    const dialog = document.getElementById("forgot-password-dialog") as HTMLDialogElement;
    dialog.close();
    setEmailSent(false);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitDisabled(true);
    setError("");

    const success: boolean = await requestPasswordReset(userEmail());

    if (success) {
      setUserEmail("");
      setEmailSent(true);
    } else {
      setError("An error occurred, email not found.");
    }
    setSubmitDisabled(false);
  }

  return (
    <>
      <label class="label">
        <button onClick={openForgotPassword} class="label-text-alt link link-hover">Forgot password?</button>
      </label>
      <dialog id="forgot-password-dialog" class="modal">
        <form method="dialog" class="modal-backdrop">
          <button>close when clicked outside</button>
        </form>
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-5" /></button>
          </form>

          <Show when={!emailSent()}
            fallback={<>
              <h3 class="font-bold text-lg">Please check your email</h3>
              <p class="py-2">We sent you an email, which contains a link to reset your password.</p>
              <div class="modal-action">
                <button onClick={closeForgotPassword} class="btn btn-secondary w-full">Back to Login</button>
              </div>
            </>
            }>
            <>
              <h3 class="font-bold text-lg">Forgot Password</h3>
              <p class="py-2">Enter your email address and we'll send you a link to reset your password.</p>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Email</span>
                </label>
                <div class="flex gap-3 w-full">
                  <label class="input input-bordered flex items-center gap-2 grow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                    <input
                      onInput={(event) => {
                        setUserEmail(event.currentTarget.value)
                      }}
                      type="email"
                      class="grow"
                      value={userEmail()}
                    />
                  </label>
                </div>
              </div>

              <Show when={error()}>
                <p class="text-error mt-3">{error()}</p>
              </Show>

              <div class="modal-action">
                <form method="dialog" class="flex gap-4 w-full">
                  <button onClick={handleSubmit} disabled={submitDisabled()} class="btn btn-secondary flex-1">
                    {submitDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Send Email"}
                  </button>
                </form>
              </div>
            </>
          </Show>

        </div>
      </dialog>
    </>
  );
}
