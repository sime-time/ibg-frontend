import Pocketbase from "pocketbase";
import { A } from "@solidjs/router";
import LogoutButton from "./auth/LogoutButton";
import { Button } from "./ui/Button";
import FormUpdateMember from "~/components/forms/FormUpdateMember";
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

export default function MemberDashboard() {

  if (!pb.authStore.isValid || pb.authStore.isAdmin) {
    return (
      <div class="text-white text-center">
        <p>You do not have access to this page.</p>
        <p>Already have an account? <A href="/login" class="underline text-red-700">Go to login</A></p>
      </div>
    );
  }

  const member = pb.authStore.model;

  return (
    <>
      <h2 class="text-2xl">Welcome, {member?.name}!</h2>
      <div class="flex flex-col gap-5">
        <Button>Manage Subscription</Button>
        <Button>Log Missed Attendance</Button>
        <Dialog>
          <DialogTrigger as={Button}>Edit Profile</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click update when you are done.
              </DialogDescription>
            </DialogHeader>
            <FormUpdateMember pb={pb} memberId={member?.id} />
          </DialogContent>
        </Dialog>
        <LogoutButton pb={pb} />
      </div>
    </>
  );
}