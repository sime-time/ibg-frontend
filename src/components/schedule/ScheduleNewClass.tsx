import { IoClose } from "solid-icons/io";
import { TbClock, TbClockX } from "solid-icons/tb";
import { FaSolidArrowRotateRight, FaSolidHandFist } from 'solid-icons/fa'
import { BsCalendarEvent } from 'solid-icons/bs'
import { Show, onMount, createSignal, createEffect } from "solid-js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

export default function ScheduleNewClass() {
  const [startHour, setStartHour] = createSignal<number>(0);
  const [startMinute, setStartMinute] = createSignal<number>(0);
  const [endHour, setEndHour] = createSignal<number>(0);
  const [endMinute, setEndMinute] = createSignal<number>(0);
  const [recurring, setRecurring] = createSignal<boolean>(true);
  const [saveDisabled, setSaveDisabled] = createSignal<boolean>(false);
  const [error, setError] = createSignal("");

  let dialogRef!: HTMLDialogElement;
  let dateRef!: HTMLInputElement;
  let startRef!: HTMLInputElement;
  let endRef!: HTMLInputElement;


  onMount(() => {
    const today = new Date();
    today.setHours(0, 0, 0);

    flatpickr(dateRef, {
      appendTo: dialogRef,
      minDate: today,
      defaultDate: today,
      dateFormat: "D F j, Y"
    });

    flatpickr(startRef, {
      appendTo: dialogRef,
      enableTime: true,
      noCalendar: true,
      dateFormat: "h:i K",
      minDate: today,
      enableSeconds: false,
    });

    flatpickr(endRef, {
      appendTo: dialogRef,
      enableTime: true,
      noCalendar: true,
      dateFormat: "h:i K",
      minDate: today,
      enableSeconds: false,
    });
  });

  const handleSave = () => {

  };

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
        <div class="form-control">
          <label class="label">
            <span class="label-text">Program</span>
          </label>
          <div class="flex">
            <select class="select select-bordered w-full grow">
              <option disabled selected>Choose a program</option>
              <option>Boxing</option>
              <option>Jiu Jitsu</option>
              <option>MMA</option>
            </select>
          </div>
        </div>

        {/* Date picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Date</span>
          </label>
          <label class="input input-bordered flex items-center gap-2">
            <BsCalendarEvent class="w-4 h-4 opacity-70" />
            <input
              onInput={(event) => {
                console.log(event.currentTarget.value);
              }}
              ref={dateRef}
              type="datetime"
              class="grow"
            />
          </label>
        </div>

        {/* Start time picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Start Time</span>
          </label>
          <label class="input input-bordered flex items-center gap-2">
            <TbClock class="w-4 h-4 opacity-70" />
            <input
              onInput={(event) => {
                console.log("Start: ", event.currentTarget.value);
              }}
              ref={startRef}
              type="text"
              class="grow"
            />
          </label>
        </div>

        {/* End time picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">End Time</span>
          </label>
          <label class="input input-bordered flex items-center gap-2">
            <TbClockX class="w-4 h-4 opacity-70" />
            <input
              onInput={(event) => {
                console.log("End: ", event.currentTarget.value);
              }}
              ref={endRef}
              type="datetime"
              class="grow"
            />
          </label>
        </div>

        {/* Recurring? */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Recurring Weekly?</span>
          </label>
          <div class="flex justify-between items-center input input-bordered">
            <div class="flex items-center gap-4 ">
              <FaSolidArrowRotateRight class="w-4 h-4 opacity-70" />
              <input type="checkbox" class="toggle toggle-success" checked={recurring()} onChange={() => setRecurring(!recurring())} />
            </div>
            <span class="label-text justify-self-end">{recurring() ? "Every week" : "One-time"}</span>
          </div>
        </div>

        <Show when={error()}>
          <p class="text-error mt-3">{error()}</p>
        </Show>

        <div class="modal-action">
          <form method="dialog" class="flex gap-4 w-full">
            <button onClick={handleSave} disabled={saveDisabled()} class="btn btn-secondary flex-1">
              {saveDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Save"}
            </button>
          </form>
        </div>


      </div>

    </dialog>
  );
}