import { usePocket } from "~/context/PocketbaseContext";
import { createSignal, Show, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { FaSolidUser, FaSolidPhone, FaSolidUserDoctor } from "solid-icons/fa";
import { BiSolidEdit, BiSolidEditAlt } from "solid-icons/bi";
import { IoClose } from "solid-icons/io";
import { MemberEditData, MemberEditSchema } from "~/types/ValidationType";
import * as v from "valibot";

export default function MemberEdit() {
  const { user, getEmergencyContact, updateMember, getAvatarUrl } = usePocket();
  const [saveDisabled, setSaveDisabled] = createSignal(false);
  const [originalEmergencyPhone, setOriginalEmergencyPhone] = createSignal("");
  const [originalEmergencyName, setOriginalEmergencyName] = createSignal("");
  const [error, setError] = createSignal("");
  const [avatar, setAvatar] = createSignal<File | null>(null);

  const [avatarUrl, setAvatarUrl] = createSignal("");
  onMount(async () => {
    resetAvatarUrl();
  });

  const resetAvatarUrl = async () => {
    let url = await getAvatarUrl();
    setAvatarUrl(url);
  }

  const [member, setMember] = createStore({
    avatar: {
      value: avatar(),
      readyToEdit: false,
    },
    name: {
      value: user()?.name,
      readyToEdit: false,
    },
    email: {
      value: user()?.email,
      readyToEdit: false,
    },
    phone: {
      value: user()?.phone_number,
      readyToEdit: false,
    },
    emergencyName: {
      value: "",
      readyToEdit: false,
    },
    emergencyPhone: {
      value: "",
      readyToEdit: false,
    },
    newPassword: {
      value: "",
      readyToEdit: false,
    },
    oldPassword: {
      value: "",
      readyToEdit: false,
    },
  });

  getEmergencyContact().then((emergency) => {
    setMember("emergencyName", "value", emergency.name);
    setMember("emergencyPhone", "value", emergency.phone);
    setOriginalEmergencyName(emergency.name);
    setOriginalEmergencyPhone(emergency.phone);
  });

  const openModal = () => {
    const dialog = document.getElementById("edit-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  const setAllReadyToEdit = (value: boolean) => {
    type MemberKey = keyof typeof member;
    Object.entries(member).forEach(([key, field]) => {
      setMember(key as MemberKey, "readyToEdit", value);
    });
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();
    setSaveDisabled(true);
    setError("");

    let updatedValues: MemberEditData = { avatar: null };

    Object.entries(member).forEach(([key, field]) => {
      // if field has changed...
      // update the corresponding member value 
      if (field.readyToEdit) {
        switch (key) {
          case "avatar":
            updatedValues.avatar = avatar();
            break;
          case "name":
            updatedValues.name = field.value;
            break;
          case "phone":
            updatedValues.phone = field.value;
            break;
          case "emergencyName":
            updatedValues.emergencyName = field.value;
            break;
          case "emergencyPhone":
            updatedValues.emergencyPhone = field.value;
            break;
          case "oldPassword":
            updatedValues.oldPassword = field.value;
            break;
          case "newPassword":
            updatedValues.newPassword = field.value;
            break;
        }
        console.log("Updated: ", key, field.value, field.readyToEdit);
      }
    });

    console.log("updatedValues: ", updatedValues);

    try {
      // validate user input  
      const validValues = v.parse(MemberEditSchema, updatedValues);

      console.log("validValues: ", validValues);

      updateMember(user()?.id, validValues).then(() => {
        // clean up 
        setAllReadyToEdit(false);
        setOriginalEmergencyName(member.emergencyName.value);
        setOriginalEmergencyPhone(member.emergencyPhone.value);
        setAvatar(null);
        resetAvatarUrl();
        setMember("newPassword", "value", "");
        const dialog = document.getElementById("edit-dialog") as HTMLDialogElement;
        dialog.close();
      }).then(() => {
        setSaveDisabled(false);
      });
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
      <button onClick={openModal} class="btn btn-accent"><BiSolidEditAlt class="size-5" /> Edit Profile</button>
      <dialog id="edit-dialog" class="modal">
        <form method="dialog" class="modal-backdrop">
          <button>close when clicked outside</button>
        </form>
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          <h3 class="font-bold text-lg">Edit Profile</h3>
          <p class="py-2">Click the edit icon on the right to make changes and press the save button when done.</p>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Profile Picture</span>
            </label>

            <div class="flex gap-3">
              <div class="avatar">
                <div class="mask mask-squircle h-12 w-12">
                  <img
                    src={avatarUrl()}
                    alt="Member Avatar" />
                </div>
              </div>
              <input
                onInput={(event: InputEvent) => {
                  const target = event.currentTarget as HTMLInputElement;
                  const file = target.files?.[0]; // File or undefined 
                  if (file) {
                    const fileUrl = URL.createObjectURL(file);
                    setAvatar(file);
                    setAvatarUrl(fileUrl);
                    setMember("avatar", "readyToEdit", true);
                    console.log("Avatar URL: ", fileUrl);
                  } else {
                    console.error("No file selected");
                  }
                }}
                type="file"
                accept="image/*"
                capture="user"
                class={`file-input file-input-bordered w-32 flex items-center grow ${member.avatar.readyToEdit ? "border-secondary" : ""}`}
                id="avatar-input"
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow border-secondary">
                <FaSolidUser class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setMember("name", "value", event.currentTarget.value)
                  }}
                  type="text"
                  class="grow"
                  placeholder={member.name.value}
                  value={member.name.value}
                  disabled={!member.name.readyToEdit}
                  id="name-input"
                />
              </label>
              <button onClick={() => {
                if (member.name.readyToEdit === true) {
                  const nameInput = document.getElementById("name-input") as HTMLInputElement;
                  nameInput.value = user()?.name;
                }
                setMember("name", "readyToEdit", !member.name.readyToEdit);
                setMember("name", "value", user()?.name);
              }}>
                {member.name.readyToEdit ? <IoClose class="size-6" /> : <BiSolidEdit class="size-6" />}
              </button>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Phone Number</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow border-secondary">
                <FaSolidPhone class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setMember("phone", "value", event.currentTarget.value)
                  }}
                  type="tel"
                  class="grow"
                  placeholder={member.phone.value}
                  value={member.phone.value}
                  disabled={!member.phone.readyToEdit}
                  id="phone-input"
                />
              </label>
              <button onClick={() => {
                if (member.phone.readyToEdit) {
                  const input = document.getElementById("phone-input") as HTMLInputElement;
                  input.value = user()?.phone_number;
                }
                setMember("phone", "readyToEdit", !member.phone.readyToEdit);
                setMember("phone", "value", user()?.phone_number);
              }}>
                {member.phone.readyToEdit ? <IoClose class="size-6" /> : <BiSolidEdit class="size-6" />}
              </button>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Emergency Contact Name</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow border-secondary">
                <FaSolidUserDoctor class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setMember("emergencyName", "value", event.currentTarget.value)
                  }}
                  type="text"
                  class="grow"
                  placeholder={member.emergencyName.value}
                  value={member.emergencyName.value}
                  disabled={!member.emergencyName.readyToEdit}
                  id="emergencyName-input"
                />
              </label>
              <button onClick={() => {
                if (member.emergencyName.readyToEdit) {
                  // return to the original value before isUnchanged is set to true again
                  const input = document.getElementById("emergencyName-input") as HTMLInputElement;
                  input.value = originalEmergencyName();
                }
                setMember("emergencyName", "readyToEdit", !member.emergencyName.readyToEdit);
                setMember("emergencyName", "value", member.emergencyName.value);
              }}>
                {member.emergencyName.readyToEdit ? <IoClose class="size-6" /> : <BiSolidEdit class="size-6" />}
              </button>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Emergency Phone Number</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow border-secondary">
                <FaSolidPhone class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setMember("emergencyPhone", "value", event.currentTarget.value)
                  }}
                  type="tel"
                  class="grow"
                  placeholder={member.emergencyPhone.value}
                  value={member.emergencyPhone.value}
                  disabled={!member.emergencyPhone.readyToEdit}
                  id="emergencyPhone-input"
                />
              </label>
              <button onClick={() => {
                if (member.emergencyPhone.readyToEdit) {
                  // return to the original value before isUnchanged is set to true again
                  const input = document.getElementById("emergencyPhone-input") as HTMLInputElement;
                  input.value = originalEmergencyPhone();
                }
                setMember("emergencyPhone", "readyToEdit", !member.emergencyPhone.readyToEdit);
                setMember("emergencyPhone", "value", member.emergencyPhone.value);
              }}>
                {member.emergencyPhone.readyToEdit ? <IoClose class="size-6" /> : <BiSolidEdit class="size-6" />}
              </button>
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

          <Show when={member.newPassword.readyToEdit} >
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
          </Show>

          <Show when={error()}>
            <p class="text-error mt-3">{error()}</p>
          </Show>

          <div class="modal-action">
            <form method="dialog" class="flex gap-4 w-full">
              <button onClick={handleSave} disabled={saveDisabled()} class="btn btn-secondary flex-1">
                {saveDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Save Changes"}
              </button>
              <button class="btn flex-1">Cancel</button>
            </form>
          </div>

        </div>
      </dialog>
    </>
  );
}