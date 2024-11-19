import ScheduleDay from "./ScheduleDay";
import ScheduleNewClass from "./ScheduleNewClass";
import { Index, createSignal } from "solid-js";

export default function ScheduleWeek() {
  const [newClassDate, setNewClassDate] = createSignal<Date>(new Date());

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
        <ScheduleDay date={day()} setDate={setNewClassDate} />
      )}
    </Index>;
  }

  return (<>
    <div class="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-7 gap-3 w-5/6 sm:w-11/12 xl:w-5/6 p-6 card bg-base-100 shadow-xl">
      {loadWeek()}
    </div>
    <ScheduleNewClass date={newClassDate()} />
  </>);
}