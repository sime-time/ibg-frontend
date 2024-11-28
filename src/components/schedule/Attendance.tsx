import { Accessor, Setter, createEffect } from "solid-js";
import flatpickr from "flatpickr";

interface AttendanceProps {
  classId: Accessor<string>;
  openAttendance: Accessor<boolean>;
  setOpenAttendance: Setter<boolean>;
}

export default function Attendance(props: AttendanceProps) {

  createEffect(() => {
    // reset dialog form when dialog is opened or closed
    if (props.openAttendance()) {
      refreshClass();
    }
  });

  const refreshClass = async () => {
    const classSession = await getClass(props.classId());
    const today = new Date();

    flatpickr(startRef, {
      appendTo: dialogRef,
      enableTime: true,
      noCalendar: true,
      enableSeconds: false,
      defaultDate: today.setHours(startHour(), startMinute()),
      dateFormat: "H:i",
      altInput: true,
      altFormat: "h:i K", // user sees this format 
    });
  }


  return (
    <dialog id="attendance-dialog" class="modal">

      <form method="dialog" class="modal-backdrop">
        <button>close when clicked outside</button>
      </form>

      <div class="modal-box">

        {/* Close button */}
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
        </form>

        {/* Title */}
        <h3 class="font-bold text-xl">Manage Attendance</h3>
        <p class="py-2 text-wrap">Select the date to take attendace for.</p>
        {/* Date picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Date</span>
          </label>
          <div class="input input-bordered flex items-center gap-4">
            <BsCalendarEvent class="w-4 h-4 opacity-70" />
            <input
              onInput={(event) => {
                const input = event.currentTarget.value;
                // convert the input text into a date object 
                const selectedDate = new Date(input);
                if (!isNaN(selectedDate.getDate())) {
                  setClassDate(selectedDate);
                } else {
                  console.error("Invalid date");
                }
              }}
              ref={dateRef}
              type="datetime"
            />
          </div>
        </div>

        <div>
          <h3>Attendance for:</h3>
          <p>date here</p>
        </div>

        <Show when={error()}>
          <p class="text-error mt-3">{error()}</p>
        </Show>

        <div class="modal-action">
          <form method="dialog" class="flex gap-4 w-full">
            <button class="btn btn-secondary flex-1">
              Continue
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}