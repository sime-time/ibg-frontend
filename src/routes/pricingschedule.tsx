import { Title } from "@solidjs/meta"
import Footer from "~/components/Footer";
import FullSchedule from "~/components/schedule/readonly/FullSchedule";

export default function Schedule() {
  return (<>
    <Title>Schedule - Indy Boxing and Grappling</Title>
    <main>
      <FullSchedule />
    </main>
    <Footer />
  </>);
}
