import Pocketbase from "pocketbase";
import { Button } from "~/components/ui/Button";
import { FaBrandsGoogle } from 'solid-icons/fa'
import { useNavigate } from "@solidjs/router";

interface GoogleLoginProps {
  pb: Pocketbase;
}

export default function GoogleLogin(props: GoogleLoginProps) {
  const navigate = useNavigate();
  const loginWithGoogle = async () => {
    try {
      const pb = props.pb;
      const authData = await pb.collection("member").authWithOAuth2({ provider: 'google' });

      // update the user's name according to the google account profile 
      if (authData.meta) {
        const googleName = authData.meta.name;

        await pb.collection("member").update(authData.record.id, {
          name: googleName,
        });

        console.log("User's name: ", googleName);
      } else {
        console.log("User's name does not exist on profile.")
      }

      navigate('/dashboard-member')
    } catch (err) {
      console.error("OAuth2 login failed: ", err);
    }
  }

  return (
    <Button onClick={loginWithGoogle} ><FaBrandsGoogle class="size-5 mr-2" />Continue with Google</Button>
  );
}