import { Accessor, Setter, createEffect, createSignal, Show } from "solid-js";
import { ClassRecord, usePocket } from "~/context/PocketbaseContext";
import { BsCalendarEvent } from "solid-icons/bs";
import { IoClose } from "solid-icons/io";
import flatpickr from "flatpickr";

interface ScheduleAttendanceProps {
  classId: Accessor<string>;
  openAttendance: Accessor<boolean>;
  setOpenAttendance: Setter<boolean>;
}

export default function ScheduleAttendance(props: ScheduleAttendanceProps) {
  const { getClass } = usePocket();

  const [classToAttend, setClassToAttend] = createSignal<ClassRecord>();
  const [attendanceDate, setAttendanceDate] = createSignal<Date>(new Date());
  const [error, setError] = createSignal("");
  const [openMemberSearch, setOpenMemberSearch] = createSignal<boolean>(false);

  let dialogRef!: HTMLDialogElement;
  let dateRef!: HTMLInputElement;

  createEffect(async () => {
    // reset dialog form when dialog is opened or closed
    if (props.openAttendance()) {
      await refreshClass();
    }
  });

  const refreshClass = async () => {
    setError("");
    setOpenMemberSearch(false);
    const date = new Date();
    const thisClass = await getClass(props.classId());
    const dif = thisClass.week_day - date.getDay();
    date.setDate(date.getDate() + dif);
    setAttendanceDate(date);
    setClassToAttend(thisClass);

    flatpickr(dateRef, {
      appendTo: dialogRef,
      defaultDate: attendanceDate(),
      dateFormat: "l, F d, Y",
    });
  };

  const continueAttendance = async (e: Event) => {
    e.preventDefault();
    const classSession = await getClass(props.classId());

    // check if date has the same week day as this class
    if (attendanceDate().getDay() === classSession.week_day) {
      setOpenMemberSearch(true);
      setError("move on to next panel")
    } else {
      setError("The selected date does not fall on the same week day as the class.");
    }
  };


  return (
    <dialog id="attendance-dialog" class="modal" ref={dialogRef}>

      <form method="dialog" class="modal-backdrop">
        <button onClick={() => props.setOpenAttendance(false)}>close when clicked outside</button>
      </form>

      <div class="modal-box">

        {/* Close button */}
        <form method="dialog">
          <button onClick={() => props.setOpenAttendance(false)} class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
        </form>

        <Show
          when={openMemberSearch()}
          fallback={<>
            {/* Title */}
            <h3 class="font-bold text-xl">Attendance</h3>
            <p class="py-2 text-wrap">Select the date to take attendance for.</p>

            {/* Date picker */}
            <div class="form-control">
              <label class="label">
                <span class="label-text">Date</span>
              </label>
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
                      setAttendanceDate(selectedDate);
                    } else {
                      console.error("Invalid date");
                    }
                  }}
                  type="datetime"
                />
              </div>
            </div>

            <Show when={error()}>
              <p class="text-error mt-3">{error()}</p>
            </Show>

            <div class="modal-action">
              <form method="dialog" class="flex gap-4 w-full">
                <button onClick={(e) => continueAttendance(e)} class="btn btn-secondary flex-1">
                  Continue
                </button>
              </form>
            </div>
          </>}
        >
          {/* Member Search */}
          <h3 class="font-bold text-xl">{attendanceDate().toDateString()}</h3>
          <label class="input input-bordered flex items-center gap-2 input-sm">
            <input type="text" placeholder="Search Member" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70">
              <path
                fill-rule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clip-rule="evenodd" />
            </svg>
          </label>
        </Show>

      </div>
    </dialog >
  );
}