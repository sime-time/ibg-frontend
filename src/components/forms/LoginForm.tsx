import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import FormInput from "~/components/ui/FormInput";
import { loginAuth } from "~/lib/LoginAuth";
import { Button } from "~/components/ui/Button";
import { AccountType } from "~/lib/AccountType";

interface LoginFormProps {
  accountType: string;
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
      const successful = loginAuth(props.accountType, formData, setError);
      if (await successful) {
        if (props.accountType === AccountType.Member) {
          navigate("/dashboard-member");
        } else if (props.accountType === AccountType.Coach) {
          navigate("/dashboard-coach")
        }
      }
    } catch (err) {
      console.error("Error logging in: ", err);
      setError("Server Authentication Error. Try again later.");
    }
  }

  return (
    <form onSubmit={login} class="flex flex-col gap-4">
      <FormInput type="email" name="email" label="Email" required={false} value={email()} setValue={setEmail} />
      <FormInput type="password" name="password" label="Password" required={false} value={password()} setValue={setPassword} />
      {error() && <p class="text-red-500">{error()}</p>}
      <Button type="submit" class="bg-red-600/90 hover:bg-red-700 text-white">Login</Button>
    </form>
  );
}