import ScheduleDay from "./ScheduleDay";
import ScheduleNewClass from "./ScheduleNewClass";
import { Index, createSignal } from "solid-js";
import { FaSolidPlus } from "solid-icons/fa";

export default function ScheduleWeek() {
  const [newClassDate, setNewClassDate] = createSignal<Date>(new Date());

  const openDialog = () => {
    // open dialog
    const dialog = document.getElementById("new-class-dialog") as HTMLDialogElement;
    dialog.showModal();
  }

  /* render the current week from today's date */
  const loadWeek = () => {
    const today = new Date();
    const week: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const dif = i - today.getDay();
      const day = new Date(today);
      day.setDate(today.getDate() + dif);
      week.push(day);
    }

    return <Index each={week}>
      {(day, index) => (
        <ScheduleDay date={day()} />
      )}
    </Index>;
  }

  return (<>
    <div class="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-7 gap-3 w-5/6 sm:w-11/12 xl:w-5/6 p-6 card bg-base-100 shadow-xl">
      {loadWeek()}
      <div class="col-span-1 xl:col-span-7 flex flex-col gap-2 items-center justify-center rounded-lg p-6 border border-neutral">
        <h2 class="text-lg font-semibold">Add New Class</h2>
        <button onClick={openDialog} class="btn btn-secondary btn-circle btn-lg xl:btn-md"><FaSolidPlus /> </button>
      </div>
    </div>
    <ScheduleNewClass />
  </>);
}