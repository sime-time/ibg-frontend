import {
  FaRegularCalendar,
  FaSolidCalendar,
  FaSolidListCheck,
} from "solid-icons/fa";
import { RiUserFacesGroupLine, RiUserFacesGroupFill } from "solid-icons/ri";
import { BsBarChart, BsBarChartFill } from "solid-icons/bs";
import { useLocation, A } from "@solidjs/router";
import { JSX, For } from "solid-js";

type BottomNavItem = {
  label: string;
  href: string;
  activeIcon: JSX.Element;
  deactiveIcon: JSX.Element;
}

export default function BottomNav() {
  const location = useLocation();
  const bottomNavItems: BottomNavItem[] = [
    {
      label: "Stats",
      href: "/coach/stats",
      activeIcon: (<BsBarChartFill class="size-6" />),
      deactiveIcon: (<BsBarChart class="size-6" />),
    },
    {
      label: "Members",
      href: "/coach/member-table",
      activeIcon: (<RiUserFacesGroupFill class="size-6" />),
      deactiveIcon: (<RiUserFacesGroupLine class="size-6" />),
    },
    {
      label: "Classes",
      href: "/coach/classes",
      activeIcon: (<FaSolidCalendar class="size-6" />),
      deactiveIcon: (<FaRegularCalendar class="size-6" />),
    },
    {
      label: "Attendance",
      href: "/coach/attendance",
      activeIcon: (<FaSolidListCheck class="size-5" />),
      deactiveIcon: (<FaSolidListCheck class="size-5" />),
    },
  ]

  return (
    <nav class="btm-nav btm-nav-lg" >
      <For each={bottomNavItems}>
        {(navItem) => (
          <A
            href={navItem.href}
            class={location.pathname === navItem.href ? "active" : "opacity-50"}
          >
            {location.pathname === navItem.href ? (
              navItem.activeIcon
            ) : (
              navItem.deactiveIcon
            )}
            <label class="text-xs opacity-70">{navItem.label}</label>
          </A>
        )}
      </For>
    </nav>
  );
}
