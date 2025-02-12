import { For, Resource, Suspense } from "solid-js";
import { MemberRecord } from "~/types/UserType";
import LoadingSpinner from "../ui/LoadingSpinner";
import { subscriptionBadge } from "../coach/MemberTable";

interface TopAttendanceProps {
  membersAttended: Resource<MemberRecord[]>;
}
export default function TopAttendance(props: TopAttendanceProps) {
  const today = new Date();
  function getMonthName(date: Date): string {
    const monthNames = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    return monthNames[date.getMonth()];
  }

  return (
    <div class="overflow-x-auto w-full max-w-xl">
      <h1 class="text-center text-2xl font-bold mb-3">Attendance {getMonthName(today)} {today.getFullYear()} </h1>
      <Suspense fallback={<LoadingSpinner />}>
        <table class="table bg-base-100">
          <thead><AttendanceTableHeaders /></thead>
          <tbody>
            <For each={props.membersAttended()?.slice().sort((a, b) => (b.attendance ?? 0) - (a.attendance ?? 0))}>
              {(member) => (
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="avatar">
                        <div class="mask mask-squircle h-12 w-12">
                          <img src={member.avatarUrl} alt="Member Avatar" />
                        </div>
                      </div>
                      <div>
                        <div class="font-semibold text-lg">{member.name}</div>
                        <div class="flex gap-2 mt-1">
                          <span>
                            {subscriptionBadge(
                              member.is_subscribed,
                              member.pay_with_cash ? true : false
                            )}
                          </span>
                          <span class="badge badge-neutral">
                            {member.program ? member.program : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="flex justify-center text-2xl font-semibold bg-neutral/60 p-3 mask mask-squircle">
                      {member.attendance}
                    </span>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
          <tfoot><AttendanceTableHeaders /></tfoot>
        </table>
      </Suspense>
    </div >
  );
}

function AttendanceTableHeaders() {
  return (
    <tr>
      <th>Member</th>
      <th class="text-center">Days Attended</th>
    </tr>
  );
}
