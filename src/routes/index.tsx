import { Title } from "@solidjs/meta";
import { usePocket } from "~/context/PocketbaseContext";

export default function Home() {
  const { logout } = usePocket();
  return <>
    <Title>Indy Boxing and Grappling</Title>
    <main class="flex justify-center items-center ">
      <button onClick={logout} class="btn btn-accent btn-outline">Log Out</button>
    </main>
  </>
}
