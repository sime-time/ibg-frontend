import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import FormInput from "~/components/ui/FormInput";
import { loginAuth } from "~/lib/LoginAuth";


export default function Login() {
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
      const successful = loginAuth("member", formData, setError);
      if (await successful) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error logging in member: ", err);
    }
  }

  return (
    <form onSubmit={login} class="bg-white rounded-lg p-8 flex flex-col gap-4 w-5/6 md:w-1/4">
      <FormInput type="email" name="email" label="Email" required={true} value={email()} setValue={setEmail} />
      <FormInput type="password" name="password" label="Password" required={true} value={password()} setValue={setPassword} />

      <p>Are you new here? <A href="/register" class="underline">Sign up now</A></p>

      {error() && <p class="text-red-500">{error()}</p>}

      <button type="submit" class="bg-red-600/90 hover:bg-red-700 text-white rounded-md py-3 mt-2 font-bold">Login</button>
    </form>
  );
}