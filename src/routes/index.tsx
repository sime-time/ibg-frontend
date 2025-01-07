import { Title } from "@solidjs/meta";
import Hero from "~/components/Hero";
import About from "~/components/About";
import Programs from "~/components/Programs";
import Footer from "~/components/Footer";
import FAQ from "~/components/FAQ";
import Contact from "~/components/Contact";

export default function Home() {
  return (
    <>
      <Title>Indy Boxing and Grappling</Title>
      <main>
        <Hero />
        <About />
        <Programs />
        <FAQ />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
