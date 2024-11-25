import { IoClose } from "solid-icons/io";
import { TbClock, TbClockX } from "solid-icons/tb";
import { FaSolidHandFist } from 'solid-icons/fa'
import { BsCalendarEvent } from 'solid-icons/bs';
import { For, Show, onMount, createSignal, createEffect, Accessor } from "solid-js";
import { usePocket, MartialArtRecord } from "~/context/PocketbaseContext";
import { ClassData, ClassSchema } from "~/types/ValidationType";
import * as v from "valibot";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

interface ScheduleNewClassProps {
  refetch: () => void;
  martialArtList: Accessor<MartialArtRecord[]>
}

export default function ScheduleNewClass(props: ScheduleNewClassProps) {
  const { createClass } = usePocket();

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [martialArt, setMartialArt] = createSignal("");
  const [weekDay, setWeekDay] = createSignal<number>(-1);
  const [startHour, setStartHour] = createSignal<number>(0);
  const [startMinute, setStartMinute] = createSignal<number>(0);
  const [endHour, setEndHour] = createSignal<number>(0);
  const [endMinute, setEndMinute] = createSignal<number>(0);
  const [saveDisabled, setSaveDisabled] = createSignal<boolean>(false);
  const [error, setError] = createSignal("");

  let dialogRef!: HTMLDialogElement;
  let startRef!: HTMLInputElement;
  let endRef!: HTMLInputElement;

  createEffect(() => {
    // reset dialog form when dialog is opened or closed
    if (dialogRef) {
      dialogRef.addEventListener('open', resetNewClass);
      dialogRef.addEventListener('close', resetNewClass);

      // cleanup
      return () => {
        dialogRef.removeEventListener('open', resetNewClass);
        dialogRef.removeEventListener('close', resetNewClass);
      };
    }
  });

  onMount(async () => {
    resetNewClass();
  });


  const resetNewClass = () => {
    setError("");
    setMartialArt("");
    const today = new Date();
    today.setHours(0, 0, 0);

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
    setStartHour(8);
    setStartMinute(0);

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
    setEndHour(9);
    setStartMinute(0);
  }

  const handleSave = async (e: Event) => {
    e.preventDefault()
    setError("");
    setSaveDisabled(true);
    const today = new Date();
    today.setHours(0, 0, 0);

    const newClass: ClassData = {
      "date": today,
      "week_day": weekDay(),
      "martial_art": martialArt(),
      "is_recurring": true,
      "active": true,
      "start_hour": startHour(),
      "start_minute": startMinute(),
      "end_hour": endHour(),
      "end_minute": endMinute(),
    };

    try {
      // validate user input 
      const validClass = v.parse(ClassSchema, newClass);

      console.log(validClass.week_day);

      const successful: boolean = await createClass(validClass);

      if (successful) {
        console.log("Class created successfully!");
        resetNewClass();
        const dialog = document.getElementById("new-class-dialog") as HTMLDialogElement;
        dialog.close();
        props.refetch();
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

        {/* Title */}
        <h3 class="font-bold text-xl">Create New Class</h3>
        <p class="py-2 text-wrap">Fill in the fields and click save to create a new class.</p>

        {/* Program selector */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Program</span>
          </label>
          <div class="flex items-center input input-bordered">
            <FaSolidHandFist class="w-4 h-4 opacity-70" />
            <select
              class="select select-ghost w-full grow outline-none focus:outline-none border-none focus:border-none bg-transparent"
              onChange={(event) => {
                setMartialArt(event.target.value);
              }}
            >
              <option disabled selected>Choose a program</option>
              <For each={props.martialArtList()}>
                {(ma, index) => (
                  <option value={ma.shortname}>{ma.name}</option>
                )}
              </For>
            </select>
          </div>
        </div>

        {/* Day picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Week Day</span>
          </label>
          <div class="flex items-center input input-bordered">
            <BsCalendarEvent class="w-4 h-4 opacity-70" />
            <select
              class="select select-ghost w-full grow outline-none focus:outline-none border-none focus:border-none bg-transparent"
              onChange={(event) => {
                setWeekDay(Number(event.target.value));
              }}
            >
              <option disabled selected>Choose a week day</option>
              <For each={weekdays}>
                {(name, index) => (
                  <option value={index()}>{name}</option>
                )}
              </For>
            </select>
          </div>
        </div>

        {/* Date picker 
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
        */}

        {/* Start time picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">Start Time</span>
          </label>
          <div class="input input-bordered flex items-center justify-start">
            <TbClock class="w-4 h-4 opacity-70" />
            <input
              class="border-none outline-none focus:border-none focus:outline-none"
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
              type="text"
            />
          </div>
        </div>

        {/* End time picker */}
        <div class="form-control">
          <label class="label">
            <span class="label-text">End Time</span>
          </label>
          <div class="input input-bordered flex items-center justify-start">
            <TbClockX class="w-4 h-4 opacity-70" />
            <input
              class="border-none outline-none focus:border-none focus:outline-none"
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
            />
          </div>
        </div>

        {/* Recurring? 
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
        */}

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