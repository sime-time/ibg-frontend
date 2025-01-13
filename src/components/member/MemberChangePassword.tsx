import { IoClose } from "solid-icons/io";
import { BiSolidLockAlt } from 'solid-icons/bi'
import { createSignal, Show } from "solid-js";
import { MemberPasswordData, MemberPasswordSchema } from "~/types/ValidationType";
import { PasswordUpdateResult } from "~/types/UserType";
import { usePocket } from "~/context/PocketbaseContext";
import { useNavigate } from "@solidjs/router";
import * as v from "valibot";

export default function MemberChangePassword() {
  const { user, updatePassword, logout } = usePocket();
  const [oldPassword, setOldPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [newPasswordConfirm, setNewPasswordConfirm] = createSignal("");
  const [error, setError] = createSignal("");
  const [saveDisabled, setSaveDisabled] = createSignal(false);
  const navigate = useNavigate();

  const openPasswordModal = () => {
    const dialog = document.getElementById("change-password-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();
    setSaveDisabled(true);
    setError("");

    let passwords: MemberPasswordData = {
      oldPassword: oldPassword(),
      newPassword: newPassword(),
      newPasswordConfirm: newPasswordConfirm(),
    };

    try {
      // validate user input
      const validPasswords = v.parse(MemberPasswordSchema, passwords);

      const result: PasswordUpdateResult = await updatePassword(user()?.id, validPasswords);

      if (result.success) {
        setOldPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
        const dialog = document.getElementById("change-password-dialog") as HTMLDialogElement;
        dialog.close();

        // add an alert to tell user password has changed
        const passwordChangedDiv: HTMLDivElement = document.createElement("div");
        passwordChangedDiv.role = "alert";
        passwordChangedDiv.className = "alert alert-success text-sm md:text-base";
        passwordChangedDiv.textContent = result.message + " Logging you out now...";
        document.body.appendChild(passwordChangedDiv);

        // Remove the message after few seconds
        setTimeout(() => {
          document.body.removeChild(passwordChangedDiv);
          logout();
          navigate("/login");
        }, 3500);
      } else {
        setError(result.message);
      }
      setSaveDisabled(false);

    } catch (err) {
      if (err instanceof v.ValiError) {
        setError(err.issues[0].message);
      } else {
        setError("Unexpected error occured.");
      }
      setSaveDisabled(false);
    }
  };

  return (
    <>
      <button onClick={openPasswordModal} class="btn btn-accent"><BiSolidLockAlt class="size-5" />Change Password</button>
      <dialog id="change-password-dialog" class="modal">
        <form method="dialog" class="modal-backdrop">
          <button>close when clicked outside</button>
        </form>
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-5" /></button>
          </form>

          <h3 class="font-bold text-lg">Change Password</h3>
          <p class="py-2">When changing password, you will automatically logout and be redirected to the login page.</p>


          <div class="form-control">
            <label class="label">
              <span class="label-text">Current Password</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow border-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
                <input
                  onInput={(event) => {
                    setOldPassword(event.currentTarget.value)
                  }}
                  type="password"
                  class="grow"
                  value={oldPassword()}
                  id="oldPassword-input"
                />
              </label>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">New Password</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow border-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
                <input
                  onInput={(event) => {
                    setNewPassword(event.currentTarget.value)
                  }}
                  type="password"
                  class="grow"
                  value={newPassword()}
                  id="newPassword-input"
                />
              </label>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Confirm New Password</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow border-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
                <input
                  onInput={(event) => {
                    setNewPasswordConfirm(event.currentTarget.value)
                  }}
                  type="password"
                  class="grow"
                  value={newPasswordConfirm()}
                  id="newPasswordConfirm-input"
                />
              </label>
            </div>
          </div>

          <Show when={error()}>
            <p class="text-error mt-3">{error()}</p>
          </Show>

          <div class="modal-action">
            <form method="dialog" class="flex gap-4 w-full">
              <button onClick={handleSave} disabled={saveDisabled()} class="btn btn-secondary flex-1">
                {saveDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Save"}
              </button>
              <button class="btn flex-1">Cancel</button>
            </form>
          </div>

        </div>
      </dialog>
    </>
  );
}
