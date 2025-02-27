import { Resource, For, Show, createSignal, Suspense } from "solid-js";
import { createStore } from "solid-js/store";
import { usePocket } from "~/context/PocketbaseContext";
import {
  FaRegularTrashCan,
  FaSolidPhone,
  FaSolidUser,
  FaSolidUserDoctor,
  FaSolidUserPen,
  FaSolidPlus,
} from "solid-icons/fa";
import { BiSolidEdit, BiRegularMenu } from "solid-icons/bi";
import { AiOutlineDollar } from "solid-icons/ai";
import { IoClose } from "solid-icons/io";
import {
  CoachEditMemberData,
  CoachEditMemberSchema,
} from "~/types/ValidationType";
import * as v from "valibot";
import ContactDialog from "./ContactDialog";
import { MemberRecord } from "~/types/UserType";
import LoadingSpinner from "../ui/LoadingSpinner";

// top level dialog state for modal access
const [editDialogOpen, setEditDialogOpen] = createSignal(false);
const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
const [contactDialogOpen, setContactDialogOpen] = createSignal(false);
const [emergencyDialogOpen, setEmergencyDialogOpen] = createSignal(false);
const [editError, setEditError] = createSignal("");

function TableHeaders() {
  return (
    <tr>
      <th>Name</th>
      <th class="hidden md:table-cell">Program</th>
      <th class="hidden md:table-cell">Subscription</th>
      <th>Options</th>
    </tr>
  );
}

export const subscriptionBadge = (
  is_subscribed: boolean,
  pay_with_cash: boolean
) => {
  if (pay_with_cash) {
    return <span class="badge badge-warning">Cash</span>;
  } else if (is_subscribed) {
    return <span class="badge badge-success">Active</span>;
  } else {
    return <span class="badge badge-error">Inactive</span>;
  }
};

interface MemberTableProps {
  members: Resource<MemberRecord[]>;
  refetch: (info?: unknown) => MemberRecord[] | Promise<MemberRecord[] | undefined> | null | undefined;
}

export default function MemberTable(props: MemberTableProps) {
  const {
    getMember,
    getEmergencyContact,
    deleteMember,
    updateMember,
  } = usePocket();
  const [queryName, setQueryName] = createSignal("");
  const [currentMemberId, setCurrentMemberId] = createSignal("");
  const [dialogLoading, setDialogLoading] = createSignal(false);

  // Centralized member state
  const [memberState, setMemberState] = createStore({
    id: "",
    name: "",
    phone: "",
    program: "",
    emergencyName: "",
    emergencyPhone: "",
    stripeCustomerId: "",
    isEditing: false,
    readyToEdit: {
      name: false,
      phone: false,
      emergencyName: false,
      emergencyPhone: false
    }
  });

  // Single function to handle dialog opening
  const openDialog = async (dialogType: "edit" | "delete" | "emergency" | "contact", memberId: string) => {
    setCurrentMemberId(memberId);
    setEditError("");
    setDialogLoading(true);

    // Reset state and fetch member data
    switch (dialogType) {
      case "edit":
        const member = await getMember(memberId);
        const emergency = await getEmergencyContact(memberId);

        setMemberState({
          id: memberId,
          name: member.name,
          phone: member.phone_number,
          stripeCustomerId: member.stripe_customer_id,
          emergencyName: emergency.name,
          emergencyPhone: emergency.phone,
          isEditing: false,
          readyToEdit: {
            name: false,
            phone: false,
            emergencyName: false,
            emergencyPhone: false
          }
        });
        setEditDialogOpen(true);
        break;

      case "delete":
        setMemberState("id", memberId);
        setDeleteDialogOpen(true);
        break;

      case "emergency":
        setEmergencyDialogOpen(true);
        break;

      case "contact":
        setContactDialogOpen(true);
        break;
    }
    setDialogLoading(false);
  };

  const confirmEdit = async (e: Event) => {
    e.preventDefault();
    const updatedValues: CoachEditMemberData = { avatar: null };
    setEditError("");

    // Only include fields that were edited
    if (memberState.readyToEdit.name) { updatedValues.name = memberState.name; }
    if (memberState.readyToEdit.phone) { updatedValues.phone = memberState.phone; }
    if (memberState.readyToEdit.emergencyName) { updatedValues.emergencyName = memberState.emergencyName; }
    if (memberState.readyToEdit.emergencyPhone) { updatedValues.emergencyPhone = memberState.emergencyPhone; }

    try {
      const validValues = v.parse(CoachEditMemberSchema, updatedValues);
      await updateMember(memberState.id, validValues);
      setEditDialogOpen(false);
      props.refetch();
    } catch (err) {
      if (err instanceof v.ValiError) {
        console.error(err.issues[0].message);
        setEditError(err.issues[0].message);
      }
    }
  };

  const confirmDelete = async (e: Event) => {
    e.preventDefault();
    try {
      await deleteMember(memberState.id);
      setDeleteDialogOpen(false);
      props.refetch();
    } catch (err) {
      console.error("Error deleting member: ", err);
    }
  };



  return (
    <div class="w-11/12 xl:w-2/3 flex flex-col gap-4">
      {/* Search and Add Member controls */}
      <div class="flex justify-between">
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
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </label>
        <div>
          <a href="signup-qr" class="btn btn-secondary btn-sm items-center">
            <FaSolidPlus />
            Member
          </a>
        </div>
      </div>

      {/* Member Table */}
      <div class="overflow-x-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <table class="table bg-base-100">
            <thead><TableHeaders /></thead>
            <tbody>
              <For each={
                props.members()
                  ?.filter(member => member.name.toLowerCase().includes(queryName().toLowerCase()))
                  ?.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
              }>
                {(member) => (
                  <tr>
                    {/* Name, Avatar, Email */}
                    <td>
                      <div
                        class="flex items-center gap-3"
                      >
                        <button
                          class="avatar"
                          onClick={() => openDialog('edit', member.id)}
                        >
                          <div class="mask mask-squircle h-12 w-12">
                            <img src={member.avatarUrl} alt="Member Avatar" />
                          </div>
                        </button>
                        <div>
                          <div class="font-bold">{member.name}</div>
                          <div class="text-sm opacity-50">{member.email}</div>
                          <div class="md:hidden flex gap-1 mt-1">
                            <span>
                              {subscriptionBadge(
                                member.is_subscribed,
                                member.pay_with_cash ? true : false
                              )}
                            </span>
                            <span class="badge badge-neutral">
                              {member.program ? member.program : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Martial Arts Program */}
                    <td class="hidden md:table-cell">
                      <span class="badge badge-neutral">
                        {member.program ? member.program : "N/A"}
                      </span>
                    </td>

                    {/* Subscription Active? */}
                    <td class="hidden md:table-cell">
                      <span>
                        {subscriptionBadge(
                          member.is_subscribed,
                          member.pay_with_cash ? true : false
                        )}
                      </span>
                    </td>

                    {/* Edit Options Button */}
                    <td>
                      <button
                        onClick={() => openDialog('edit', member.id)}
                        class="btn btn-secondary btn-xs md:btn-sm"
                        disabled={dialogLoading() ? true : false}
                      >
                        {
                          dialogLoading() ?
                            <div class="flex justify-center">
                              <span class="loading loading-spinner loading-xs"></span>
                            </div> :
                            <BiRegularMenu class="size-6" />
                        }
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
            <tfoot><TableHeaders /></tfoot>
          </table>
        </Suspense>
      </div>

      {/* Edit Dialog */}
      <dialog
        class="modal auto-visibility"
        open={editDialogOpen()}
        onClick={() => setEditDialogOpen(false)}
      >
        <div class="modal-box" onClick={e => e.stopPropagation()}>
          <Show
            when={memberState.isEditing}
            fallback={
              <div class="flex flex-col gap-4">
                <h3 class="font-bold text-xl">{memberState.name}'s Details</h3>

                {/* Stripe Subscription Link */}
                <a
                  target="_blank"
                  href={
                    import.meta.env.VITE_STRIPE_CUSTOMER_URL +
                    memberState.stripeCustomerId
                  }
                  class="btn grow btn-secondary"
                >
                  <AiOutlineDollar class="size-6" />
                  Subscription Details
                </a>

                {/* Open Edit Member */}
                <button
                  onClick={() => setMemberState('isEditing', true)}
                  class="btn btn-neutral grow w-full"
                >
                  <FaSolidUserPen class="size-5" />
                  Edit Member
                </button>

                {/* Open Contact Info */}
                <div class="flex gap-4 w-full">
                  <button
                    onClick={() => {
                      setEditDialogOpen(false);
                      setContactDialogOpen(true);
                    }}
                    class="btn btn-outline flex-1"
                    disabled={memberState.phone ? false : true}
                  >
                    <FaSolidPhone class="size-3" />
                    Personal
                  </button>

                  <button
                    onClick={() => {
                      setEditDialogOpen(false);
                      setEmergencyDialogOpen(true);
                    }}
                    class="btn btn-outline btn-error flex-1"
                    disabled={memberState.emergencyPhone ? false : true}
                  >
                    <FaSolidPhone class="size-3" /> Emergency
                  </button>

                </div>

                {/* Open Delete Member */}
                <button
                  onClick={() => {
                    setEditDialogOpen(false);
                    setDeleteDialogOpen(true);
                  }}
                  class="btn btn-primary grow w-full"
                >
                  <FaRegularTrashCan class="size-5" />
                  Delete Member
                </button>

              </div>
            }
          >
            {/* Show when MemberState.isEditing */}
            <h3 class="font-bold text-xl">Edit Member</h3>
            <p class="py-2 text-wrap">
              Click the edit icon on the right to make changes
              and then press the save button when done.
            </p>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Name</span>
              </label>
              <div class="flex gap-3 w-full">
                <label class="input input-bordered flex items-center gap-2 grow border-secondary">
                  <FaSolidUser class="w-4 h-4 opacity-70" />
                  <input
                    onInput={(event) => {
                      setMemberState("name", event.currentTarget.value);
                    }}
                    type="text"
                    class="grow"
                    placeholder={memberState.name}
                    value={memberState.name}
                    disabled={!memberState.readyToEdit.name} // disabled when field is not ready to edit
                    id="name-input"
                  />
                </label>
                <button
                  onClick={() => {
                    setMemberState("readyToEdit", "name", !memberState.readyToEdit.name);

                    const nameInput = document.getElementById(
                      "name-input"
                    ) as HTMLInputElement;
                    nameInput.value = memberState.name;
                  }}
                >
                  {memberState.readyToEdit.name ? (
                    <IoClose class="size-6" />
                  ) : (
                    <BiSolidEdit class="size-6" />
                  )}
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
                      setMemberState("phone", event.currentTarget.value);
                    }}
                    type="tel"
                    class="grow"
                    placeholder={memberState.phone}
                    value={memberState.phone}
                    disabled={!memberState.readyToEdit.phone}
                    id="phone-input"
                  />
                </label>
                <button
                  onClick={() => {
                    setMemberState("readyToEdit", "phone", !memberState.readyToEdit.phone);
                    const phoneInput = document.getElementById("phone-input") as HTMLInputElement;
                    phoneInput.value = memberState.phone;
                  }}
                >
                  {memberState.readyToEdit.phone ? (
                    <IoClose class="size-6" />
                  ) : (
                    <BiSolidEdit class="size-6" />
                  )}
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
                      setMemberState("emergencyName", event.currentTarget.value);
                    }}
                    type="text"
                    class="grow"
                    placeholder={memberState.emergencyName}
                    value={memberState.emergencyName}
                    disabled={!memberState.readyToEdit.emergencyName}
                    id="emergencyName-input"
                  />
                </label>
                <button
                  onClick={() => {
                    setMemberState("readyToEdit", "emergencyName", !memberState.readyToEdit.emergencyName)
                    const input = document.getElementById("emergencyName-input") as HTMLInputElement;
                    input.value = memberState.emergencyName;
                  }}
                >
                  {memberState.readyToEdit.emergencyName ? (
                    <IoClose class="size-6" />
                  ) : (
                    <BiSolidEdit class="size-6" />
                  )}
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
                      setMemberState("emergencyPhone", event.currentTarget.value);
                    }}
                    type="tel"
                    class="grow"
                    placeholder={memberState.emergencyPhone}
                    value={memberState.emergencyPhone}
                    disabled={!memberState.readyToEdit.emergencyPhone}
                    id="emergencyPhone-input"
                  />
                </label>
                <button
                  onClick={() => {
                    setMemberState("readyToEdit", "emergencyPhone", !memberState.readyToEdit.emergencyPhone);
                    const input = document.getElementById("emergencyPhone-input") as HTMLInputElement;
                    input.value = memberState.emergencyPhone;
                  }}
                >
                  {memberState.readyToEdit.emergencyPhone ? (
                    <IoClose class="size-6" />
                  ) : (
                    <BiSolidEdit class="size-6" />
                  )}
                </button>
              </div>
            </div>

            <Show when={editError()}>
              <p class="text-error mt-3">{editError()}</p>
            </Show>

            <div class="modal-action">
              <form method="dialog" class="flex gap-4 w-full">
                <button
                  onClick={confirmEdit}
                  class="btn btn-secondary flex-1"
                >
                  Save
                </button>
                <button class="btn flex-1" onClick={() => setMemberState("isEditing", false)}>Cancel</button>
              </form>
            </div>
          </Show>
        </div>
      </dialog>

      {/* Delete Dialog */}
      <dialog
        class="modal auto-visibility"
        open={deleteDialogOpen()}
        onClick={() => setDeleteDialogOpen(false)}
      >
        <form method="dialog" class="modal-backdrop">
          <button>close when clicked outside</button>
        </form>
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <IoClose class="size-4" />
            </button>
          </form>
          <h3 class="font-bold text-lg mb-2">
            Delete Member?
          </h3>
          <p class="text-base">
            <span class="font-semibold">Name:</span>{" "}
            {memberState.name}
          </p>
          <p class="text-base">
            Subscription will be cancelled.
          </p>
          <div class="modal-action">
            <form
              method="dialog"
              class="flex gap-4 w-full"
            >
              <button
                onClick={confirmDelete}
                class="btn btn-primary grow"
              >
                Delete
              </button>
              <button class="btn grow">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Contact Dialog */}
      <dialog
        class="modal auto-visibility"
        open={contactDialogOpen()}
        onClick={() => setContactDialogOpen(false)}
      >
        <ContactDialog
          name={memberState.name}
          phone={memberState.phone}
        >
          Member Contact
        </ContactDialog>
      </dialog>

      {/* Emergency Contact Dialog */}
      <dialog
        class="modal auto-visibility"
        open={emergencyDialogOpen()}
        onClick={() => setEmergencyDialogOpen(false)}
      >
        <ContactDialog
          name={memberState.emergencyName}
          phone={memberState.emergencyPhone}
        >
          Emergency Contact
        </ContactDialog>
      </dialog>


    </div>
  );
}
