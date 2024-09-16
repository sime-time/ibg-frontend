import { A } from "@solidjs/router";
import LoginForm from "~/components/forms/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs"
import { AccountType } from "~/lib/AccountType";

export default function Login() {
  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 font-thin uppercase">Log In</h1>
      <Tabs defaultValue={AccountType.Member} class="w-[400px]">

        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value={AccountType.Member}>I'm a Member</TabsTrigger>
          <TabsTrigger value={AccountType.Coach}>I'm a Coach</TabsTrigger>
        </TabsList>

        <TabsContent value={AccountType.Member}>
          <Card>
            <CardHeader>
              <CardTitle>Member Login</CardTitle>
              <CardDescription>Are you new here? <A href="/signup" class="underline text-red-600/90">Sign up now</A></CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm accountType={AccountType.Member} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={AccountType.Coach}>
          <Card>
            <CardHeader>
              <CardTitle>Coach Login</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm accountType={AccountType.Coach} />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </main>
  );
}