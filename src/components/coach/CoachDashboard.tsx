import {
  createSignal,
  Match,
  Switch,
  Suspense,
  Show,
} from "solid-js";
import MemberTable from "./MemberTable";
import {
  FaRegularCalendar,
  FaSolidCalendar,
  FaSolidListCheck,
} from "solid-icons/fa";
import { RiUserFacesGroupLine, RiUserFacesGroupFill } from "solid-icons/ri";
import { BsBarChart, BsBarChartFill } from "solid-icons/bs";
import { useCoachContext } from "~/context/CoachContext";
import ScheduleWeek from "../schedule/ScheduleWeek";
import Attendance from "../attendance/Attendance";
import MonthlyRevenue from "../stats/MonthlyRevenue";
import MembersAcquired from "../stats/MembersAcquired";
import Stats from "../stats/Stats";
import TopAttendance from "../stats/TopAttendance";

enum View {
  Members = "members",
  Stats = "stats",
  Scheduler = "scheduler",
  Attendance = "attendance",
}
const [currentView, setCurrentView] = createSignal(View.Stats);

export default function CoachDashboard() {
  const {
    classes,
    refetchClasses,
    members,
    refetchMembers,
    revenue,
    monthsAgo,
    membersAttendedThisMonth
  } = useCoachContext();

  return (
    <div class="w-full flex justify-center mb-20">
      {/* Render based on currentView */}
      <Switch>
        <Match when={currentView() === View.Members}>
          <MemberTable members={members} refetch={refetchMembers} />
        </Match>

        <Match when={currentView() === View.Scheduler}>
          <ScheduleWeek classes={classes} refetch={refetchClasses} />
        </Match>

        <Match when={currentView() === View.Stats}>
          <div class="flex flex-col w-full justify-center items-center gap-16">
            <Suspense
              fallback={<div class="flex flex-col max-w-4xl w-full m-auto p-4 items-center">
                <p class="mb-6">{`Gathering ${monthsAgo()} months of data. Please wait...`}</p>
                <span class="loading loading-spinner loading-lg"></span>
              </div>}
            >
              <Show when={members() && revenue()}>
                <Stats members={members} revenue={revenue()} membersAttended={membersAttendedThisMonth} />
                <MonthlyRevenue revenueData={revenue()} />
                <MembersAcquired members={members} />
                <TopAttendance membersAttended={membersAttendedThisMonth} />
              </Show>
            </Suspense>
          </div>
        </Match>

        <Match when={currentView() === View.Attendance}>
          <Attendance />
        </Match>
      </Switch>

      <BottomNav />
    </div>
  );
}

function BottomNav() {
  return (
    <div class="btm-nav btm-nav-lg">

      <button
        onClick={() => setCurrentView(View.Stats)}
        class={currentView() === View.Stats ? "active" : "opacity-50"}
      >
        {currentView() === View.Stats ? (
          <BsBarChartFill class="size-6" />
        ) : (
          <BsBarChart class="size-6" />
        )}
        <label class="text-xs opacity-70">Stats</label>
      </button>

      <button
        onClick={() => setCurrentView(View.Members)}
        class={currentView() === View.Members ? "active" : "opacity-50"}
      >
        {currentView() === View.Members ? (
          <RiUserFacesGroupFill class="size-6" />
        ) : (
          <RiUserFacesGroupLine class="size-6" />
        )}
        <label class="text-xs opacity-70">Members</label>
      </button>

      <button
        onClick={() => setCurrentView(View.Scheduler)}
        class={currentView() === View.Scheduler ? "active" : "opacity-50"}
      >
        {currentView() === View.Scheduler ? (
          <FaSolidCalendar class="size-6" />
        ) : (
          <FaRegularCalendar class="size-6" />
        )}
        <label class="text-xs opacity-70">Classes</label>
      </button>

      <button
        onClick={() => setCurrentView(View.Attendance)}
        class={currentView() === View.Attendance ? "active" : "opacity-50"}
      >
        <FaSolidListCheck class="size-5" />
        <label class="text-xs opacity-70">Attendance</label>
      </button>
    </div>
  );
}
