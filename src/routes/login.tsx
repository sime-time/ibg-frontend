import { createSignal, Show } from "solid-js"
import { Button } from "~/components/ui/Button";
import LoginForm from "~/components/forms/LoginForm";

export default function Login() {
  const [loginType, setLoginType] = createSignal("");

  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 font-thin uppercase">Log In</h1>
      <Show
        when={loginType() !== ""}
        fallback={
          <div class="flex gap-6">
            <Button onClick={() => setLoginType("member")} class="bg-red-600/90 hover:bg-red-700 text-white">I'm a member</Button>
            <Button onClick={() => setLoginType("coach")} variant="secondary">I'm a coach</Button>
          </div>
        }
      >
        <LoginForm loginType={loginType()} />
      </Show>
    </main>
  );
}