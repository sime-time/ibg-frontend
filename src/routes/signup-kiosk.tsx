import KioskCreateMember from "~/components/KioskCreateMember";
import { Title } from "@solidjs/meta";

export default function SignUpKiosk() {
  return <>
    <Title>Sign Up on Kiosk</Title>
    <main class="flex items-start justify-center min-h-full mt-4">
      <KioskCreateMember />
    </main>
  </>
}