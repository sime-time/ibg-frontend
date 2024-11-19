import { Setter, createSignal } from 'solid-js';
import { FaSolidPlus } from 'solid-icons/fa';

interface ScheduleDayProps {
  date: Date;
  setDate: Setter<Date>;
}

export default function ScheduleDay(props: ScheduleDayProps) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [startTime, setStartTime] = createSignal<Date>(props.date);
  const [endTime, setEndTime] = createSignal<Date>(props.date);

  const openDialog = () => {
    // reset values 
    setStartTime(props.date);
    setEndTime(props.date);
    props.setDate(props.date);

    // open dialog
    const dialog = document.getElementById("new-class-dialog") as HTMLDialogElement;
    dialog.showModal();
  }

  return (
    <div class="flex flex-col p-4 min-w-max">
      <h2 class="text-xl font-semibold">{days[props.date.getDay()]}</h2>
      <span class="text-gray-500">{props.date.getDate()}</span>
      <div class="divider text-neutral-500"></div>
      <ul class="flex flex-col gap-4 items-center">
        <li class="btn btn-neutral w-full text-secondary-content">BOX - 9:00AM</li>
        <li class="btn btn-neutral w-full text-secondary-content">BJJ - 6:00PM</li>
        <button onClick={openDialog} class="btn btn-sm btn-circle btn-secondary"><FaSolidPlus /></button>
      </ul>
    </div>
  );
}