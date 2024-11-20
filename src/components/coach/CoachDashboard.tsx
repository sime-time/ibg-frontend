import { createSignal, Match, Switch } from "solid-js";
import { MemberTable } from "./CoachMemberTable";
import { FaRegularCalendar, FaSolidCalendar } from 'solid-icons/fa'
import { RiUserFacesGroupLine, RiUserFacesGroupFill } from 'solid-icons/ri'
import { BsBarChart, BsBarChartFill } from "solid-icons/bs";
import ScheduleWeek from "../schedule/ScheduleWeek";

enum View {
  Members = "members",
  Stats = "stats",
  Scheduler = "scheduler"
}

export default function CoachDashboard() {
  const [currentView, setCurrentView] = createSignal(View.Members);

  return (
    <div class="w-full flex justify-center mb-20">

      {/* Render based on currentView */}
      <Switch>
        <Match when={currentView() === View.Members}>
          <MemberTable />
        </Match>
        <Match when={currentView() === View.Scheduler}>
          <ScheduleWeek />
        </Match>
        <Match when={currentView() === View.Stats}>
          <div>Stats</div>
        </Match>
      </Switch>

      {/* Bottom Navigation */}
      <div class="btm-nav">
        <button
          onClick={() => setCurrentView(View.Stats)}
          class={currentView() === View.Stats ? "active" : ""}
        >
          {currentView() === View.Stats ? <BsBarChartFill class="size-6" /> : <BsBarChart class="size-6" />}
        </button>
        <button
          onClick={() => setCurrentView(View.Members)}
          class={currentView() === View.Members ? "active" : ""}
        >
          {currentView() === View.Members ? <RiUserFacesGroupFill class="size-6" /> : <RiUserFacesGroupLine class="size-6" />}
        </button>
        <button
          onClick={() => setCurrentView(View.Scheduler)}
          class={currentView() === View.Scheduler ? "active" : ""}
        >
          {currentView() === View.Scheduler ? <FaSolidCalendar class="size-6" /> : <FaRegularCalendar class="size-6" />}
        </button>
      </div>

    </div>
  );
}