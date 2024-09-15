import { createSignal, Show } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import FormInput from "~/components/ui/FormInput";
import { loginAuth } from "~/lib/LoginAuth";
import { Button } from "~/components/ui/Button";

interface LoginFormProps {
  loginType: string;
}

export default function LoginForm(props: LoginFormProps) {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const login = async (e: Event) => {
    e.preventDefault();
    setError(""); // clear any previous errors 

    const formData = {
      email: email(),
      password: password(),
    }

    try {
      const successful = loginAuth(props.loginType, formData, setError);
      if (await successful) {
        if (props.loginType === "member") {
          navigate("/dashboard-member");
        } else if (props.loginType === "coach") {
          navigate("/dashboard-coach")
        }
      }
    } catch (err) {
      console.error("Error logging in: ", err);
    }
  }

  return (
    <form onSubmit={login} class="bg-white text-black rounded-lg p-6 flex flex-col gap-4 w-5/6 md:w-1/4">
      <Show when={props.loginType === "member"} fallback={<h2 class="font-bold text-lg">Coach Login</h2>}>
        <div>
          <h2 class="font-bold text-lg">Member Login</h2>
          <p class="text-sm">Are you new here? <A href="/signup" class="underline text-red-700">Sign up now</A></p>
        </div>
      </Show>
      <FormInput type="email" name="email" label="Email" required={false} value={email()} setValue={setEmail} />
      <FormInput type="password" name="password" label="Password" required={false} value={password()} setValue={setPassword} />
      {error() && <p class="text-red-500">{error()}</p>}
      <Button type="submit" class="bg-red-600/90 hover:bg-red-700 text-white">Login</Button>
    </form>
  );
}