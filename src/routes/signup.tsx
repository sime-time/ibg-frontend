import { A } from "@solidjs/router";
import FormCreateMember from "~/components/forms/FormCreateMember";
import GoogleLogin from "~/components/GoogleLogin";
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
      <Card class="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Already a Member?</CardTitle>
          <CardDescription><A href="/login" class="underline text-red-600/90">Go to login</A></CardDescription>
          <GoogleLogin />
        </CardHeader>
        <CardContent >
          <FormCreateMember />
        </CardContent>
      </Card>
    </main>
  );
}