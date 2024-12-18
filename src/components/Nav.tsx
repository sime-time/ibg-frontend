import { useLocation } from "@solidjs/router";
import { Show } from "solid-js";
import LogoutButton from "./ui/LogoutButton";

function NavMenu() {
  return (
    <>
      <li><a href="/signup">Sign Up</a></li>
      <li><a href="/login">Log In</a></li>
      <li><a href="/member">Member</a></li>
      <li><a href="/coach">Coach</a></li>
    </>
  );
}

export default function Nav() {
  const location = useLocation();

  return (
    <nav class="navbar">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabIndex={0} role="button" class="btn btn-ghost lg:hidden">
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
        <a href="/" class="btn btn-ghost text-xl">IBG</a>
      </div>

      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <NavMenu />
        </ul>
      </div>

      <div class="navbar-end flex gap-3">
        <Show
          when={
            location.pathname === "/coach" ||
            location.pathname === "/signup-kiosk" ||
            location.pathname === "/qr-login"
          }
        >
          <LogoutButton />
        </Show>
      </div>

    </nav>
  );
}
