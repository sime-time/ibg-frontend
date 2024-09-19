import { authorizePB } from "~/lib/PocketBaseAuth";
import { Button } from "~/components/ui/Button";

export default function GoogleLogin() {
  const loginWithGoogle = async () => {
    const pb = await authorizePB();
    const authData = await pb.collection("member").authWithOAuth2({ provider: 'google' });
    console.log("Is valid?: ", pb.authStore.isValid);
    console.log("Token: ", pb.authStore.token);
    console.log("Model: ", pb.authStore.model?.id);
  }

  return (
    <Button onClick={loginWithGoogle}>Login with Google</Button>
  );
}