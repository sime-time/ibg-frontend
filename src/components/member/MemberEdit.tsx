import { usePocket } from "~/context/PocketbaseContext";
import { createEffect, createSignal, Accessor, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { FaSolidUser } from "solid-icons/fa";
import { BiSolidEdit, BiSolidEditAlt } from "solid-icons/bi";
import { IoClose } from "solid-icons/io";

export default function MemberEdit() {
  const { user, getEmergencyContact } = usePocket();
  const [member, setMember] = createStore({
    name: {
      value: user()?.name,
      isDisabled: true,
    },
    email: {
      value: user()?.email,
      isDisabled: true,
    },
    phone: {
      value: user()?.phone_number,
      isDisabled: true,
    },
    emergencyName: {
      value: "",
      isDisabled: true,
    },
    emergencyPhone: {
      value: "",
      isDisabled: true,
    },
    password: {
      value: "",
      isDisabled: true,
    }
  });

  onMount(async () => {
    const emergency = await getEmergencyContact();
    setMember("emergencyName", "value", emergency.name);
    setMember("emergencyPhone", "value", emergency.phone);
    console.log(member.emergencyName.value);
  });


  const openModal = () => {
    const dialog = document.getElementById("edit-dialog") as HTMLDialogElement;
    dialog.showModal();
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
                  disabled={member.name.isDisabled}
                  id="name-input"
                />
              </label>
              <button onClick={() => {
                if (member.name.isDisabled === false) {
                  // if you re-disable the input, change the value to its default value
                  const nameInput = document.getElementById("name-input") as HTMLInputElement;
                  nameInput.value = user()?.name;
                }
                setMember("name", "isDisabled", !member.name.isDisabled);
                setMember("name", "value", user()?.name);
              }}>
                {member.name.isDisabled ? <BiSolidEdit class="size-6" /> : <IoClose class="size-6" />}
              </button>
            </div>
          </div>

          <div class="modal-action">
            <form method="dialog" class="flex gap-4 w-full">
              <button class="btn btn-secondary flex-1">Save Changes</button>
              <button class="btn flex-1">Cancel</button>
            </form>
          </div>

        </div>
      </dialog>
    </>
  );
}