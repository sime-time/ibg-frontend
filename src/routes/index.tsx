import { Title } from "@solidjs/meta";
import { usePocket } from "~/context/PocketbaseContext";

export default function Home() {
  const { logout } = usePocket();
  return <>
    <Title>Indy Boxing and Grappling</Title>
    <main class="flex justify-center items-center gap-5">
      <a href="/signup" class="btn btn-accent">Sign Up</a>
      <a href="/login" class="btn btn-accent btn-outline">Log In</a>
    </main>
  </>
}
