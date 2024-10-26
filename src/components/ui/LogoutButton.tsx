import { usePocket } from "~/context/PocketbaseContext";
import { useNavigate } from "@solidjs/router";
import { Accessor } from "solid-js";



export default function LogoutButton() {
  const { logout } = usePocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openModal = () => {
    const dialog = document.getElementById("logout-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  return (
    <>
      <button class="btn btn-primary" onClick={openModal}>Logout</button>
      <dialog id="logout-dialog" class="modal">
        <form method="dialog" class="modal-backdrop">
          <button>close when clicked outside</button>
        </form>
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 class="font-bold text-lg">Logout?</h3>
          <p class="py-2">You will be redirected to the login page</p>
          <div class="modal-action">
            <form method="dialog" class="flex gap-4 w-full">
              <button class="btn btn-primary grow" onClick={handleLogout}>Yes</button>
              <button class="btn grow">No</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}