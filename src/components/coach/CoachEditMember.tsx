import { MemberRecord, usePocket } from "~/context/PocketbaseContext";
import { createSignal, Show, Accessor } from "solid-js";
import { createStore } from "solid-js/store";
import * as v from "valibot";
import { BiSolidEdit } from "solid-icons/bi";
import { IoClose } from "solid-icons/io";
import { FaSolidUser, FaSolidUserDoctor, FaSolidPhone } from "solid-icons/fa";

const CoachEditMemberSchema = v.object({
  name: v.optional(v.pipe(
    v.string('Your name must be in text.'),
    v.nonEmpty('Your name cannot be blank.'),
  )),
  phone: v.optional(v.pipe(
    v.string('You must include your phone number.'),
    v.maxLength(20, 'The phone number must not exceed 20 characters.'),
    v.nonEmpty('Your phone number cannot be blank.'),
  )),
  emergencyName: v.optional(v.pipe(
    v.string('The name must be in text.'),
    v.nonEmpty("The emergency contact's name cannot be blank"),
  )),
  emergencyPhone: v.optional(v.pipe(
    v.string("You must include your emergency contact's phone number."),
    v.maxLength(20, 'The phone number must not exceed 20 characters.'),
    v.nonEmpty("Your emergency contact's phone number cannot be blank."),
  )),
});

type CoachEditMemberData = v.InferOutput<typeof CoachEditMemberSchema>;

interface CoachEditMemberProps {
  memberId: string;
}

export default function CoachEditMember(props: CoachEditMemberProps) {
  const { getMember, updateMember, getMemberEmergencyContact } = usePocket();

  const [originalEmergencyPhone, setOriginalEmergencyPhone] = createSignal("");
  const [originalEmergencyName, setOriginalEmergencyName] = createSignal("");
  const [error, setError] = createSignal("");
  const [editDisabled, setEditDisabled] = createSignal(false);

  const [member, setMember] = createStore({
    name: {
      value: "",
      isUnchanged: true,
    },
    phone: {
      value: "",
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
  });

  getMember(props.memberId()).then((mbr) => {
    setMember("name", "value", mbr.name);
    setMember("phone", "value", mbr.phone_number);
  });

  getMemberEmergencyContact(props.memberId()).then((emergency) => {
    setMember("emergencyName", "value", emergency.name);
    setMember("emergencyPhone", "value", emergency.phone);
    setOriginalEmergencyName(emergency.name);
    setOriginalEmergencyPhone(emergency.phone);
  });

  const openEditModal = () => {

    const dialog = document.getElementById("coach-edit-member") as HTMLDialogElement;
    dialog.showModal();
  };

  const handleEdit = async (e: Event) => {
    e.preventDefault();
    setEditDisabled(true);
    setError("");

    let updatedValues: CoachEditMemberData = {};

    Object.entries(member).forEach(([key, field]) => {
      // if field has changed...
      // update the corresponding member value
      if (!field.isUnchanged) {
        switch (key) {
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
        }
        console.log("Updated: ", key, field.value, field.isUnchanged);
      }
    });

    console.log("updatedValues: ", updatedValues);

    try {
      // validate user input  
      const validValues = v.parse(CoachEditMemberSchema, updatedValues);

      console.log("validValues: ", validValues);

      updateMember(props.memberId(), validValues).then(() => {
        // clean up 
        setOriginalEmergencyName(member.emergencyName.value);
        setOriginalEmergencyPhone(member.emergencyPhone.value);
        const dialog = document.getElementById("coach-edit-member") as HTMLDialogElement;
        dialog.close();
      });
    } catch (err) {
      if (err instanceof v.ValiError) {
        setError(err.issues[0].message);
      } else {
        setError("Unexpected error occured.");
      }
    } finally {
      setEditDisabled(false);
    }
  }

  return <>
    <button onClick={openEditModal} class="btn btn-secondary btn-sm"><BiSolidEdit class="size-5" /></button>
    <dialog id="coach-edit-member" class="modal">
      <form method="dialog" class="modal-backdrop">
        <button>close when clicked outside</button>
      </form>
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <h3 class="font-bold text-lg">Edit Member</h3>
        <p class="py-2 text-wrap">Click the edit icon on the right to make changes and press the save button when done.</p>

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
                nameInput.value = member.name.value;
              }
              setMember("name", "isUnchanged", !member.name.isUnchanged);
              setMember("name", "value", member.name.value);
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
              <FaSolidPhone class="w-4 h-4 opacity-70" />
              <input
                onInput={(event) => {
                  setMember("phone", "value", event.currentTarget.value)
                }}
                type="tel"
                class="grow"
                placeholder={member.phone.value}
                value={member.phone.value}
                disabled={member.phone.isUnchanged}
                id="phone-input"
              />
            </label>
            <button onClick={() => {
              const input = document.getElementById("phone-input") as HTMLInputElement;
              if (member.phone.isUnchanged === false) {
                input.value = member.phone.value;
              }
              setMember("phone", "isUnchanged", !member.phone.isUnchanged);
              setMember("phone", "value", input.value);
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
              <FaSolidUserDoctor class="w-4 h-4 opacity-70" />
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
              <FaSolidPhone class="w-4 h-4 opacity-70" />
              <input
                onInput={(event) => {
                  setMember("emergencyPhone", "value", event.currentTarget.value)
                }}
                type="tel"
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

        <Show when={error()}>
          <p class="text-error mt-3">{error()}</p>
        </Show>

        <div class="modal-action">
          <form method="dialog" class="flex gap-4 w-full">
            <button onClick={handleEdit} disabled={editDisabled()} class="btn btn-secondary flex-1">
              {editDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Update"}
            </button>
            <button class="btn flex-1">Cancel</button>
          </form>
        </div>

      </div>
    </dialog>

  </>;
}