interface ScheduleDayProps {
  date: Date;
}

export default function ScheduleDay(props: ScheduleDayProps) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const today = new Date();

  const dateValue = (date: Date) => {
    return (date.getFullYear() + date.getMonth() + date.getDate());
  }

  const isToday = (date: Date) => {
    switch (dateValue(date)) {
      case dateValue(today) - 1:
        return "yesterday";
        break;

      case dateValue(today):
        return "today";
        break;

      case dateValue(today) + 1:
        return "tomorrow";
        break;

      default:
        return "."
        break;
    }
  }


  return (
    <div class="flex flex-col p-4 min-w-max">
      <span class="text-neutral-200 opacity-50">{isToday(props.date)}</span>
      <h2 class="text-lg font-semibold">{days[props.date.getDay()]}</h2>
      <span class="text-sm text-gray-500">{props.date.getDate()}</span>
      <div class="divider"></div>
      <ul class="flex flex-col gap-4 items-center">
        <li class="btn btn-neutral w-full text-secondary-content">BOX - 9:00AM</li>
        <li class="btn btn-neutral w-full text-secondary-content">BJJ - 6:00PM</li>
        <button class="btn btn-circle btn-secondary">+</button>
      </ul>
    </div>
  );
}