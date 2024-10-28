import { Title } from "@solidjs/meta";

export default function NotFound() {
  return <>
    <Title>Page Not Found</Title>
    <main>
      <div class="flex flex-col gap-4 mt-24 text-center">
        <h2 class="text-2xl font-bold">Page Not Found</h2>
        <a href="/" class="text-lg underline text-error">Return to Home Page</a>
      </div>
    </main>
  </>
}
