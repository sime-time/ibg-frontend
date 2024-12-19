import { Title } from "@solidjs/meta";

export default function Home() {
  return <>
    <Title>Indy Boxing and Grappling</Title>
    <main class="flex justify-center items-center gap-5">
      <a href="/signup" class="btn btn-accent">Sign Up</a>
      <a href="/login" class="btn btn-accent btn-outline">Log In</a>
    </main>
  </>
}
