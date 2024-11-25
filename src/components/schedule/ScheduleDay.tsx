import { For, Setter } from "solid-js";
import { ClassRecord } from "~/context/PocketbaseContext";

interface ScheduleDayProps {
  date: Date;
  classes: ClassRecord[] | undefined;
  setClassId: Setter<string>;
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

  const openEditClass = (id: string) => {
    props.setClassId(id);
    const dialog = document.getElementById("edit-class-dialog") as HTMLDialogElement;
    dialog.showModal();
  };


  return (
    <div class="flex flex-col p-4 min-w-max">
      <h2 class="text-xl font-semibold">{days[props.date.getDay()]}</h2>
      <span class="text-gray-500">{props.date.getDate()}</span>
      <div class="divider text-neutral-500"></div>
      <ul class="flex flex-col gap-4 items-center">
        <For each={props.classes}>
          {(classItem, index) =>
            <li class="w-full">
              <button onClick={() => openEditClass(classItem.id)} class="btn btn-neutral w-full">
                {`${classItem.martial_art} - ${formatTime(classItem.start_hour, classItem.start_minute)}`}
              </button>
            </li>
          }
        </For>
      </ul>
    </div >
  );
}