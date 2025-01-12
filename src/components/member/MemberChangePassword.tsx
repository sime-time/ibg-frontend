export default function MemberChangePassword() {
  return (
    <>
      <div class="form-control">
        <label class="label">
          <span class="label-text">New Password</span>
        </label>
        <div class="flex gap-3 w-full">
          <label class="input input-bordered flex items-center gap-2 grow border-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
            <input
              onInput={(event) => {
                setMember("newPassword", "value", event.currentTarget.value)
              }}
              type="password"
              class="grow"
              value=""
              disabled={!member.newPassword.readyToEdit}
              id="newPassword-input"
            />
          </label>
          <button onClick={() => {
            if (member.newPassword.readyToEdit) {
              // return to the original value before isUnchanged is set to true again
              const input = document.getElementById("newPassword-input") as HTMLInputElement;
              input.value = "";

              const oldInput = document.getElementById("oldPassword-input") as HTMLInputElement;
              oldInput.value = "";
            }
            setMember("newPassword", "readyToEdit", !member.newPassword.readyToEdit);
            setMember("newPassword", "value", member.newPassword.value);

            setMember("oldPassword", "readyToEdit", !member.oldPassword.readyToEdit);
            setMember("oldPassword", "value", member.oldPassword.value);
          }}>
            {member.newPassword.readyToEdit ? <IoClose class="size-6" /> : <BiSolidEdit class="size-6" />}
          </button>
        </div>
      </div>

      <div class="form-control pr-5 md:pr-9">
        <label class="label">
          <span class="label-text">Old Password</span>
        </label>
        <div class="flex gap-3 w-full">
          <label class="input input-bordered flex items-center gap-2 grow border-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
            <input
              onInput={(event) => {
                setMember("oldPassword", "value", event.currentTarget.value)
              }}
              type="password"
              class="grow"
              value=""
              id="oldPassword-input"
            />
          </label>
        </div>
      </div>
    </>
  );
}
