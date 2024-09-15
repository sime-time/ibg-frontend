import FormCreateMember from "~/components/forms/FormCreateMember";

export default function SignUp() {
  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Member Sign-Up</h1>
      <FormCreateMember />
    </main>
  );
}