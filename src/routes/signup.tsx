import OAuth2Login from "~/components/auth/OAuth2Login";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/Card"
import SignUpForm from "~/components/forms/SignUpForm";

export default function SignUp() {
  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Sign-Up</h1>
      <Card class="w-full md:w-1/4">
        <CardHeader class="gap-3">
          <CardTitle>Create your account</CardTitle>
          <OAuth2Login />
        </CardHeader>
        <CardContent >
          <SignUpForm />
        </CardContent>
      </Card>
    </main>
  );
}