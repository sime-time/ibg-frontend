import CoachCreateMember from "./CoachCreateMember";
import { createSignal } from "solid-js";
import { MemberTable } from "./CoachMemberTable";
import { FaSolidUsers } from 'solid-icons/fa'
import { BsBarChart, BsBarChartFill } from "solid-icons/bs";

export default function CoachDashboard() {
  const [viewTable, setViewTable] = createSignal(true);
  const [viewSchedule, setViewSchedule] = createSignal(false);
  const [viewStats, setViewStats] = createSignal(false);

  return (
    <div class="max-w-fit w-screen flex flex-col gap-4">
      <div class="flex justify-between">
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
        <div>
          <CoachCreateMember />
        </div>
      </div>

      <MemberTable />

      <div class="btm-nav">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button class="active">
          <FaSolidUsers class="size-6" />
        </button>
        <button>
          <BsBarChart class="size-6" />
        </button>
      </div>

    </div>
  );
}