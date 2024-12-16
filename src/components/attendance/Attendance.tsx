import { createSignal, Show, createResource, createEffect, For, onMount } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { BsCalendarEvent } from "solid-icons/bs";
import { FaSolidArrowLeft } from "solid-icons/fa";
import flatpickr from "flatpickr";

export default function Attendance() {
  const { getMemberAttendance, checkIn, checkOut } = usePocket();

  const [query, setQuery] = createSignal("");
  const [attendDate, setAttendDate] = createSignal<Date>(new Date());
  const [attendListIsOpen, setAttendListIsOpen] = createSignal<boolean>(false);

  const [members, { mutate, refetch }] = createResource(async () => {
    return await getMemberAttendance(attendDate());
  });

  let dateRef!: HTMLInputElement;
  let calendarRef!: HTMLDivElement;

  createEffect(() => {
    if (!attendListIsOpen()) {
      flatpickr(dateRef, {
        appendTo: calendarRef,
        defaultDate: attendDate(),
        dateFormat: "F j, Y",
        altInput: true,
        altFormat: "l, F d",
        inline: true,
      });
      refetch();
    }
  });

  const formatDate = (date: Date) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date);

    return formattedDate;
  };

  const checkInMember = async (id: string) => {
    const result = await checkIn(attendDate(), id);
    console.log("Checked in member: ", result);
  };

  const checkOutMember = async (id: string) => {
    const result = await checkOut(attendDate(), id);
    console.log("Checked out member: ", result)
  };

  return (
    <Show when={attendListIsOpen()} fallback={<>
      {/* Attendance Date */}
      <div class="w-11/12 md:w-fit card bg-base-100 shadow-xl p-8">
        <div class="flex flex-col md:flex-row gap-5 md:gap-x-10 items-start">
          <div class="flex flex-col gap-4 w-full">
            <div>
              <h1 class="font-bold text-2xl">Attendance</h1>
              <p class="py-2 text-wrap">Track gym attendance for a specific day.</p>
            </div>

            <div class="form-control w-full">
              <div class="input input-bordered flex items-center justify-start gap-4">
                <BsCalendarEvent class="w-4 h-4 opacity-70" />
                <input
                  class="border-none outline-none focus:border-none focus:outline-none grow"
                  ref={dateRef}
                  onInput={(event) => {
                    const input = event.currentTarget.value;
                    // convert the input text into a date object
                    const selectedDate = new Date(`${input} 01:00:00`);
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

            <div class="flex">
              <button onClick={() => setAttendListIsOpen(true)} class="btn btn-secondary flex-1">
                Continue
              </button>
            </div>
          </div>

          <div ref={calendarRef} class="self-center"></div>
        </div>
      </div>
    </>}>

      {/* Attendance List */}
      <div class="w-11/12 md:w-5/6 lg:w-2/3 card bg-base-100 shadow-xl px-6 pt-8">
        <button onClick={() => setAttendListIsOpen(false)} class="btn btn-sm btn-circle btn-ghost absolute left-3 md:left-6 top-8"><FaSolidArrowLeft class="size-4" /></button>
        <div class="flex flex-col gap-4 justify-center">
          <h2 class="text-2xl font-semibold text-center">{formatDate(attendDate())}</h2>

          {/* Search Members */}
          <label class="input input-bordered flex items-center gap-2 mx-2">
            <input
              type="text"
              class="grow"
              placeholder="Type your name"
              onInput={(event) => {
                const input = event.currentTarget.value;
                setQuery(input);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === "Escape") {
                  // Remove focus to hide the keyboard on mobile devices
                  event.currentTarget.blur();
                }
              }}
            />
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

          <div class="overflow-x-auto whitespace-nowrap block">
            <table class="table">
              <thead>
                <AttendListHeaders />
              </thead>
              <tbody>
                <For each={members()?.filter((member) => member.name.toLowerCase().includes(query().toLowerCase()))}>
                  {(member, index) =>
                    <tr>
                      {/* Name */}
                      <td>
                        <div class="flex items-center gap-3">
                          <div class="avatar">
                            <div class="mask mask-squircle h-12 w-12">
                              <img
                                src={member.avatarUrl}
                                alt="Avatar Tailwind CSS Component" />
                            </div>
                          </div>
                          <div>
                            <div class="font-bold">{member.name}</div>
                            <div class="flex gap-1 mt-1">
                              <span class="badge badge-neutral">{member.program ? member.program : "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </td>


                      {/* Checkbox */}
                      <td>
                        <label class="w-full flex justify-end">
                          <input
                            type="checkbox"
                            class="checkbox checkbox-success checkbox-lg"
                            onChange={(e) => e.target.checked ? checkInMember(member.id) : checkOutMember(member.id)}
                            checked={member.checkedIn}
                          />
                        </label>
                      </td>
                    </tr>
                  }
                </For>
              </tbody>
              <tfoot>
                <AttendListHeaders />
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Show>
  );
}

function AttendListHeaders() {
  return (
    <tr>
      <th>Name</th>
      <th class="text-end">Check-in</th>
    </tr>
  );
}
