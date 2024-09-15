import { createSignal } from "solid-js";
import { useLocation, useNavigate, A } from "@solidjs/router";
import { createMember } from "~/lib/CreateMember";
import FormInput from "~/components/ui/FormInput";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/Card"

export default function FormCreateMember() {
  const [fullName, setFullName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [emergencyPhone, setEmergencyPhone] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [passwordConfirm, setPasswordConfirm] = createSignal("");
  const [error, setError] = createSignal("");

  const onSignUpPage: boolean = (useLocation().pathname === "/signup");
  const navigate = useNavigate();

  const submitMember = async (e: Event) => {
    e.preventDefault();
    setError(""); // clear any previous errors 

    const formData = {
      fullName: fullName(),
      phone: phone(),
      emergencyPhone: emergencyPhone(),
      email: email(),
      password: password(),
      passwordConfirm: passwordConfirm(),
    }

    try {
      const successful = createMember(formData, setError);

      // if on register page, redirect to login
      // otherwise, refresh the page
      if (await successful) {
        if (onSignUpPage) {
          navigate("/login");
        } else {
          location.reload();
        }
      }
    } catch (err) {
      console.error("Error registering member: ", err);
    }
  }

  return (
    <form onSubmit={submitMember} class="w-full flex justify-center">
      <Card class="bg-white text-black w-full md:w-1/3">
        {onSignUpPage &&
          <CardHeader>
            <CardTitle>Already a Member?</CardTitle>
            <CardDescription><A href="/login" class="underline text-red-700">Go to login</A></CardDescription>
          </CardHeader>
        }
        <CardContent class="flex flex-col gap-4">
          <FormInput type="text" name="fullName" label="Full Name" required={true} value={fullName()} setValue={setFullName} />
          <FormInput type="email" name="email" label="Email" required={true} value={email()} setValue={setEmail} />
          <FormInput type="tel" name="phone" label="Phone" placeholder="317-123-4567" required={true} value={phone()} setValue={setPhone} />
          <FormInput type="tel" name="emergencyPhone" label="Emergency Phone" placeholder="317-987-6543" required={true} value={emergencyPhone()} setValue={setEmergencyPhone} />
          <FormInput type="password" name="password" label="Password" required={true} value={password()} setValue={setPassword} />
          <FormInput type="password" name="passwordConfirm" label="Confirm Password" required={true} value={passwordConfirm()} setValue={setPasswordConfirm} />
        </CardContent>
        <CardFooter class="flex flex-col gap-4 items-start">
          {error() && <p class="text-red-500">{error()}</p>}
          <Button type="submit" class="bg-red-600/90 hover:bg-red-700 text-white font-bold w-full">Submit</Button>
        </CardFooter>
      </Card>

    </form>
  );
}
