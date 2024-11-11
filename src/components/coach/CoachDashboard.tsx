import CoachCreateMember from "./CoachCreateMember";
import { MemberTable } from "./CoachMemberTable";
import { FaSolidPlus } from 'solid-icons/fa'

export default function CoachDashboard() {
  return (
    <div class="max-w-fit flex flex-col gap-4">
      <div class="flex justify-between items-end">
        <label class="input input-bordered flex items-center gap-2 input-sm">
          <input type="text" class="grow" placeholder="Search Member" />
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
        <CoachCreateMember />
      </div>
      <MemberTable />
    </div>
  );
}