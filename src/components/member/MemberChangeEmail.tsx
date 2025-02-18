import { FaSolidEnvelope } from 'solid-icons/fa';
import { IoClose } from 'solid-icons/io';
import { createSignal, Show } from 'solid-js';
import { usePocket } from '~/context/PocketbaseContext';

export default function MemberChangeEmail() {
  const { user, requestEmailChange } = usePocket();
  const [newEmail, setNewEmail] = createSignal("");
  const [error, setError] = createSignal("");
  const [submitDisabled, setSubmitDisabled] = createSignal(false);

  const openEmailModal = () => {
    const dialog = document.getElementById("change-email-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitDisabled(true);
    setError("");

    const result = await requestEmailChange(newEmail(), user()?.email)

    if (result.success) {
      setNewEmail("");
      const dialog = document.getElementById("change-email-dialog") as HTMLDialogElement;
      dialog.close();

      // add an alert to tell user to check email
      const emailAlertDiv: HTMLDivElement = document.createElement("div");
      emailAlertDiv.role = "alert";
      emailAlertDiv.className = "alert alert-success text-sm md:text-base";
      emailAlertDiv.textContent = result.message;
      document.body.appendChild(emailAlertDiv);

      // Remove the message after few seconds
      setTimeout(() => {
        document.body.removeChild(emailAlertDiv);
      }, 3000);
    } else {
      setError(result.message);
    }
    setSubmitDisabled(false);
  };

  return (
    <>
      <button onClick={openEmailModal} class="btn btn-accent"><FaSolidEnvelope class="size-4" />Change Email</button>
      <dialog id="change-email-dialog" class="modal">
        <form method="dialog" class="modal-backdrop">
          <button>close when clicked outside</button>
        </form>
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-5" /></button>
          </form>

          <h3 class="font-bold text-lg">Change Email</h3>
          <p class="py-2">A new email change request will be sent to the email provided below. Press submit when done.</p>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Current Email</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                <input
                  disabled={true}
                  placeholder={user()?.email}
                  value={user()?.email}
                  type="email"
                  class="grow"
                />
              </label>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">New Email</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                <input
                  onInput={(event) => {
                    setNewEmail(event.currentTarget.value)
                  }}
                  type="email"
                  class="grow"
                  value={newEmail()}
                  id="newEmail-input"
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
                {submitDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Submit"}
              </button>
              <button class="btn flex-1">Cancel</button>
            </form>
          </div>

        </div>
      </dialog>
    </>
  );
}
