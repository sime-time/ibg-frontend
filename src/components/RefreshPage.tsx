import { Button } from "./ui/Button";

export default function RefreshPage() {
  return (
    <div class="text-white flex flex-col items-center text-center">
      <p>Click here to refresh the page and access your dashboard.</p>
      <Button size="lg" onClick={() => location.reload()} class="rounded-md bg-red-600/90 hover:bg-red-700 text-white py-3 px-5">Access Dashboard</Button>
    </div>
  );
}