import ScheduleDay from "./ScheduleDay";
import { For, Index } from "solid-js";

export default function ClassScheduler() {
  /* render the current week from today's date */
  const loadWeek = () => {
    const today = new Date();

    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // weekday index goes from 0-6
    // if date is 5, get the first 5 dates (0,4) and the last date (6)

    const week: Date[] = [
      yesterday,
      today,
      tomorrow,

    ];

    return <Index each={week}>
      {(day, index) => (
        <ScheduleDay date={day()} />
      )}
    </Index>;
  }

  return (
    <div class="grid sm:grid-cols-1 md:grid-cols-7 gap-3 w-5/6 p-6 card bg-base-100 shadow-xl">
      {loadWeek()}
    </div>
  );
}