import Pocketbase from "pocketbase";
import LogoutButton from "./auth/LogoutButton";
import { Button } from "./ui/Button";
import FormUpdateMember from "~/components/forms/UpdateMemberForm";
import { BsCreditCard2BackFill } from 'solid-icons/bs'
import { RiDesignEditFill } from 'solid-icons/ri'
import { FaSolidClipboardList } from 'solid-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/Dialog"

interface MemberDashboardProps {
  pb: Pocketbase
}

export default function MemberDashboard(props: MemberDashboardProps) {

  const member = props.pb.authStore.model;

  return (
    <div class="w-fit m-auto flex flex-col gap-6">
      <h1 class="text-3xl text-center font-bold">Welcome, {member?.name}!</h1>
      <div class="flex flex-col gap-4">
        <Button size="lg" class="flex gap-2 items-center"><FaSolidClipboardList class="size-5" /> Log Attendance</Button>
        <Button size="lg" class="flex gap-2 items-center"><BsCreditCard2BackFill class="size-5" /> Manage Subscription</Button>
        <Button size="lg" class="flex gap-2 items-center">Change Plan</Button>
        <Button size="lg" class="flex gap-2 items-center">Class Schedule</Button>
        <Dialog>
          <DialogTrigger as={Button} size="lg" class="flex gap-2 items-center"><RiDesignEditFill class="size-5" />Edit Profile</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle class="flex gap-2 items-center"><RiDesignEditFill /> Edit Your Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click update when you are done.
              </DialogDescription>
            </DialogHeader>
            <FormUpdateMember pb={props.pb} memberId={member?.id} />
          </DialogContent>
        </Dialog>
      </div>
      <LogoutButton pb={props.pb} />
    </div>
  );
}