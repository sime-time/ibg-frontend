import ScheduleNewClass from './ScheduleNewClass';
import { FaSolidPlus } from 'solid-icons/fa';

interface ScheduleDayProps {
  date: Date;
}

export default function ScheduleDay(props: ScheduleDayProps) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div class="flex flex-col p-4 min-w-max">
      <h2 class="text-xl font-semibold">{days[props.date.getDay()]}</h2>
      <span class="text-gray-500">{props.date.getDate()}</span>
      <div class="divider text-neutral-500"></div>
      <ul class="flex flex-col gap-4 items-center">
        <li class="btn btn-neutral w-full text-secondary-content">BOX - 9:00AM</li>
        <li class="btn btn-neutral w-full text-secondary-content">BJJ - 6:00PM</li>
        <ScheduleNewClass classDate={props.date} dialogId={`${days[props.date.getDay()]}-dialog`} />
      </ul>
    </div>
  );
}