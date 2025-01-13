import { Title } from "@solidjs/meta";
import EmailSignUp from "~/components/auth/EmailSignUp";

export default function SignUp() {

  return <>
    <Title>Sign Up - Indy Boxing and Grappling</Title>
    <main class="flex items-start justify-center mt-4">
      <EmailSignUp />
    </main>
  </>
}
