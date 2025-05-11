import { usePocket } from "~/context/PocketbaseContext";
import { Switch, Match, ParentProps } from "solid-js";
import LogoutButton from "./ui/LogoutButton";
import { useLocation } from "@solidjs/router";

export function NavMenu(props: { onNavClick?: () => void }) {
  return (
    <>
      <li>
        <a href="/" onClick={props.onNavClick}>
          Home
        </a>
      </li>
      <li>
        <a href="/our-team" onClick={props.onNavClick}>
          Our Team
        </a>
      </li>
      <li>
        <a href="/pricingschedule" onClick={props.onNavClick}>
          Schedule
        </a>
      </li>
      <li>
        <a href="/facility" onClick={props.onNavClick}>
          Our Gym
        </a>
      </li>
      <li>
        <a href="/contact-us" onClick={props.onNavClick}>
          Contact Us
        </a>
      </li>
    </>
  );
}

function NavMenuEnd(props: { onNavClick?: () => void }) {
  const { loggedIn, userIsAdmin, userIsMember } = usePocket();
  const location = useLocation();
  return (
    <Switch>
      <Match
        when={
          location.pathname === "/coach" || location.pathname === "/qr-login"
        }
      >
        <LogoutButton />
      </Match>
      <Match
        when={!loggedIn()}
      >
        <a href="/signup" class="btn btn-primary btn-sm lg:btn-md">
          Sign Up
        </a>
        <a href="/login" class="btn btn-outline btn-sm lg:btn-md">
          Log In
        </a>
      </Match>
      <Match when={userIsMember() && location.pathname != "/member"}>
        <a href="/member" class="btn btn-secondary">
          Member Page
        </a>
      </Match>
      <Match when={userIsAdmin() && location.pathname != "/coach"}>
        <a href="/coach" class="btn btn-secondary">
          Coach Dashboard
        </a>
      </Match>
    </Switch>
  );
}

export default function Nav(props: ParentProps) {
  const closeDrawer = () => {
    const drawer = document.getElementById("nav-drawer") as HTMLInputElement;
    if (drawer) {
      drawer.checked = false;
    }
  };

  return (
    <div class="drawer">
      <input
        id="nav-drawer"
        type="checkbox"
        class="drawer-toggle"
        aria-label="toggle navigation menu"
      />
      <div class="drawer-content flex flex-col">
        {/* Navbar */}
        <div class="navbar w-full">
          <div class="flex-none lg:hidden">
            <label
              for="nav-drawer"
              aria-label="open sidebar"
              class="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-6 w-6 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <a href="/" class="flex-1">
            <img
              src="/logo.svg"
              alt="IBG Logo"
              width="100%"
              height="auto"
              class="max-w-20"
            />
            <img
              src="/images/indyboxing.png"
              alt="Indy Boxing Logo"
              width="100%"
              height="auto"
              class="max-w-20"
            />
          </a>
          <nav class="hidden flex-none lg:block">
            <ul class="menu menu-horizontal">
              {/* Navbar menu content here */}
              <NavMenu />
            </ul>
          </nav>

          <div class="flex flex-1 justify-end gap-3">
            <NavMenuEnd />
          </div>
        </div>
        {/* Page content here */}
        {props.children}
      </div>
      <div class="drawer-side">
        <label
          for="nav-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <ul class="menu bg-base-100 min-h-full w-80 p-4 flex flex-col justify-center gap-3 font-semibold text-3xl">
          {/* Sidebar content here */}
          <NavMenu onNavClick={closeDrawer} />
        </ul>
      </div>
    </div>
  );
}
