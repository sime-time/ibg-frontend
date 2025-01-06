import { createResource, For, Show, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { usePocket } from "~/context/PocketbaseContext";
import { FaRegularTrashCan, FaSolidPhone, FaSolidUser, FaSolidUserDoctor, FaSolidUserPen, FaSolidPlus } from "solid-icons/fa";
import { BiSolidEdit, BiRegularMenu } from "solid-icons/bi";
import { AiOutlineDollar } from 'solid-icons/ai'
import { IoClose } from "solid-icons/io";
import { CoachEditMemberData, CoachEditMemberSchema } from "~/types/ValidationType";
import * as v from "valibot";
import ContactDialog from "./ContactDialog";
import { MemberRecord } from "~/types/UserType";

function TableHeaders() {
  return <>
    <tr>
      <th>Name</th>
      <th class="hidden md:table-cell">Program</th>
      <th class="hidden md:table-cell">Subscription</th>
      <th>Options</th>
    </tr>
  </>
}

export function MemberTable() {
  const { getMember, getMemberEmergencyContact, getMembers, deleteMember, updateMember } = usePocket();

  const [members, { mutate, refetch }] = createResource(async () => {
    return getMembers();
  });
  const [queryName, setQueryName] = createSignal("");

  // emergency functions
  const [emergencyName, setEmergencyName] = createSignal("");
  const [emergencyPhone, setEmergencyPhone] = createSignal("");

  const openEmergencyDialog = async () => {
    // close the parent dialog
    let dialog = document.getElementById("edit-dialog") as HTMLDialogElement;
    dialog.close();
    // open the emergency dialog
    dialog = document.getElementById("emergency-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  const openContactDialog = () => {
    // close the parent dialog
    let dialog = document.getElementById("edit-dialog") as HTMLDialogElement;
    dialog.close();
    // open the emergency dialog
    dialog = document.getElementById("contact-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  // delete functions
  const [deleteDisabled, setDeleteDisabled] = createSignal(false);

  const [memberToDelete, setMemberToDelete] = createStore({
    id: "",
    name: "",
    program: "",
  });

  const openDeleteModal = (memberId: string, memberName: string) => {
    setMemberToDelete("id", memberId);
    setMemberToDelete("name", memberName);

    let dialog = document.getElementById("edit-dialog") as HTMLDialogElement;
    dialog.close();

    dialog = document.getElementById("delete-dialog") as HTMLDialogElement;
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
  const [showEdit, setShowEdit] = createSignal(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = createSignal(false);
  const [editError, setEditError] = createSignal("");
  const [memberStripeId, setMemberStripeId] = createSignal("");
  const [defaultName, setDefaultName] = createSignal("");
  const [defaultPhone, setDefaultPhone] = createSignal("");

  const [memberToEdit, setMemberToEdit] = createStore({
    id: {
      value: "",
      readyToEdit: false,
    },
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

  const setAllReadyToEdit = (value: boolean) => {
    type MemberKey = keyof typeof memberToEdit;
    Object.entries(memberToEdit).forEach(([key, field]) => {
      setMemberToEdit(key as MemberKey, "readyToEdit", value);
    });
  };

  const openEditDialog = async (memberId: string) => {
    // reset values
    setShowEdit(false);
    setAllReadyToEdit(false);
    setEmergencyName("");
    setEmergencyPhone("");
    setMemberToEdit("id", "value", memberId);

    getMember(memberId).then((m: MemberRecord) => {
      setMemberToEdit("name", "value", m.name);
      setMemberToEdit("phone", "value", m.phone_number);
      setDefaultName(m.name);
      setDefaultPhone(m.phone_number);
      setMemberStripeId(m.stripe_customer_id);
    });

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
    setSaveButtonDisabled(true);
    setEditError("");

    let updatedValues: CoachEditMemberData = { avatar: null };

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
        setSaveButtonDisabled(false);
      }).then(() => {
        const dialog = document.getElementById("edit-dialog") as HTMLDialogElement;
        dialog.close();
        refetch();
      });
    } catch (err) {
      if (err instanceof v.ValiError) {
        setEditError(err.issues[0].message);
      } else {
        setEditError("Unexpected error occured.");
      }
    }
  }


  return (
    <div class="w-11/12 xl:w-2/3 flex flex-col gap-4">
      <div class="flex justify-between">
        {/* Search Member */}
        <label class="input input-bordered flex items-center gap-2 input-sm">
          <input
            type="text"
            placeholder="Search Member"
            onInput={(event) => {
              const input = event.currentTarget.value;
              setQueryName(input);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === "Escape") {
                // Remove focus to close the keyboard on mobile devices
                event.currentTarget.blur();
              }
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70">
            <path
              fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd" />
          </svg>
        </label>
        <div>
          <a href="signup-qr" class="btn btn-secondary btn-sm items-center"><FaSolidPlus />Member</a>
        </div>
      </div>

      <div class="overflow-x-auto whitespace-nowrap block">
        <Show when={!members.loading} fallback={<div class="flex justify-center"><span class="loading loading-spinner loading-lg"></span></div>}>
          <table class="table bg-base-100">
            <thead>
              <TableHeaders />
            </thead>

            <tbody>
              <For each={members()?.filter((member) => member.name.toLowerCase().includes(queryName().toLowerCase()))}>
                {(member, index) =>
                  <tr>
                    {/* Name, Avatar, Email */}
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar">
                          <div class="mask mask-squircle h-12 w-12">
                            <img
                              src={member.avatarUrl}
                              alt="Member Avatar" />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">{member.name}</div>
                          <div class="text-sm opacity-50">{member.email}</div>
                          <div class="md:hidden flex gap-1 mt-1">
                            <a href={import.meta.env.VITE_STRIPE_CUSTOMER_URL + member.stripe_customer_id}>
                              {member.is_subscribed
                                ? <span class="badge badge-success">Active</span>
                                : <span class="badge badge-error">Inactive</span>
                              }
                            </a>
                            <span class="badge badge-neutral">{member.program ? member.program : "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Martial Arts Program */}
                    <td class="hidden md:table-cell">
                      <span class="badge badge-neutral">{member.program ? member.program : "N/A"}</span>
                    </td>

                    {/* Subscription Active? */}
                    <td class="hidden md:table-cell">
                      <a href={import.meta.env.VITE_STRIPE_CUSTOMER_URL + member.stripe_customer_id}>
                        {member.is_subscribed
                          ? <span class="badge badge-success">Active</span>
                          : <span class="badge badge-error">Inactive</span>
                        }
                      </a>
                    </td>

                    {/* Options Menu */}
                    <td>
                      <button onClick={() => openEditDialog(member.id)} class="btn btn-sm btn-secondary"><BiRegularMenu class="size-6" /></button>
                      <dialog id="edit-dialog" class="modal">
                        <form method="dialog" class="modal-backdrop">
                          <button>close when clicked outside</button>
                        </form>
                        <div class="modal-box">
                          <form method="dialog">
                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
                          </form>

                          <Show
                            when={showEdit()}
                            fallback={<div class="flex flex-col gap-4">
                              <h3 class="font-bold text-xl">{defaultName()}'s Details</h3>

                              {/* Stripe Subscription Link */}
                              <a href={import.meta.env.VITE_STRIPE_CUSTOMER_URL + memberStripeId()} class="btn grow btn-secondary">
                                <AiOutlineDollar class="size-6" />
                                Subscription Details
                              </a>

                              <button onClick={() => setShowEdit(true)} class="btn btn-neutral grow w-full">
                                <FaSolidUserPen class="size-5" />
                                Edit Member
                              </button>

                              <div class="flex gap-4 w-full">
                                <button onClick={openContactDialog} class="btn btn-outline flex-1"><FaSolidPhone class="size-3" />Personal</button>
                                <ContactDialog dialogId="contact-dialog" name={defaultName()} phone={defaultPhone()}>Member Contact</ContactDialog>

                                <button onClick={openEmergencyDialog} class="btn btn-outline btn-error flex-1"><FaSolidPhone class="size-3" /> Emergency</button>
                                <ContactDialog dialogId="emergency-dialog" name={emergencyName()} phone={emergencyPhone()}>Emergency Contact </ContactDialog>
                              </div>

                              {/* Delete Member */}
                              <button onClick={() => openDeleteModal(memberToEdit.id.value, memberToEdit.name.value)} class="btn btn-primary grow w-full">
                                <FaRegularTrashCan class="size-5" />
                                Delete Member
                              </button>
                              <dialog id="delete-dialog" class="modal">
                                <form method="dialog" class="modal-backdrop">
                                  <button>close when clicked outside</button>
                                </form>
                                <div class="modal-box">
                                  <form method="dialog">
                                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
                                  </form>
                                  <h3 class="font-bold text-lg mb-2">Delete Member?</h3>
                                  <p class="text-base"><span class="font-semibold">Name:</span> {memberToDelete.name}</p>
                                  <p class="text-base">Subscription will be cancelled.</p>
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
                            </div>
                            }>

                            <h3 class="font-bold text-xl">Edit Member</h3>
                            <p class="py-2 text-wrap">Click the edit icon on the right to make changes and then press the save button when done.</p>

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
                                  setMemberToEdit("name", "readyToEdit", !memberToEdit.name.readyToEdit);
                                  const nameInput = document.getElementById("name-input") as HTMLInputElement;
                                  nameInput.value = defaultName();
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
                                  setMemberToEdit("phone", "readyToEdit", !memberToEdit.phone.readyToEdit);
                                  const phoneInput = document.getElementById("phone-input") as HTMLInputElement;
                                  phoneInput.value = defaultPhone();
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
                                <button onClick={(event) => confirmEdit(event, memberToEdit.id.value)} disabled={saveButtonDisabled()} class="btn btn-secondary flex-1">
                                  {saveButtonDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Save"}
                                </button>
                                <button class="btn flex-1">Cancel</button>
                              </form>
                            </div>
                          </Show>
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
    </div>
  );
}
