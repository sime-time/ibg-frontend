import KioskCreateMember from "~/components/KioskCreateMember";
import { Title } from "@solidjs/meta";

export default function SignUpKiosk() {
  return <>
    <Title>Sign Up on Kiosk</Title>
    <main class="flex items-start justify-center min-h-full mt-4">
      <div class="card bg-base-100 shadow-xl w-fit md:w-96">
        <div class="card-body">
          <h1 class="card-title text-2xl font-bold mb-3">New Member</h1>
          <KioskCreateMember />
        </div>
      </div>
    </main>
  </>
}