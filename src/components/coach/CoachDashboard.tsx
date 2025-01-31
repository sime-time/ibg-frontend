import {
  createSignal,
  Match,
  Switch,
  createResource,
  Suspense,
  Show,
} from "solid-js";
import { MemberTable } from "./CoachMemberTable";
import {
  FaRegularCalendar,
  FaSolidCalendar,
  FaSolidListCheck,
} from "solid-icons/fa";
import { RiUserFacesGroupLine, RiUserFacesGroupFill } from "solid-icons/ri";
import { BsBarChart, BsBarChartFill } from "solid-icons/bs";
import { usePocket } from "~/context/PocketbaseContext";
import ScheduleWeek from "../schedule/ScheduleWeek";
import Attendance from "../attendance/Attendance";
import MonthlyRevenue from "../stats/MonthlyRevenue";
import MembersAcquired from "../stats/MembersAcquired";

enum View {
  Members = "members",
  Stats = "stats",
  Scheduler = "scheduler",
  Attendance = "attendance",
}

export default function CoachDashboard() {
  // higher-level data load for schedule tab
  const { getClasses } = usePocket();
  const [classes, { mutate, refetch }] = createResource(async () => {
    return getClasses();
  });

  // higher-level data load for stats tab
  const fetchRevenue = async (monthsAgo: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_POCKETBASE_URL}/revenue-data`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ monthsAgo }),
        }
      );
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error("Error fetching revenue (client): ", error);
      throw error;
    }
  };
  const [revenueData] = createResource(() => fetchRevenue(6));

  const [currentView, setCurrentView] = createSignal(View.Members);

  return (
    <div class="w-full flex justify-center mb-20">
      {/* Render based on currentView */}
      <Switch>
        <Match when={currentView() === View.Members}>
          <MemberTable />
        </Match>
        <Match when={currentView() === View.Scheduler}>
          <ScheduleWeek classes={classes} refetch={refetch} />
        </Match>
        <Match when={currentView() === View.Stats}>
          <Suspense
            fallback={
              <div class="flex flex-col justify-center items-center gap-5">
                <p>Gathering 6 months of payment data. Please wait...</p>
                <span class="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            <Show when={revenueData()}>
              <MonthlyRevenue revenueData={revenueData()} />
            </Show>
          </Suspense>
          <MembersAcquired />
        </Match>
        <Match when={currentView() === View.Attendance}>
          <Attendance />
        </Match>
      </Switch>

      {/* Bottom Navigation */}
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
    </div>
  );
}
