import { IoClose } from "solid-icons/io";
import { Accessor } from "solid-js";

interface ScheduleNewClassProps {
  date: Date;
}

export default function ScheduleNewClass(props: ScheduleNewClassProps) {
  return (
    <dialog id="new-class-dialog" class="modal">

      <form method="dialog" class="modal-backdrop">
        <button>close when clicked outside</button>
      </form>

      <div class="modal-box">

        {/* Close button */}
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
        </form>

        <h3 class="font-bold text-xl">Create New Class</h3>
        <p class="py-2 text-wrap">Fill in the fields and click save to create a new class.</p>

        {/* Start time */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Start Time</span>
          </label>
          <input type="datetime" value={props.date.getDay()}></input>


        </div>

      </div>

    </dialog>
  );
}