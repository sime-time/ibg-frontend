import { createResource, For, Show, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { usePocket } from "~/context/PocketbaseContext";
import { FaRegularTrashCan, FaSolidPhone, FaSolidUser, FaSolidUserDoctor } from "solid-icons/fa";
import { BiSolidEdit } from "solid-icons/bi";
import { HiSolidChatBubbleOvalLeftEllipsis } from 'solid-icons/hi'
import { IoClose } from "solid-icons/io";
import { CoachEditMemberData, CoachEditMemberSchema } from "~/components/InputValidation";
import * as v from "valibot";

function TableHeaders() {
  return <>
    <tr>
      <th>Name</th>
      <th>Program</th>
      <th>Subscription</th>
      <th>Phone</th>
      <th>Emergency</th>
      <th>Edit</th>
      <th>Delete</th>
    </tr>
  </>
}

export function MemberTable() {
  const { getMemberEmergencyContact, getMembers, deleteMember, updateMember } = usePocket();

  const [members, { mutate, refetch }] = createResource(async () => {
    return getMembers();
  });

  // emergency functions 
  const [emergencyName, setEmergencyName] = createSignal("");
  const [emergencyPhone, setEmergencyPhone] = createSignal("");

  const openEmergencyModal = async (memberId: string) => {
    setEmergencyName("");
    setEmergencyPhone("");
    getMemberEmergencyContact(memberId).then((contact) => {
      setEmergencyName(contact.name);
      setEmergencyPhone(contact.phone);
    }).then(() => {
      const dialog = document.getElementById("emergency-dialog") as HTMLDialogElement;
      dialog.showModal();
    });
  };

  // delete functions 
  const [deleteDisabled, setDeleteDisabled] = createSignal(false);

  const [memberToDelete, setMemberToDelete] = createStore({
    id: "",
    name: "",
    program: "",
  });

  const openDeleteModal = (memberId: string, memberName: string, memberProgram: string) => {
    setMemberToDelete("id", memberId);
    setMemberToDelete("name", memberName);
    setMemberToDelete("program", memberProgram);

    const dialog = document.getElementById("delete-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  const confirmDelete = async (e: Event, memberId: string) => {
    e.preventDefault();
    setDeleteDisabled(true);
    const dialog = document.getElementById("delete-dialog") as HTMLDialogElement;
    try {
      deleteMember(memberId).then(() => {
        refetch()
        setDeleteDisabled(false);
        dialog.close();
      });
    } catch (err) {
      console.error("Error deleting member: ", err);
    }
  };

  // edit functions 
  const [updateButtonDisabled, setUpdateButtonDisabled] = createSignal(false);
  const [editError, setEditError] = createSignal("");

  const [memberToEdit, setMemberToEdit] = createStore({
    name: {
      value: "",
      readyToEdit: false,
    },
    phone: {
      value: "",
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
  });

  const openEditModal = async (memberId: string) => {
    // reset values 
    setEmergencyName("");
    setEmergencyPhone("");

    getMemberEmergencyContact(memberId).then((contact) => {
      setEmergencyName(contact.name);
      setEmergencyPhone(contact.phone);
    }).then(() => {
      setMemberToEdit("emergencyName", "value", emergencyName());
      setMemberToEdit("emergencyPhone", "value", emergencyPhone());
    }).then(() => {
      const dialog = document.getElementById("edit-dialog") as HTMLDialogElement;
      dialog.showModal();
    });
  };

  const confirmEdit = async (e: Event, memberId: string) => {
    e.preventDefault();
    setUpdateButtonDisabled(true);
    setEditError("");

    let updatedValues: CoachEditMemberData = {};

    Object.entries(memberToEdit).forEach(([key, field]) => {
      if (field.readyToEdit) {
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
        console.log("Updated: ", key, field.value, field.readyToEdit);
      }
    });

    console.log("updatedValues: ", updatedValues);

    try {
      // validate user input  
      const validValues = v.parse(CoachEditMemberSchema, updatedValues);

      console.log("validValues: ", validValues);

      updateMember(memberId, validValues).then(() => {
        // clean up 
        setEmergencyName(memberToEdit.emergencyName.value);
        setEmergencyPhone(memberToEdit.emergencyPhone.value);
        setUpdateButtonDisabled(false);
      }).then(() => {
        const dialog = document.getElementById("edit-dialog") as HTMLDialogElement;
        dialog.close();
      });
    } catch (err) {
      if (err instanceof v.ValiError) {
        setEditError(err.issues[0].message);
      } else {
        setEditError("Unexpected error occured.");
      }
    } finally {

    }
  }


  return (
    <div class="overflow-x-auto whitespace-nowrap block">
      <Show when={!members.loading} fallback={<span class="loading loading-spinner loading-md"></span>}>
        <table class="table bg-base-100 ">
          <thead>
            <TableHeaders />
          </thead>

          <tbody>
            <For each={members()}>
              {(member, index) =>
                <tr>
                  {/* Name, Avatar, Email */}
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="avatar">
                        <div class="mask mask-squircle h-12 w-12">
                          <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component" />
                        </div>
                      </div>
                      <div>
                        <div class="font-bold">{member.name}</div>
                        <div class="text-sm opacity-50">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Martial Arts Program */}
                  <td>
                    <span class="badge badge-neutral">{member.program ? member.program : "N/A"}</span>
                  </td>

                  {/* Subscription Active? */}
                  <td>
                    {member.is_subscribed
                      ? <span class="badge badge-success">Active</span>
                      : <span class="badge badge-error">Inactive</span>
                    }
                  </td>

                  {/* Text Phone */}
                  <td>
                    <a href={`sms:${member.phone_number}`} class="btn btn-sm btn-outline text-xs"><HiSolidChatBubbleOvalLeftEllipsis class="size-4" />Text</a>
                  </td>

                  {/* Emergency Contact */}
                  <td>
                    <button onClick={() => openEmergencyModal(member.id)} class="btn btn-sm btn-outline btn-primary text-xs"><FaSolidPhone class="size-3" /> Call</button>
                    <dialog id="emergency-dialog" class="modal">
                      <form method="dialog" class="modal-backdrop">
                        <button>close when clicked outside</button>
                      </form>
                      <div class="modal-box">
                        <form method="dialog">
                          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 class="font-bold text-lg mb-2">Emergency Contact</h3>
                        <Show when={emergencyName() && emergencyPhone()} fallback={<span class="loading loading-spinner loading-md"></span>}>
                          <p class="text-base"><span class="font-semibold">Name:</span> {emergencyName()} </p>
                          <p class="text-base"><span class="font-semibold">Phone:</span> {emergencyPhone()} </p>
                        </Show>
                        <div class="modal-action">
                          <form method="dialog" class="flex gap-4 w-full">
                            <a href={`tel:${emergencyPhone()}`} class="btn btn-primary grow">Call</a>
                            <a href={`sms:${emergencyPhone()}`} class="btn btn-accent grow">Text</a>
                            <button class="btn grow">Cancel</button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </td>

                  {/* Update Member */}
                  <td>
                    <button onClick={() => openEditModal(member.id)} class="btn btn-secondary btn-sm"><BiSolidEdit class="size-5" /></button>
                    <dialog id="edit-dialog" class="modal">
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
                                  setMemberToEdit("name", "value", event.currentTarget.value)
                                }}
                                type="text"
                                class="grow"
                                placeholder={memberToEdit.name.value}
                                value={memberToEdit.name.value}
                                disabled={!memberToEdit.name.readyToEdit} // disabled when field is not ready to edit
                                id="name-input"
                              />
                            </label>
                            <button onClick={() => {
                              const nameInput = document.getElementById("name-input") as HTMLInputElement;
                              // when re-disabled
                              if (!memberToEdit.name.readyToEdit) {
                                // return to default value
                                nameInput.value = member.name;
                              }
                              setMemberToEdit("name", "readyToEdit", !memberToEdit.name.readyToEdit);
                              setMemberToEdit("name", "value", nameInput.value);
                            }}>
                              {memberToEdit.name.readyToEdit ? <IoClose class="size-6" /> : <BiSolidEdit class="size-6" />}
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
                                  setMemberToEdit("phone", "value", event.currentTarget.value)
                                }}
                                type="tel"
                                class="grow"
                                placeholder={memberToEdit.phone.value}
                                value={memberToEdit.phone.value}
                                disabled={!memberToEdit.phone.readyToEdit}
                                id="phone-input"
                              />
                            </label>
                            <button onClick={() => {
                              const phoneInput = document.getElementById("phone-input") as HTMLInputElement;
                              if (!memberToEdit.phone.readyToEdit) {
                                phoneInput.value = member.phone_number;
                              }
                              setMemberToEdit("phone", "readyToEdit", !memberToEdit.phone.readyToEdit);
                              setMemberToEdit("phone", "value", phoneInput.value);
                            }}>
                              {memberToEdit.phone.readyToEdit ? <IoClose class="size-6" /> : <BiSolidEdit class="size-6" />}
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
                                  setMemberToEdit("emergencyName", "value", event.currentTarget.value)
                                }}
                                type="text"
                                class="grow"
                                placeholder={memberToEdit.emergencyName.value}
                                value={memberToEdit.emergencyName.value}
                                disabled={!memberToEdit.emergencyName.readyToEdit}
                                id="emergencyName-input"
                              />
                            </label>
                            <button onClick={() => {
                              const input = document.getElementById("emergencyName-input") as HTMLInputElement;
                              if (!memberToEdit.emergencyName.readyToEdit) {
                                input.value = emergencyName();
                              }
                              setMemberToEdit("emergencyName", "readyToEdit", !memberToEdit.emergencyName.readyToEdit);
                              setMemberToEdit("emergencyName", "value", input.value);
                            }}>
                              {memberToEdit.emergencyName.readyToEdit ? <IoClose class="size-6" /> : <BiSolidEdit class="size-6" />}
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
                                  setMemberToEdit("emergencyPhone", "value", event.currentTarget.value)
                                }}
                                type="tel"
                                class="grow"
                                placeholder={memberToEdit.emergencyPhone.value}
                                value={memberToEdit.emergencyPhone.value}
                                disabled={!memberToEdit.emergencyPhone.readyToEdit}
                                id="emergencyPhone-input"
                              />
                            </label>
                            <button onClick={() => {
                              // when re-disabled
                              if (!memberToEdit.emergencyPhone.readyToEdit) {
                                // input field returns to default 
                                const input = document.getElementById("emergencyPhone-input") as HTMLInputElement;
                                input.value = emergencyPhone();
                              }
                              setMemberToEdit("emergencyPhone", "readyToEdit", !memberToEdit.emergencyPhone.readyToEdit);
                              setMemberToEdit("emergencyPhone", "value", memberToEdit.emergencyPhone.value);
                            }}>
                              {memberToEdit.emergencyPhone.readyToEdit ? <IoClose class="size-6" /> : <BiSolidEdit class="size-6" />}
                            </button>
                          </div>
                        </div>

                        <Show when={editError()}>
                          <p class="text-error mt-3">{editError()}</p>
                        </Show>

                        <div class="modal-action">
                          <form method="dialog" class="flex gap-4 w-full">
                            <button onClick={(event) => confirmEdit(event, member.id)} disabled={updateButtonDisabled()} class="btn btn-secondary flex-1">
                              {updateButtonDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Update"}
                            </button>
                            <button class="btn flex-1">Cancel</button>
                          </form>
                        </div>

                      </div>
                    </dialog>
                  </td>

                  {/* Delete Member */}
                  <td>
                    <button onClick={() => openDeleteModal(member.id, member.name, member.program)} class="btn btn-primary btn-sm">
                      <FaRegularTrashCan class="size-5" />
                    </button>
                    <dialog id="delete-dialog" class="modal">
                      <form method="dialog" class="modal-backdrop">
                        <button>close when clicked outside</button>
                      </form>
                      <div class="modal-box">
                        <form method="dialog">
                          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 class="font-bold text-lg mb-2">Delete Member?</h3>
                        <p class="text-base"><span class="font-semibold">Name:</span> {memberToDelete.name}</p>
                        <p class="text-base"><span class="font-semibold">Program:</span> {memberToDelete.program ? memberToDelete.program : "N/A"}</p>
                        <div class="modal-action">
                          <form method="dialog" class="flex gap-4 w-full">
                            <button onClick={(event) => confirmDelete(event, memberToDelete.id)} disabled={deleteDisabled()} class="btn btn-primary grow">
                              {deleteDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Delete"}
                            </button>
                            <button class="btn grow">Cancel</button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </td>
                </tr>
              }
            </For>
          </tbody>

          <tfoot>
            <TableHeaders />
          </tfoot>

        </table>
      </Show>
    </div >
  );
}