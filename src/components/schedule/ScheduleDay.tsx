import { createMemo, createEffect, For, Setter } from "solid-js";
import { ClassRecord } from "~/context/PocketbaseContext";

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
      return `${time} AM`
    } else {
      return `${time} PM`
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
                onClick={() => openClassMenu(classItem.id)}
                class={classButtonStyle(classItem.martial_art)}
              >
                {`${classItem.martial_art} - ${formatTime(classItem.start_hour, classItem.start_minute)}`}
              </button>
            </li>
          }
        </For>
      </ul>
    </div >
  );
}