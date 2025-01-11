import { Title } from "@solidjs/meta";
import Footer from "~/components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Title>Privacy Policy - Indy Boxing and Grappling</Title>
      <main class="flex justify-center w-full">
        <img src={import.meta.env.VITE_PRIVACY_POLICY_URL} />
      </main>
      <Footer />
    </>
  );
}
