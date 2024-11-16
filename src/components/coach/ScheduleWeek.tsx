import ScheduleDay from "./ScheduleDay";
import { Index } from "solid-js";

export default function ScheduleWeek() {

  /* render the current week from today's date */
  const loadWeek = () => {
    const today = new Date();

    const week: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const dif = i - today.getDay();
      const day = new Date(today);
      day.setDate(today.getDate() + dif);
      console.log(today.getDate() + dif);
      week.push(day);
    }

    return <Index each={week}>
      {(day, index) => (
        <ScheduleDay date={day()} />
      )}
    </Index>;
  }

  return (
    <div class="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-7 gap-3 w-5/6 p-6 card bg-base-100 shadow-xl">
      {loadWeek()}
    </div>
  );
}