import MemberScheduleDay from "./MemberScheduleDay";
import { Index, createSignal, onMount } from "solid-js";
import { For, createResource } from 'solid-js';
import { ClassRecord, usePocket } from '~/context/PocketbaseContext';
import { IoClose } from "solid-icons/io";

export default function MemberSchedule() {
  const { getClasses } = usePocket();

  // return all the classes from the database 
  const [classes, { mutate, refetch }] = createResource(async () => {
    return getClasses();
  });

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
        <MemberScheduleDay date={day()} classes={getDayClasses(day())} />
      )}
    </Index>;
  };


  return (
    <dialog id="member-schedule-dialog" class="modal">

      <form method="dialog" class="modal-backdrop">
        <button >close when clicked outside</button>
      </form>

      <div class="w-5/6 sm:w-11/12 xl:w-5/6 p-6 card bg-base-100 shadow-xl">

        {/* Close button */}
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
        </form>

        {/* Title */}

        {/* Class Schedule */}
        <div class="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-7 gap-3">
          {loadWeek()}
        </div>

        <div class="modal-action">
          <form method="dialog" class="flex gap-4 w-full">
            <button class="btn btn-neutral flex-1">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

