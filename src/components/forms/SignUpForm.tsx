import { createSignal } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { createMember } from "~/lib/CreateMember";
import FormInput from "~/components/ui/FormInput";
import { Button } from "~/components/ui/Button";
import { AccountType } from "~/lib/AccountType";
import { loginAuth } from "~/lib/LoginAuth";


export default function SignUpForm() {
  const [fullName, setFullName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [passwordConfirm, setPasswordConfirm] = createSignal("");
  const [disableSubmit, setDisableSubmit] = createSignal<boolean>(false);
  const [error, setError] = createSignal("");

  const onSignUpPage: boolean = (useLocation().pathname === "/signup");
  const navigate = useNavigate();

  const submitMember = async (e: Event) => {
    e.preventDefault();
    setDisableSubmit(true);
    setError(""); // clear any previous errors 

    const formData = {
      fullName: fullName(),
      email: email(),
      password: password(),
      passwordConfirm: passwordConfirm(),
    }

    try {
      const signUpSuccess = await createMember(formData, setError);

      // if on sign up page, auto log-in
      // otherwise, refresh the page
      if (signUpSuccess) {
        if (onSignUpPage) {
          const loginCreds = {
            email: formData.email,
            password: formData.password
          }
          const loginSuccess = await loginAuth(AccountType.Member, loginCreds, setError);
          if (loginSuccess) {
            navigate("/member");
          }
        } else {
          location.reload();
        }
      }
    } catch (err) {
      console.error("Error registering member: ", err);
      setError("Error registering member.")
    }
    setDisableSubmit(false);
  }

  return (
    <form onSubmit={submitMember} class="flex flex-col gap-4">
      <FormInput type="text" name="fullName" label="Full Name" required={true} value={fullName()} setValue={setFullName} />
      <FormInput type="email" name="email" label="Email" required={true} value={email()} setValue={setEmail} />
      <FormInput type="password" name="password" label="Password" required={true} value={password()} setValue={setPassword} />
      <FormInput type="password" name="passwordConfirm" label="Confirm Password" required={true} value={passwordConfirm()} setValue={setPasswordConfirm} />
      {error() && <p class="text-red-500">{error()}</p>}
      <Button type="submit" disabled={disableSubmit()} class={`text-white w-full ${onSignUpPage ? "bg-red-600/90 hover:bg-red-700" : "bg-blue-600/90 hover:bg-blue-700"}`}>Submit</Button>
    </form >
  );
}