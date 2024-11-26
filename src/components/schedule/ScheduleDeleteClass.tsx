import { createSignal, Accessor } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { IoClose } from "solid-icons/io";

interface ScheduleDeleteProps {
  refetch: () => void;
  classId: Accessor<string>;
}

export default function ScheduleDeleteClass(props: ScheduleDeleteProps) {
  const { deleteClass } = usePocket();

  const [deleteDisabled, setDeleteDisabled] = createSignal(false);

  const confirmDeleteClass = async (e: Event, id: string) => {
    e.preventDefault();
    setDeleteDisabled(true);
    const dialog = document.getElementById("delete-class-dialog") as HTMLDialogElement;
    try {
      deleteClass(id).then(() => {
        props.refetch()
        setDeleteDisabled(false);
        dialog.close();
      });
    } catch (err) {
      console.error("Error deleting member: ", err);
    }
  };

  return (
    <dialog id="delete-class-dialog" class="modal">
      <form method="dialog" class="modal-backdrop">
        <button>close when clicked outside</button>
      </form>
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
        </form>
        <h3 class="font-bold text-lg mb-2">Delete Class?</h3>
        <div class="modal-action">
          <form method="dialog" class="flex gap-4 w-full">
            <button onClick={(event) => confirmDeleteClass(event, props.classId())} disabled={deleteDisabled()} class="btn btn-primary grow">
              {deleteDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Delete"}
            </button>
            <button class="btn grow">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}