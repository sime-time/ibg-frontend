import { IoClose } from "solid-icons/io";
import { onMount, createSignal } from "solid-js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

export default function ScheduleNewClass() {
  const [startTime, setStartTime] = createSignal<Date>(new Date());

  let dialogRef!: HTMLDialogElement;
  let dateRef!: HTMLInputElement;
  let startRef!: HTMLInputElement;
  let endRef!: HTMLInputElement;

  onMount(() => {
    const today = new Date();
    today.setHours(0, 0);

    flatpickr(dateRef, {
      appendTo: dialogRef,
      minDate: today,
      defaultDate: today,
    });

    flatpickr(startRef, {
      appendTo: dialogRef,
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
    });

    flatpickr(endRef, {
      appendTo: dialogRef,
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      minDate: startTime(),
    });
  });

  return (
    <dialog id="new-class-dialog" ref={dialogRef} class="modal">

      <form method="dialog" class="modal-backdrop">
        <button>close when clicked outside</button>
      </form>

      <div class="modal-box">

        {/* Close button */}
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
        </form>

        <h3 class="font-bold text-xl">Create New Class</h3>
        <p class="py-2 text-wrap">Fill in the fields and click save to create a new class.</p>

        {/* Program selector */}

        {/* Date picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Date</span>
          </label>
          <input ref={dateRef} type="datetime"></input>
        </div>

        {/* Start time picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Start Time</span>
          </label>
          <input ref={startRef}></input>
        </div>

        {/* End time picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">End Time</span>
          </label>
          <input ref={endRef}></input>
        </div>

        {/* Recurring? */}

      </div>

    </dialog>
  );
}