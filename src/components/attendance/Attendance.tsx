import { Accessor, Setter, createEffect, createSignal, Show, onMount } from "solid-js";
import { ClassRecord, usePocket } from "~/context/PocketbaseContext";
import { BsCalendarEvent } from "solid-icons/bs";
import flatpickr from "flatpickr";

function AttendanceTitle() {
  return <>
    <h3 class="font-bold text-2xl">Attendance</h3>
    <p class="py-2 text-wrap">Select a date to take daily attendance for all classes at once.</p>
  </>;
}

export default function Attendance() {

  const [attendDate, setAttendDate] = createSignal<Date>(new Date());
  const [openAttendList, setOpenAttendList] = createSignal<boolean>(false);

  let dateRef!: HTMLInputElement;
  let calendarRef!: HTMLDivElement;

  onMount(() => {
    refreshDate();
  })

  const refreshDate = () => {
    setOpenAttendList(false);

    flatpickr(dateRef, {
      appendTo: calendarRef,
      defaultDate: attendDate(),
      dateFormat: "l, F d",
    });
  };

  return (
    <div class="w-11/12 xl:w-fit flex-col gap-4 card bg-base-100 shadow-xl p-8 md:p-10 items-start">

      {/* Title */}
      <div>
        <h3 class="font-bold text-2xl">Attendance</h3>
        <p class="py-2 text-wrap">Take attendance for all classes on a specific date.</p>
      </div>

      {/* Date Picker */}
      <div class="form-control w-full">
        <div class="input input-bordered flex items-center justify-start gap-4">
          <BsCalendarEvent class="w-4 h-4 opacity-70" />
          <input
            class="border-none outline-none focus:border-none focus:outline-none grow"
            ref={dateRef}
            onInput={(event) => {
              const input = event.currentTarget.value;
              // convert the input text into a date object 
              const selectedDate = new Date(input);
              if (!isNaN(selectedDate.getDate())) {
                setAttendDate(selectedDate);
              } else {
                console.error("Invalid date");
              }
            }}
            type="datetime"
          />
        </div>
      </div>

      <div class="w-full flex">
        <button onClick={() => setOpenAttendList(true)} class="btn btn-secondary flex-1">
          Continue
        </button>
      </div>

    </div>
  );
}