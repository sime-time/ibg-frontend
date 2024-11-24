import ScheduleDay from "./ScheduleDay";
import ScheduleNewClass from "./ScheduleNewClass";
import { Index, createSignal } from "solid-js";
import { FaSolidPlus } from "solid-icons/fa";
import { For, createResource } from 'solid-js';
import { ClassRecord, usePocket } from '~/context/PocketbaseContext';

export default function ScheduleWeek() {
  const { getClasses } = usePocket();

  // return all the classes that happen on this day
  const [classes, { mutate, refetch }] = createResource(async () => {
    return getClasses();
  });

  const openNewClass = () => {
    const dialog = document.getElementById("new-class-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  const getDayClasses = (date: Date) => {
    // create an array of all the classes that happen on that day 
    // append all classes that are recurring on that week day 
    let dayClasses: ClassRecord[] = [];

    if (classes() != undefined) {
      for (let i = 0; i < classes()!.length; i++) {

        const currentClass = classes()?.at(i);

        if (currentClass!.date === date) {
          dayClasses.push(classes()![i]);
        } else if (currentClass!.is_recurring && currentClass!.week_day === date.getDay()) {
          dayClasses.push(classes()![i]);
        }
      }
    }
    return dayClasses;
  };

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
        <ScheduleDay date={day()} classes={getDayClasses(day())} />
      )}
    </Index>;
  };


  return (<>
    <div class="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-7 gap-3 w-5/6 sm:w-11/12 xl:w-5/6 p-6 card bg-base-100 shadow-xl">
      {loadWeek()}
      <div class="col-span-1 xl:col-span-7 flex flex-col gap-2 items-center justify-center rounded-lg py-6 border border-neutral">
        <h2 class="text-lg font-semibold text-center">New Class</h2>
        <button onClick={openNewClass} class="btn btn-secondary btn-circle btn-lg xl:btn-md"><FaSolidPlus /> </button>
      </div>
    </div>
    <ScheduleNewClass refetch={refetch} />
  </>);
}