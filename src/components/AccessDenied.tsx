export default function AccessDenied() {
  return (
    <div class="flex flex-col gap-4 mt-24 text-center">
      <h2 class="text-2xl font-bold">You do not have access to this page.</h2>
      <p class="text-lg">Already have an account? <a href="/login" class="underline text-error">Log in here</a></p>
    </div>
  );
}