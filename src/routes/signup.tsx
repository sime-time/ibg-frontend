import FormCreateMember from "~/components/forms/CreateMemberForm";
import OAuth2Login from "~/components/auth/OAuth2Login";
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
        <CardHeader class="gap-3">
          <CardTitle>Create your account</CardTitle>
          <OAuth2Login />
        </CardHeader>
        <CardContent >
          <FormCreateMember />
        </CardContent>
      </Card>
    </main>
  );
}