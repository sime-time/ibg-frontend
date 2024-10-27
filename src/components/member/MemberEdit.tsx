import { usePocket, type UpdateMemberData } from "~/context/PocketbaseContext";
import { createEffect, createSignal, Accessor, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { FaSolidUser } from "solid-icons/fa";
import { BiSolidEdit, BiSolidEditAlt } from "solid-icons/bi";
import { IoClose } from "solid-icons/io";

export default function MemberEdit() {
  const { user, getEmergencyContact, updateMember } = usePocket();
  const [saveDisabled, setSaveDisabled] = createSignal(false);
  const [originalEmergencyPhone, setOriginalEmergencyPhone] = createSignal("");
  const [originalEmergencyName, setOriginalEmergencyName] = createSignal("");

  const [member, setMember] = createStore({
    name: {
      value: user()?.name,
      isUnchanged: true,
    },
    email: {
      value: user()?.email,
      isUnchanged: true,
    },
    phone: {
      value: user()?.phone_number,
      isUnchanged: true,
    },
    emergencyName: {
      value: "",
      isUnchanged: true,
    },
    emergencyPhone: {
      value: "",
      isUnchanged: true,
    },
    password: {
      value: "",
      isUnchanged: true,
    }
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

  const setAllUnchanged = (value: boolean) => {
    type MemberKey = keyof typeof member;
    Object.entries(member).forEach(([key, field]) => {
      setMember(key as MemberKey, "isUnchanged", value);
    });
  };

  const handleSave = async (e: Event) => {
    setSaveDisabled(true);
    let updatedValues: UpdateMemberData = {}

    Object.entries(member).forEach(([key, field]) => {
      // if field has changed...
      // update the corresponding member value 
      if (!field.isUnchanged) {
        switch (key) {
          case "name":
            updatedValues.name = field.value;
            break;
          case "email":
            updatedValues.email = field.value;
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
        }
        console.log("Updated: ", key, field.value, field.isUnchanged);
      }
    });

    console.log("updatedValues: ", updatedValues);

    updateMember(updatedValues).then(() => {
      // clean up 
      setAllUnchanged(true);
      setOriginalEmergencyName(member.emergencyName.value);
      setOriginalEmergencyPhone(member.emergencyPhone.value);
      setSaveDisabled(false);
      const dialog = document.getElementById("edit-dialog") as HTMLDialogElement;
      dialog.close();
    });

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
                  disabled={member.name.isUnchanged}
                  id="name-input"
                />
              </label>
              <button onClick={() => {
                if (member.name.isUnchanged === false) {
                  const nameInput = document.getElementById("name-input") as HTMLInputElement;
                  nameInput.value = user()?.name;
                }
                setMember("name", "isUnchanged", !member.name.isUnchanged);
                setMember("name", "value", user()?.name);
              }}>
                {member.name.isUnchanged ? <BiSolidEdit class="size-6" /> : <IoClose class="size-6" />}
              </button>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Phone Number</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow border-secondary">
                <FaSolidUser class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setMember("phone", "value", event.currentTarget.value)
                  }}
                  type="text"
                  class="grow"
                  placeholder={member.phone.value}
                  value={member.phone.value}
                  disabled={member.phone.isUnchanged}
                  id="phone-input"
                />
              </label>
              <button onClick={() => {
                if (member.phone.isUnchanged === false) {
                  const input = document.getElementById("phone-input") as HTMLInputElement;
                  input.value = user()?.phone_number;
                }
                setMember("phone", "isUnchanged", !member.phone.isUnchanged);
                setMember("phone", "value", user()?.phone_number);
              }}>
                {member.phone.isUnchanged ? <BiSolidEdit class="size-6" /> : <IoClose class="size-6" />}
              </button>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Emergency Contact Name</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow border-secondary">
                <FaSolidUser class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setMember("emergencyName", "value", event.currentTarget.value)
                  }}
                  type="text"
                  class="grow"
                  placeholder={member.emergencyName.value}
                  value={member.emergencyName.value}
                  disabled={member.emergencyName.isUnchanged}
                  id="emergencyName-input"
                />
              </label>
              <button onClick={() => {
                if (member.emergencyName.isUnchanged === false) {
                  // return to the original value before isUnchanged is set to true again
                  const input = document.getElementById("emergencyName-input") as HTMLInputElement;
                  input.value = originalEmergencyName();
                }
                setMember("emergencyName", "isUnchanged", !member.emergencyName.isUnchanged);
                setMember("emergencyName", "value", member.emergencyName.value);
              }}>
                {member.emergencyName.isUnchanged ? <BiSolidEdit class="size-6" /> : <IoClose class="size-6" />}
              </button>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Emergency Phone Number</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow border-secondary">
                <FaSolidUser class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setMember("emergencyPhone", "value", event.currentTarget.value)
                  }}
                  type="text"
                  class="grow"
                  placeholder={member.emergencyPhone.value}
                  value={member.emergencyPhone.value}
                  disabled={member.emergencyPhone.isUnchanged}
                  id="emergencyPhone-input"
                />
              </label>
              <button onClick={() => {
                if (member.emergencyPhone.isUnchanged === false) {
                  // return to the original value before isUnchanged is set to true again
                  const input = document.getElementById("emergencyPhone-input") as HTMLInputElement;
                  input.value = originalEmergencyPhone();
                }
                setMember("emergencyPhone", "isUnchanged", !member.emergencyPhone.isUnchanged);
                setMember("emergencyPhone", "value", member.emergencyPhone.value);
              }}>
                {member.emergencyPhone.isUnchanged ? <BiSolidEdit class="size-6" /> : <IoClose class="size-6" />}
              </button>
            </div>
          </div>


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