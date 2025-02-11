import { IoClose } from "solid-icons/io";
import { TbClock, TbClockX } from "solid-icons/tb";
import { FaSolidHandFist } from 'solid-icons/fa'
import { BsCalendarEvent } from 'solid-icons/bs';
import { For, Show, createSignal, createEffect, Accessor, Setter } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { MartialArtRecord } from "~/types/UserType";
import { ClassData, ClassSchema } from "~/types/ValidationType";
import * as v from "valibot";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Portal } from "solid-js/web";

interface ScheduleEditClassProps {
  refetch: () => void;
  martialArtList: Accessor<MartialArtRecord[]>
  classId: Accessor<string>;
  openEdit: Accessor<boolean>;
  setOpenEdit: Setter<boolean>;
}

export default function ScheduleEditClass(props: ScheduleEditClassProps) {
  const { getClass, updateClass } = usePocket();

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [martialArt, setMartialArt] = createSignal("");
  const [classDate, setClassDate] = createSignal<Date>(new Date());
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
  let selectProgramRef!: HTMLSelectElement;
  let selectDayRef!: HTMLSelectElement;

  createEffect(() => {
    // reset dialog form when dialog is opened or closed
    if (props.openEdit()) {
      refreshEditClass();
    }
  });

  const refreshEditClass = async () => {
    const today = new Date();
    today.setHours(0, 0, 0);

    const classToEdit = await getClass(props.classId());

    selectProgramRef.value = String(classToEdit.martial_art);
    selectDayRef.value = String(classToEdit.week_day);

    setMartialArt(classToEdit.martial_art);
    setWeekDay(classToEdit.week_day);
    setClassDate(classToEdit.date);
    setStartHour(classToEdit.start_hour);
    setStartMinute(classToEdit.start_minute);
    setEndHour(classToEdit.end_hour);
    setEndMinute(classToEdit.end_minute);

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

    flatpickr(endRef, {
      appendTo: dialogRef,
      enableTime: true,
      noCalendar: true,
      enableSeconds: false,
      defaultDate: today.setHours(endHour(), endMinute()),
      dateFormat: "H:i",
      altInput: true,
      altFormat: "h:i K", // user sees this format
    });
  }

  const handleSave = async (e: Event) => {
    e.preventDefault()
    setError("");
    setSaveDisabled(true);

    const updatedClass: ClassData = {
      "date": new Date(classDate()),
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
      const validClass = v.parse(ClassSchema, updatedClass);

      const successful: boolean = await updateClass(props.classId(), validClass);

      if (successful) {
        console.log("Class updated successfully!");
        props.setOpenEdit(false);
        const dialog = document.getElementById("edit-class-dialog") as HTMLDialogElement;
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
    <Portal>
      <dialog id="edit-class-dialog" ref={dialogRef} class="modal auto-visibility">

        <form method="dialog" class="modal-backdrop">
          <button onClick={() => props.setOpenEdit(false)}>close when clicked outside</button>
        </form>

        <div class="modal-box">

          {/* Close button */}
          <form method="dialog">
            <button onClick={() => props.setOpenEdit(false)} class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><IoClose class="size-4" /></button>
          </form>

          {/* Title */}
          <h3 class="font-bold text-xl">Edit Class</h3>
          <p class="py-2 text-wrap">Change the field inputs and click save to update this class.</p>

          {/* Program selector */}
          <div class="form-control">
            <label class="label">
              <span class="label-text">Program</span>
            </label>
            <div class="flex items-center input input-bordered">
              <FaSolidHandFist class="w-4 h-4 opacity-70" />
              <select
                ref={selectProgramRef}
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
                ref={selectDayRef}
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

          {/* Start time picker */}
          <div class="form-control">
            <label class="label">
              <span class="label-text">Start Time</span>
            </label>
            <div class="input input-bordered flex items-center justify-start gap-4 lg:gap-0">
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
            <div class="input input-bordered flex items-center justify-start gap-4 lg:gap-0">
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
    </Portal>
  );
}
