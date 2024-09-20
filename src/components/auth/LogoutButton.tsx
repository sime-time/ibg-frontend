import Pocketbase from "pocketbase";
import { useNavigate } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/Dialog"

interface LogoutButtonProps {
  pb: Pocketbase;
}

export default function LogoutButton(props: LogoutButtonProps) {
  const navigate = useNavigate();

  const logOut = async () => {
    props.pb.authStore.clear();
    navigate("/login");
  }

  return (
    <Dialog>
      <DialogTrigger as={Button} class="bg-red-600/90 hover:bg-red-700 text-white py-3 px-5">
        Logout
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to log out?</DialogTitle>
          <DialogDescription>You will be redirected to the login page.</DialogDescription>
        </DialogHeader>
        <Button onClick={logOut} class="bg-red-600/90 hover:bg-red-700 text-white mt-2">Yes</Button>
      </DialogContent>
    </Dialog>
  );
}