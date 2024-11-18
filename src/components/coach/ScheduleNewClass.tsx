import { FaSolidPlus } from "solid-icons/fa";
import { IoClose } from "solid-icons/io";
import { TbClock } from "solid-icons/tb";
import { createSignal } from "solid-js";

interface ScheduleNewClassProps {
  dialogId: string;
  targetDay: number; // week day index
}

export default function ScheduleNewClass(props: ScheduleNewClassProps) {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();

  // calculate the difference to the target day (negative for past days)
  const diff = (props.targetDay - currentDay - 7) % 7;

  // set the new date for this specific class
  const classDate = new Date();
  classDate.setDate(currentDate.getDate() + diff);

  const [startTime, setStartTime] = createSignal<Date>(classDate);
  const [endTime, setEndTime] = createSignal<Date>(classDate);

  const openDialog = () => {
    const dialog = document.getElementById(props.dialogId) as HTMLDialogElement;
    dialog.showModal();
  }

  return (<>
    <button onClick={openDialog} class="btn btn-sm btn-circle btn-secondary"><FaSolidPlus /></button>
    <dialog id={props.dialogId} class="modal">

      <form method="dialog" class="modal-backdrop">
        <button>close when clicked outside</button>
      </form>

      <div class="modal-box">

        {/* Close button */}
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
        </form>

        <h3 class="font-bold text-xl">Create New Class: {props.dialogId}</h3>
        <p class="py-2 text-wrap">Fill in the fields and click save to create a new class.</p>

        {/* Start time */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Start Time</span>
          </label>

        </div>

      </div>

    </dialog>
  </>);
}