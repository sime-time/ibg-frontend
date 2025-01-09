import { useLocation } from "@solidjs/router";
import { usePocket } from "~/context/PocketbaseContext";
import { Show, Switch, Match } from "solid-js";
import LogoutButton from "./ui/LogoutButton";

export function NavMenu() {
  return (
    <>
      <li><a href="/">Home</a></li>
      <li><a href="/our-team">Our Team</a></li>
      <li><a href="/pricingschedule">Schedule</a></li>
      <li><a href="/contact-us">Contact Us</a></li>
    </>
  );
}

export default function Nav() {
  const location = useLocation();
  const { loggedIn, userIsAdmin, userIsMember } = usePocket();

  return (
    <nav class="navbar">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabIndex={0} role="button" class="btn btn-ghost lg:hidden">
            {/* Menu icon */}
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
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <NavMenu />
          </ul>
        </div>
        <a href="/">
          <img src="/logo.svg" alt="IBG Logo" width="100%" height="auto" class="max-w-20" />
        </a>
      </div>

      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <NavMenu />
        </ul>
      </div>

      <div class="navbar-end flex gap-3">
        <Switch>
          <Match when={
            location.pathname === "/coach" ||
            location.pathname === "/qr-login"
          }>
            <LogoutButton />
          </Match>
          <Match when={
            !loggedIn() &&
            location.pathname != "/coach" &&
            location.pathname != "/member"
          }>
            <a href="/signup" class="btn btn-primary">Sign Up</a>
            <a href="/login" class="btn btn-outline">Log In</a>
          </Match>
          <Match when={userIsMember() && location.pathname != "/member"} >
            <a href="/member" class="btn btn-secondary">Member Dashboard</a>
          </Match>
          <Match when={userIsAdmin() && location.pathname != "/coach"}>
            <a href="/coach" class="btn btn-secondary">Coach Dashboard</a>
          </Match>
        </Switch>
      </div>

    </nav>
  );
}
