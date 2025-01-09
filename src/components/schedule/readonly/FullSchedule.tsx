import { Index } from "solid-js";
import { createResource } from 'solid-js';
import { usePocket } from '~/context/PocketbaseContext';
import { ClassRecord } from "~/types/UserType";
import DaySchedule from "./DaySchedule";

export default function FullSchedule() {
  const { getClasses } = usePocket();

  // return all the classes from the database
  const [classes, { mutate, refetch }] = createResource(async () => {
    return getClasses();
  });

  // create an array of all the classes that happen on this week day
  const getDayClasses = (week_day: number) => {
    let dayClasses: ClassRecord[] = [];

    if (classes() != undefined) {
      for (let i = 0; i < classes()!.length; i++) {
        const currentClass = classes()?.at(i);
        if (currentClass!.week_day === week_day) {
          dayClasses.push(classes()![i]);
        }
      }
    }
    return dayClasses;
  };

  // render the current week from today's date
  const loadWeek = () => {
    const days: number[] = [0, 1, 2, 3, 4, 5, 6];

    return <Index each={days}>
      {(day, index) => (
        <DaySchedule week_day={day()} classes={getDayClasses(day())} />
      )}
    </Index>;
  };


  return (
    <section class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 py-16 px-8 md:px-16 gap-5 md:gap-0 bg-gray-900">
      {loadWeek()}
    </section>
  );
}
