import { createSignal } from "solid-js"
import { A } from "@solidjs/router";
import LoginForm from "~/components/forms/LoginForm";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs"

enum LoginType {
  Member = "member",
  Coach = "coach",
}

export default function Login() {
  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 font-thin uppercase">Log In</h1>
      <Tabs defaultValue={LoginType.Member} class="w-[400px]">

        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value={LoginType.Member}>Member</TabsTrigger>
          <TabsTrigger value={LoginType.Coach}>Coach</TabsTrigger>
        </TabsList>

        <TabsContent value={LoginType.Member}>
          <Card>
            <CardHeader>
              <CardTitle>Member Login</CardTitle>
              <CardDescription>Are you new here? <A href="/signup" class="underline text-red-600/90">Sign up now</A></CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm loginType={LoginType.Member} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={LoginType.Coach}>
          <Card>
            <CardHeader>
              <CardTitle>Coach Login</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm loginType={LoginType.Coach} />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </main>
  );
}