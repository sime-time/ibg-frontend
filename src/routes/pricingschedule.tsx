import { Title } from "@solidjs/meta"
import Footer from "~/components/Footer";
import Plans from "~/components/Plans";
import FullSchedule from "~/components/schedule/readonly/FullSchedule";

export default function Schedule() {
  return (<>
    <Title>Schedule - Indy Boxing and Grappling</Title>
    <main>
      <FullSchedule />
      <Plans />
    </main>
    <div class="divider divider-neutral"></div>
    <Footer />
  </>);
}
