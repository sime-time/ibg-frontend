import { Accessor, createSignal } from "solid-js";
import { IoClose } from "solid-icons/io";
import { FaSolidListCheck, FaSolidPenToSquare, FaRegularTrashCan } from "solid-icons/fa";

interface ScheduleClassMenuProps {
  classId: Accessor<string>;
  editClass: (id: string) => void;
  deleteClass: (id: string) => void;
  viewAttendance: (id: string) => void;
}

export default function ScheduleClassMenu(props: ScheduleClassMenuProps) {


  return (
    <dialog id="manage-class-dialog" class="modal">

      <form method="dialog" class="modal-backdrop">
        <button>close when clicked outside</button>
      </form>

      <div class="modal-box">

        {/* Close button */}
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
        </form>

        {/* Title */}
        <h3 class="font-bold text-xl">Class Options</h3>

        <div class="modal-action">
          <form method="dialog" class="flex flex-col gap-4 w-full">

            {/* Class Attendance */}
            <button onClick={() => props.viewAttendance(props.classId())} class="btn btn-secondary flex-1">
              <FaSolidListCheck class="size-5" />
              View Attendance
            </button>

            {/* Edit Class */}
            <button onClick={() => props.editClass(props.classId())} class="btn btn-neutral flex-1">
              <FaSolidPenToSquare class="size-5" />
              Edit Class
            </button>

            {/* Delete Class */}
            <button onClick={() => props.deleteClass(props.classId())} class="btn btn-primary grow w-full">
              <FaRegularTrashCan class="size-5" />
              Delete Class
            </button>

          </form>
        </div>

      </div>
    </dialog>
  );
}