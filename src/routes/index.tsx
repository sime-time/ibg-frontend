import { Title } from "@solidjs/meta";
import MemberPlans from "~/components/member/MemberPlans";

export default function Home() {
  return <>
    <Title>Indy Boxing and Grappling</Title>
    <main class="flex justify-center items-center gap-5">
      <MemberPlans />
    </main>
  </>
}
