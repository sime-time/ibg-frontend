import { createMemo, For } from "solid-js";
import { ClassRecord } from "~/types/UserType";

interface MemberScheduleDayProps {
  date: Date;
  classes: ClassRecord[] | undefined;
}

export default function MemberScheduleDay(props: MemberScheduleDayProps) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const formatTime = (hour: number, minute: number) => {
    const formatHour: string = hour % 12 === 0 ? "12" : String(hour % 12);
    const formatMinute: string = minute === 0 ? "" : `:${minute.toString().padStart(2, '0')}`;
    const time = formatHour + formatMinute;
    if (hour < 12) {
      return `${time} AM`
    } else {
      return `${time} PM`
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

  const classButtonStyle = (martialArt: string) => {
    const baseStyle = "w-full btn bg-opacity-50";
    switch (martialArt) {
      case "BOX":
        return `${baseStyle} btn-primary`
      case "BJJ":
        return `${baseStyle} btn-secondary`
      default:
        return `${baseStyle} btn-neutral`
    }
  };

  const fullClassName = (martialArt: string) => {
    switch (martialArt) {
      case "BOX":
        return "Boxing"
      case "BJJ":
        return "Jiu-Jitsu"
      case "MMA":
        return "Mixed Marial Arts"
      default:
        return "Open Gym"
    }
  };

  return (
    <div class="flex flex-col p-4 min-w-max">
      <h2 class="text-xl font-semibold">{days[props.date.getDay()]}</h2>
      <span class="text-gray-500">{props.date.getDate()}</span>
      <div class="divider text-neutral-500"></div>
      <ul class="flex flex-col gap-4 items-center">
        <For each={sortedClasses()}>
          {(classItem, index) =>
            <li class="w-full">
              <button
                class={classButtonStyle(classItem.martial_art)}
              >
                {`${fullClassName(classItem.martial_art)} - ${formatTime(classItem.start_hour, classItem.start_minute)}`}
              </button>
            </li>
          }
        </For>
      </ul>
    </div >
  );
}
