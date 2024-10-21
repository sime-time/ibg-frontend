import { createSignal, onMount } from "solid-js";
import FormInput from "../ui/FormInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/Card"
import { TextField, TextFieldInput, TextFieldLabel } from "../ui/TextField"
import { Button } from "../ui/Button";
import { addContactInfo } from "~/lib/AddContactInfo";
import { useNavigate } from "@solidjs/router";

interface OnboardProps {
  memberName: string;
}

export default function OnboardForm(props: OnboardProps) {
  const [phone, setPhone] = createSignal("");
  const [emergencyName, setEmergencyName] = createSignal("");
  const [emergencyPhone, setEmergencyPhone] = createSignal("");
  const [birthDate, setBirthDate] = createSignal<Date>(new Date());
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    const formData = {
      phone: phone(),
      emergencyName: emergencyName(),
      emergencyPhone: emergencyPhone(),
      birthDate: birthDate(),
    }

    try {
      const successful = addContactInfo(formData, setError);
      if (await successful) {
        navigate("/checkout")
      }
    } catch (err) {
      console.error("Error with Server: ", err);
      setError("Error with server.")
    }

  }

  return (
    <form onSubmit={handleSubmit} class="m-auto p-4 flex flex-col gap-6 items-center text-start">
      <Card class="w-full md:w-1/3">
        <CardHeader class="gap-3">
          <CardTitle class="text-2xl">Member Contact Information</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3">
          <TextField class="grid w-full max-w-sm items-center gap-1.5">
            <TextFieldLabel for="member-name">Name</TextFieldLabel>
            <TextFieldInput type="text" readOnly={true} disabled={true} id="member-name" value={props.memberName} />
          </TextField>
          <FormInput type="tel" name="phone" label="Phone Number" value={phone()} setValue={setPhone} />
          <FormInput type="text" name="emergency-name" label="Emergency Contact Name" value={emergencyName()} setValue={setEmergencyName} />
          <FormInput type="text" name="emergency-phone" label="Emergency Contact Phone" value={emergencyPhone()} setValue={setEmergencyPhone} />
          <FormInput type="date" name="birth-date" label="Date of Birth" value={birthDate()} setValue={setBirthDate} />

          {error() && <p class="text-red-500">{error()}</p>}

          <Button type="submit" class="bg-red-600/90 hover:bg-red-700 text-white text-lg font-semibold py-6 mt-2">Continue</Button>
        </CardContent>
      </Card>
    </form>
  );
}