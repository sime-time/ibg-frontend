import Pocketbase from "pocketbase";
import LogoutButton from "./auth/LogoutButton";
import { Button } from "./ui/Button";
import { BsCreditCard2BackFill } from 'solid-icons/bs'
import { RiDesignEditFill } from 'solid-icons/ri'
import { FaRegularCalendarDays } from 'solid-icons/fa'
import { AiOutlineStop } from 'solid-icons/ai'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/Dialog"
import UpdateMemberForm from "~/components/forms/UpdateMemberForm";

interface MemberDashboardProps {
  pb: Pocketbase
}

export default function MemberDashboard(props: MemberDashboardProps) {

  const member = props.pb.authStore.model;

  return (
    <div class="w-fit m-auto flex flex-col gap-6">
      <h1 class="text-3xl text-center font-bold">Welcome, {member?.name}!</h1>
      <div class="flex flex-col gap-4">
        <Button size="lg" class="flex gap-2 items-center"><FaRegularCalendarDays class="size-5" /> Class Schedule</Button>
        <Button size="lg" class="flex gap-2 items-center"><BsCreditCard2BackFill class="size-5" /> Manage Subscription</Button>
        <Dialog>
          <DialogTrigger as={Button} size="lg" class="flex gap-2 items-center"><RiDesignEditFill class="size-5" />Edit Profile</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle class="flex gap-2 items-center"><RiDesignEditFill /> Edit Your Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click update when you are done.
              </DialogDescription>
            </DialogHeader>
            <UpdateMemberForm pb={props.pb} memberId={member?.id} />
          </DialogContent>
        </Dialog>
        <LogoutButton pb={props.pb} />
      </div>
    </div>
  );
}