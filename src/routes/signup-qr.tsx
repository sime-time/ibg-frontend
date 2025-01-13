import { Title } from "@solidjs/meta"
import { FaSolidArrowLeft } from "solid-icons/fa"

export default function SignUpQR() {
  return <>
    <Title>Sign Up - QR Code</Title>
    <main class="flex flex-col items-center justify-center mt-4 gap-8">
      <h1 class="text-2xl font-semibold text-center">Scan the QR code with your phone's camera app to continue:</h1>
      <div class="size-80">
        <img src="/images/qr-code-signup.png" alt="QR code redirect to login page" />
      </div>
      <a href="/coach" class="btn btn-secondary btn-lg"><FaSolidArrowLeft /> Return to dashboard</a>
    </main>
  </>
}
