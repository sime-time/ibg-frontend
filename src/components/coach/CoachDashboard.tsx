import { createSignal, Match, Switch, createResource } from "solid-js";
import { MemberTable } from "./CoachMemberTable";
import { FaRegularCalendar, FaSolidCalendar, FaSolidListCheck } from 'solid-icons/fa'
import { RiUserFacesGroupLine, RiUserFacesGroupFill } from 'solid-icons/ri'
import { BsBarChart, BsBarChartFill } from "solid-icons/bs";
import { usePocket } from "~/context/PocketbaseContext";
import ScheduleWeek from "../schedule/ScheduleWeek";
import Attendance from "../attendance/Attendance";
import Stats from "../stats/Stats";

enum View {
  Members = "members",
  Stats = "stats",
  Scheduler = "scheduler",
  Attendance = "attendance"
}

export default function CoachDashboard() {
  const { getClasses } = usePocket();
  const [classes, { mutate, refetch }] = createResource(async () => {
    return getClasses();
  });

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
          <Stats />
        </Match>
        <Match when={currentView() === View.Attendance}>
          <Attendance />
        </Match>
      </Switch>

      {/* Bottom Navigation */}
      <div class="btm-nav">
        <button
          onClick={() => setCurrentView(View.Stats)}
          class={currentView() === View.Stats ? "active" : "opacity-50"}
        >
          {currentView() === View.Stats ? <BsBarChartFill class="size-6" /> : <BsBarChart class="size-6" />}
          <label class="text-xs opacity-70">Dashboard</label>
        </button>
        <button
          onClick={() => setCurrentView(View.Members)}
          class={currentView() === View.Members ? "active" : "opacity-50"}
        >
          {currentView() === View.Members ? <RiUserFacesGroupFill class="size-6" /> : <RiUserFacesGroupLine class="size-6" />}
          <label class="text-xs opacity-70">Members</label>
        </button>
        <button
          onClick={() => setCurrentView(View.Scheduler)}
          class={currentView() === View.Scheduler ? "active" : "opacity-50"}
        >
          {currentView() === View.Scheduler ? <FaSolidCalendar class="size-6" /> : <FaRegularCalendar class="size-6" />}
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
