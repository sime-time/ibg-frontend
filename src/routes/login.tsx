import { Button } from "~/components/ui/Button";
export default function SignUp() {

  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 font-thin uppercase">Log In</h1>
      <div class="flex gap-6">
        <Button class="bg-red-600/90 hover:bg-red-700 text-white">I'm a member</Button>
        <Button variant="secondary">I'm a coach</Button>
      </div>
    </main>
  );
}