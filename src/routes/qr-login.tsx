import { Title } from "@solidjs/meta"

export default function QRLogin() {
  return <>
    <Title>Login QR Code</Title>
    <main class="flex flex-col items-center justify-center min-h-full mt-4 gap-6">
      <h1 class="text-lg">Scan the QR Code with your phone's camera app and log in to continue payment:</h1>
      <img src="/images/qr-code-login.png" alt="qr code for login" width={500} height={500} />
    </main>
  </>
}