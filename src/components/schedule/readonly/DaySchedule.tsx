import { createMemo, For } from "solid-js";
import { ClassRecord } from "~/types/UserType";
import { classButtonStyle, fullClassName } from "../util/scheduleFormat";

interface DayScheduleProps {
  week_day: number;
  classes: ClassRecord[] | undefined;
}

export default function DaySchedule(props: DayScheduleProps) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const formatTime = (hour: number, minute: number) => {
    const formatHour: string = hour % 12 === 0 ? "12" : String(hour % 12);
    const formatMinute: string =
      minute === 0 ? "" : `:${minute.toString().padStart(2, "0")}`;
    const time = formatHour + formatMinute;
    if (hour < 12) {
      return `${time}am`;
    } else {
      return `${time}pm`;
    }
  };

  const sortedClasses = createMemo(() => {
    return props.classes?.sort((a, b) => {
      const hourDiff = a.start_hour - b.start_hour;
      if (hourDiff !== 0) {
        return hourDiff;
      } else {
        return a.start_minute - b.start_minute;
      }
    });
  });

  return (
    <div class="flex flex-col p-4 min-w-max gap-3">
      <h2 class="text-2xl font-semibold uppercase">{days[props.week_day]}</h2>
      <hr class="border-neutral border-[1px]" />
      <ul class="flex flex-col gap-3 items-center">
        <For each={sortedClasses()}>
          {(classItem, index) => (
            <li class="w-full">
              <button class={classButtonStyle(classItem.martial_art)}>
                {`${fullClassName(classItem.martial_art).toUpperCase()} `}
                <span class="text-yellow-300">
                  {`${formatTime(
                    classItem.start_hour,
                    classItem.start_minute
                  )} - ${formatTime(classItem.end_hour, classItem.end_minute)}`}
                </span>
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
