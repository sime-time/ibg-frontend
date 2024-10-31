import { createResource, For, Show, createSignal } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { FaRegularTrashCan, FaSolidPhone } from "solid-icons/fa";
import { BiSolidEdit } from "solid-icons/bi";
import { HiSolidChatBubbleOvalLeftEllipsis } from 'solid-icons/hi'

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
  const { getMemberEmergencyContact, getMembers, deleteMember } = usePocket();

  const [members, { mutate, refetch }] = createResource(async () => {
    return getMembers();
  });

  if (members.length <= 0) {
    return <h1 class="text-2xl font-bold">There are no members</h1>
  }

  const [emergencyName, setEmergencyName] = createSignal("");
  const [emergencyPhone, setEmergencyPhone] = createSignal("");
  const [deleteId, setDeleteId] = createSignal("");
  const [deleteName, setDeleteName] = createSignal("");
  const [deleteProgram, setDeleteProgram] = createSignal("");
  const [deleteDisabled, setDeleteDisabled] = createSignal(false);

  const getContact = async (memberId: string) => {
    getMemberEmergencyContact(memberId).then((contact) => {
      setEmergencyName(contact.name);
      setEmergencyPhone(contact.phone);
    });
  };

  const openEmergencyModal = async (memberId: string) => {
    setEmergencyName("");
    setEmergencyPhone("");
    getContact(memberId).then(() => {
      const dialog = document.getElementById("emergency-dialog") as HTMLDialogElement;
      dialog.showModal();
    });
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

  const openDeleteModal = (memberId: string, memberName: string, memberProgram: string) => {
    setDeleteId(memberId);
    setDeleteName(memberName);
    setDeleteProgram(memberProgram);

    const dialog = document.getElementById("delete-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

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

                  <td>
                    <span class="badge badge-neutral">{member.program ? member.program : "N/A"}</span>
                  </td>

                  <td>
                    {member.is_subscribed
                      ? <span class="badge badge-success">Active</span>
                      : <span class="badge badge-error">Inactive</span>
                    }
                  </td>

                  <td>
                    <a href={`sms:${member.phone_number}`} class="btn btn-sm btn-outline btn-secondary text-xs"><HiSolidChatBubbleOvalLeftEllipsis class="size-4" />Text</a>
                  </td>

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
                            <a href={`sms:${emergencyPhone()}`} class="btn btn-secondary grow">Text</a>
                            <button class="btn grow">Cancel</button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </td>

                  <td>
                    <button class="btn btn-secondary btn-sm"><BiSolidEdit class="size-5" /></button>
                  </td>

                  <td>
                    <button onClick={() => openDeleteModal(member.id, member.name, member.program)} class="btn btn-primary btn-sm"><FaRegularTrashCan class="size-5" /></button>
                    <dialog id="delete-dialog" class="modal">
                      <form method="dialog" class="modal-backdrop">
                        <button>close when clicked outside</button>
                      </form>
                      <div class="modal-box">
                        <form method="dialog">
                          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 class="font-bold text-lg mb-2">Delete Member?</h3>
                        <p class="text-base"><span class="font-semibold">Name:</span> {deleteName()}</p>
                        <p class="text-base"><span class="font-semibold">Program:</span> {deleteProgram() ? deleteProgram() : "N/A"}</p>
                        <div class="modal-action">
                          <form method="dialog" class="flex gap-4 w-full">
                            <button onClick={(event) => confirmDelete(event, deleteId())} disabled={deleteDisabled()} class="btn btn-primary grow">
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
    </div>
  );
}