import { Title } from "@solidjs/meta"
import Footer from "~/components/Footer";
import MemberSchedule from "~/components/member/MemberSchedule";

export default function Schedule() {
  return (<>
    <Title>Schedule - Indy Boxing and Grappling</Title>
    <main>
      <section>
        <MemberSchedule />
      </section>
    </main>
    <Footer />
  </>);
}
