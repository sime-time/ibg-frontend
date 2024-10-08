import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-red-600" : "border-transparent hover:border-red-600";
  return (
    <nav class="bg-red-900/80">
      <ul class="container flex items-center p-3 text-gray-200">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li>
        <li class={`border-b-2 ${active("/signup")} mx-1.5 sm:mx-6`}>
          <a href="/signup">Sign Up</a>
        </li>
        <li class={`border-b-2 ${active("/login")} mx-1.5 sm:mx-6`}>
          <a href="/login">Log In</a>
        </li>
        <li class={`border-b-2 ${active("/member")} mx-1.5 sm:mx-6`}>
          <a href="/member">For Member</a>
        </li>
        <li class={`border-b-2 ${active("/coach")} mx-1.5 sm:mx-6`}>
          <a href="/coach">For Coach</a>
        </li>
      </ul>
    </nav>
  );
}
