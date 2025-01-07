import { Title } from "@solidjs/meta"
import Contact from "~/components/Contact";
import Footer from "~/components/Footer";

export default function ContactUs() {
  return (<>
    <Title>Contact Us - Indy Boxing and Grappling</Title>
    <main>
      <Contact />
      <Footer />
    </main>
  </>);
}
