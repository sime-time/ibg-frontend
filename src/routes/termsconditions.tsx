import { Title } from "@solidjs/meta";
import Footer from "~/components/Footer";

export default function TermsConditions() {
  return (
    <>
      <Title>Terms and Conditions - Indy Boxing and Grappling</Title>
      <main class="flex justify-center w-full">
        <img src={import.meta.env.VITE_TERMS_AND_CONDITIONS_URL} />
      </main>
      <Footer />
    </>
  );
}
