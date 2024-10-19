import { useNavigate } from "@solidjs/router";
import LoginForm from "~/components/forms/LoginForm";
import OAuth2Login from "~/components/auth/OAuth2Login";
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
import Pocketbase from "pocketbase";

const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

export default function Login() {
  // if user is already logged in, route to their dashboard 
  const navigate = useNavigate();
  if (pb.authStore.isValid) {
    if (pb.authStore.isAdmin) {
      navigate("/coach")
    } else {
      navigate("/member");
    }
  }

  return (
    <main class="m-auto p-4 flex flex-col gap-6 items-center">
      <h1 class="text-6xl text-red-600/90 text-center font-thin uppercase">Log In</h1>
      <Tabs defaultValue={AccountType.Member} class="w-full md:w-1/4">

        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value={AccountType.Member}>I'm a Member</TabsTrigger>
          <TabsTrigger value={AccountType.Coach}>I'm a Coach</TabsTrigger>
        </TabsList>

        <TabsContent value={AccountType.Member}>
          <Card>
            <CardHeader class="gap-3">
              <CardTitle>Member Login</CardTitle>
              <OAuth2Login />
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