import { createMemo, createEffect, For, Setter } from "solid-js";
import { ClassRecord } from "~/types/UserType";

interface ScheduleDayProps {
  date: Date;
  classes: ClassRecord[] | undefined;
  setClassId: Setter<string>;
  setOpenEdit: Setter<boolean>;
}

export default function ScheduleDay(props: ScheduleDayProps) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const formatTime = (hour: number, minute: number) => {
    const formatHour: string = hour % 12 === 0 ? "12" : String(hour % 12);
    const formatMinute: string = minute === 0 ? "" : `:${minute.toString().padStart(2, '0')}`;
    const time = formatHour + formatMinute;
    if (hour < 12) {
      return `${time}am`
    } else {
      return `${time}pm`
    }
  };

  const openClassMenu = (id: string) => {
    props.setClassId(id)

    // this will make sure the start and end time are accurate immediately
    // when user presses edit button
    props.setOpenEdit(true);
    props.setOpenEdit(false);

    const dialog = document.getElementById("manage-class-dialog") as HTMLDialogElement;
    dialog.showModal();
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
    const baseStyle = "w-full btn btn-sm btn-block bg-opacity-50";
    switch (martialArt) {
      case "BOX":
        return `${baseStyle} btn-primary`
      case "BJJ":
        return `${baseStyle} btn-secondary`
      case "MMA":
        return `${baseStyle} btn-primary text-purple-200 bg-purple-500 border-purple-700 bg-opacity-30 hover:bg-purple-700 hover:border-purple-700`
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
        return "MMA"
      default:
        return "Open Gym"
    }
  };

  return (
    <div class="flex flex-col p-4 min-w-max gap-3">
      <h2 class="text-2xl font-semibold uppercase">{days[props.date.getDay()]}</h2>
      <hr class="border-neutral border-[1px]" />
      <ul class="flex flex-col gap-3 items-center">
        <For each={sortedClasses()}>
          {(classItem, index) =>
            <li class="w-full">
              <button class={classButtonStyle(classItem.martial_art)}>
                {`${fullClassName(classItem.martial_art).toUpperCase()} ${formatTime(classItem.start_hour, classItem.start_minute)} - ${formatTime(classItem.end_hour, classItem.end_minute)}`}
              </button>
            </li>
          }
        </For>
      </ul>
    </div >
  );
}
