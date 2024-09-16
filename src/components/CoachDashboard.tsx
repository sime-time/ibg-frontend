import { createSignal, createResource, For, Show } from "solid-js";
import Pocketbase from "pocketbase";
import { useNavigate, A } from "@solidjs/router";
import FormCreateMember from "~/components/forms/FormCreateMember";
import FormUpdateMember from "~/components/forms/FormUpdateMember";
import LogoutButton from "./LogoutButton";
import { MemberRecord } from "~/lib/MemberRecord";
import { Button } from "~/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/Dialog"

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function CoachDashboard() {

  const [members, { mutate, refetch }] = createResource(async () => {
    return await pb.collection("member").getFullList<MemberRecord>();
  });

  const confirmDelete = async (memberId: string) => {
    try {
      await pb.collection("member").delete(memberId);
      refetch();
      console.log(`Member id:${memberId} deleted from database.`);
    } catch (err) {
      console.error("Error deleting member: ", err);
    }
  }

  if (!pb.authStore.isValid || !pb.authStore.isAdmin) {
    return (
      <div class="text-white text-center">
        <p>You do not have access to this page.</p>
        <p>Already have an account? <A href="/login" class="underline text-red-700">Go to login</A></p>
      </div>
    );
  }

  const coach = pb.authStore.model;

  return (
    <div class="flex flex-col justify-center items-center gap-5">
      <h2 class="text-2xl">Welcome, {coach?.email}!</h2>

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
                <div class="inline-flex">
                  <Dialog>
                    <DialogTrigger as={Button} class="p-3 border rounded-md border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500/30 ml-3">Edit</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Member Profile</DialogTitle>
                        <DialogDescription>
                          Make changes to a member here. Click update when you are done.
                        </DialogDescription>
                      </DialogHeader>
                      <FormUpdateMember pb={pb} memberId={member.id} />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger as={Button} class="p-3 border rounded-md border-red-500 text-red-500 bg-transparent hover:bg-red-500/30 ml-3">Delete</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete {member.name}?</DialogTitle>
                      </DialogHeader>
                      <Button onClick={() => confirmDelete(member.id)} class="bg-red-600/90 hover:bg-red-700 text-white mt-3">Yes, delete</Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </li>
          }
        </For>
      </ul>

      <div class="flex gap-5">
        <Dialog>
          <DialogTrigger as={Button} class="bg-blue-600/90 hover:bg-blue-700 text-white py-3 px-5">Create New Member</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Member</DialogTitle>
              <DialogDescription>Add a new member to the gym. The member must be aware of what their password is.</DialogDescription>
            </DialogHeader>
            <FormCreateMember />
          </DialogContent>
        </Dialog>

        <LogoutButton pb={pb} />
      </div>
    </div>
  );
}