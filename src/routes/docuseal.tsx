import { clientOnly } from "@solidjs/start";
import DocuSealForm from "~/components/forms/DocuSealForm";


export default function DocuSeal() {
  return (
    <main class="w-full">
      <DocuSealForm memberEmail="alex@gmail.com" />
    </main>
  );
}