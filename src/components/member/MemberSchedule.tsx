import MemberScheduleDay from "./MemberScheduleDay";
import { Index } from "solid-js";
import { createResource } from 'solid-js';
import { usePocket } from '~/context/PocketbaseContext';
import { ClassRecord } from "~/types/UserType";

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
    <div class="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-7 gap-3 w-full p-6 card bg-base-100 shadow-xl">
      {loadWeek()}
    </div>
  );
}
