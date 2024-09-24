import Pocketbase from "pocketbase"
import InstagramLogin from "./InstagramLogin"
import GoogleLogin from "./GoogleLogin"
import FacebookLogin from "./FacebookLogin"

export default function OAuth2Login() {
  const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);
  return (
    <>
      <InstagramLogin pb={pb} />
      <FacebookLogin pb={pb} />
      <GoogleLogin pb={pb} />
      <div class="grid grid-cols-3 items-center">
        <hr class="border-gray-500" />
        <p class="text-center font-bold">OR</p>
        <hr class="border-gray-500" />
      </div>
    </>
  );
}