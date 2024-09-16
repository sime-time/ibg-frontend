import { A } from "@solidjs/router";
import FormCreateMember from "~/components/forms/FormCreateMember";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/Card"

export default function SignUp() {
  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Member Sign-Up</h1>
      <Card class="bg-white text-black w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Already a Member?</CardTitle>
          <CardDescription><A href="/login" class="underline text-red-700">Go to login</A></CardDescription>
        </CardHeader>
        <CardContent >
          <FormCreateMember />
        </CardContent>
      </Card>
    </main>
  );
}