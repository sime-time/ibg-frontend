import { Title } from "@solidjs/meta";
import Hero from "~/components/Hero";
import About from "~/components/About";
import Plans from "~/components/Plans";
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
        <Plans />
        <FAQ />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
