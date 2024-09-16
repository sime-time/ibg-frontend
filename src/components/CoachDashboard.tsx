import { createSignal, createResource, For, Show } from "solid-js";
import Pocketbase from "pocketbase";
import { useNavigate, A } from "@solidjs/router";
import FormCreateMember from "~/components/forms/FormCreateMember";
import FormUpdateMember from "~/components/forms/FormUpdateMember";
import { MemberRecord } from "~/lib/MemberRecord";

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function CoachDashboard() {
  const [selectedToUpdate, setSelectedToUpdate] = createSignal("");
  const [selectedToDelete, setSelectedToDelete] = createSignal("");
  const [openCreateMember, setOpenCreateMember] = createSignal(false);
  const navigate = useNavigate();

  const [members, { mutate, refetch }] = createResource(async () => {
    return await pb.collection("member").getFullList<MemberRecord>();
  });

  const logOut = async () => {
    pb.authStore.clear();
    navigate("/login");
  }

  const toggleCreateMember = () => {
    setOpenCreateMember(prev => !prev);
  }

  const handleUpdate = (memberId: string) => {
    // unfocus delete selection
    setSelectedToDelete("");
    setSelectedToUpdate(memberId);
  }

  const handleDelete = (memberId: string) => {
    setSelectedToUpdate("");
    setSelectedToDelete(memberId);
  }

  const confirmDelete = async (memberId: string) => {
    try {
      await pb.collection("member").delete(memberId);
      refetch();
      setSelectedToDelete("");
      console.log(`Member id:${memberId} deleted from database.`);
    } catch (err) {
      console.error("Error deleting member: ", err);
    }
  }



  if (!pb.authStore.isValid || !pb.authStore.isAdmin) {
    return (
      <main class="text-white text-center">
        <p>You do not have access to this page.</p>
        <p>Already have an account? <A href="/login" class="underline">Go to login</A></p>
      </main>
    );
  }

  const coach = pb.authStore.model;

  return (
    <div class="flex flex-col justify-center items-center">
      <h2>Welcome, {coach?.email}!</h2>
      <button type="button" onClick={toggleCreateMember} class="bg-blue-600/90 hover:bg-blue-700 text-white rounded-md py-3 px-5 mt-2 font-bold">{openCreateMember() ? "Close" : "Create New Member"}</button>
      <Show when={openCreateMember()} fallback={<></>}>
        <FormCreateMember />
      </Show>
      <Show when={members.loading}>
        <p>Loading members...</p>
      </Show>
      <Show when={members.error}>
        <p>Error loading members: {members.error.message}</p>
      </Show>
      <ul class="flex flex-col gap-4 my-4">
        <For each={members()}>
          {(member, index) =>
            <li>
              <div class="inline-flex items-center justify-between w-full">
                <p>{member.name} : {member.email}</p>
                <div>
                  <button type="button" onClick={() => handleUpdate(member.id)} class="p-3 border rounded-md border-blue-500 text-blue-500 ml-3">Edit</button>
                  <button type="button" onClick={() => handleDelete(member.id)} class="p-3 border rounded-md border-red-500 text-red-500 ml-3">Delete</button>
                </div>
              </div>
              {selectedToDelete() === member.id && (
                <div>
                  <p>Are you sure you want to delete this member?</p>
                  <button type="button" onClick={() => confirmDelete(member.id)} class="p-3 border rounded-md">Yes</button>
                  <button type="button" onClick={() => setSelectedToDelete("")} class="p-3 border rounded-md">No</button>
                </div>
              )}
              {selectedToUpdate() === member.id && (
                <div>
                  <FormUpdateMember pb={pb} memberId={member.id} />
                  <button type="button" onClick={() => setSelectedToUpdate("")} class="p-3 border rounded-md w-full text-center">Cancel</button>
                </div>
              )}
            </li>
          }
        </For>
      </ul>
      <button type="button" onClick={logOut} class="bg-red-600/90 hover:bg-red-700 text-white rounded-md py-3 px-5 mt-2 font-bold">Logout</button>
    </div>
  );
}