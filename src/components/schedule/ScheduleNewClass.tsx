import { IoClose } from "solid-icons/io";
import { TbClock, TbClockX } from "solid-icons/tb";
import { FaSolidArrowRotateRight } from 'solid-icons/fa'
import { BsCalendarEvent } from 'solid-icons/bs'
import { Show, onMount, createSignal } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { ClassData, ClassSchema } from "~/types/ValidationType";
import * as v from "valibot";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

export default function ScheduleNewClass() {
  const [classDate, setClassDate] = createSignal<Date>(new Date());
  const [startHour, setStartHour] = createSignal<number>(0);
  const [startMinute, setStartMinute] = createSignal<number>(0);
  const [endHour, setEndHour] = createSignal<number>(0);
  const [endMinute, setEndMinute] = createSignal<number>(0);
  const [recurring, setRecurring] = createSignal<boolean>(true);
  const [saveDisabled, setSaveDisabled] = createSignal<boolean>(false);
  const [error, setError] = createSignal("");

  const martialArtShortNames = ["BOX", "BJJ", "MMA"];
  const { getMartialArtId, createClass } = usePocket();
  const [martialArt, setMartialArt] = createSignal("");

  let dialogRef!: HTMLDialogElement;
  let dateRef!: HTMLInputElement;
  let startRef!: HTMLInputElement;
  let endRef!: HTMLInputElement;


  onMount(() => {
    resetNewClass();
  });

  const resetNewClass = () => {
    setRecurring(true);
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
      enableSeconds: false,
      defaultDate: today.setHours(8, 0),
      dateFormat: "H:i",
      altInput: true,
      altFormat: "h:i K", // user sees this format 
    });

    flatpickr(endRef, {
      appendTo: dialogRef,
      enableTime: true,
      noCalendar: true,
      enableSeconds: false,
      defaultDate: today.setHours(9, 0),
      dateFormat: "H:i",
      altInput: true,
      altFormat: "h:i K", // user sees this format 
    });
  }

  const handleSave = async (e: Event) => {
    e.preventDefault()
    setError("");
    setSaveDisabled(true);

    const martialArtId = await getMartialArtId(martialArt());

    const newClass: ClassData = {
      "date": classDate(),
      "martial_art_id": martialArtId,
      "is_recurring": recurring(),
      "active": true,
      "start_hour": startHour(),
      "start_minute": startMinute(),
      "end_hour": endHour(),
      "end_minute": endMinute(),
    };

    try {
      // validate user input 
      const validClass = v.parse(ClassSchema, newClass);

      const successful: boolean = await createClass(validClass);

      if (successful) {
        console.log("Class created successfully!");
        resetNewClass();
        const dialog = document.getElementById("new-class-dialog") as HTMLDialogElement;
        dialog.close();
      } else {
        throw new Error("server_error");
      }

    } catch (err) {
      if (err instanceof v.ValiError) {
        setError(err.issues[0].message);
      } else if (err instanceof Error && err.message == "server_error") {
        setError("Internal server error. Try again later.")
      } else {
        setError("New class data is invalid.");
      }
    } finally {
      setSaveDisabled(false);
    }
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
            <select
              class="select select-bordered w-full grow"
              onChange={(event) => {
                setMartialArt(event.target.value);
              }}
            >
              <option disabled selected>Choose a program</option>
              <option value={martialArtShortNames[0]}>Boxing</option>
              <option value={martialArtShortNames[1]}>Jiu Jitsu</option>
              <option value={martialArtShortNames[2]}>MMA</option>
            </select>
          </div>
        </div>

        {/* Date picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Date</span>
          </label>
          <div class="input input-bordered flex items-center gap-2">
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

        {/* Start time picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Start Time</span>
          </label>
          <label class="input input-bordered flex items-center gap-2">
            <TbClock class="w-4 h-4 opacity-70" />
            <input
              onInput={(event) => {
                const input = event.currentTarget.value;

                // parse the colon -> (hours:minutes)
                const time = input.split(":");
                const hour: number = parseInt(time[0], 10);
                const minute: number = parseInt(time[1], 10);

                if (!isNaN(hour) && !isNaN(minute)) {
                  setStartHour(hour);
                  setStartMinute(minute);
                } else {
                  console.error("Invalid start time");
                }
              }}
              ref={startRef}
              type="datetime"
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
                const input = event.currentTarget.value;

                // parse the colon -> (hours:minutes)
                const time = input.split(":");
                const hour: number = parseInt(time[0], 10);
                const minute: number = parseInt(time[1], 10);

                if (!isNaN(hour) && !isNaN(minute)) {
                  setEndHour(hour);
                  setEndMinute(minute);
                } else {
                  console.error("Invalid end time");
                }
              }}
              ref={endRef}
              type="text"
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
            <div class="flex items-center gap-5">
              <FaSolidArrowRotateRight class="w-4 h-4 opacity-70" />
              <input type="checkbox" class="checkbox checkbox-success" checked={recurring()} onChange={() => setRecurring(!recurring())} />
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