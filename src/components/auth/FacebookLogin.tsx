import Pocketbase from "pocketbase";
import { Button } from "~/components/ui/Button";
import { useNavigate } from "@solidjs/router";
import { FaBrandsSquareFacebook } from 'solid-icons/fa'

interface FacebookLoginProps {
  pb: Pocketbase;
}

export default function FacebookLogin(props: FacebookLoginProps) {
  const navigate = useNavigate();
  const loginWithOAuth2 = async () => {
    try {
      const pb = props.pb;
      const authData = await pb.collection("member").authWithOAuth2({ provider: 'facebook' });

      // update the user's name according to the public account profile 
      if (authData.meta) {
        const profileName = authData.meta.name;

        await pb.collection("member").update(authData.record.id, {
          name: profileName,
        });

        console.log("User's name: ", profileName);
      } else {
        console.log("User's name does not exist on profile.")
      }

      navigate('/dashboard-member')
    } catch (err) {
      console.error("OAuth2 login failed: ", err);
    }
  }

  return (
    <Button onClick={loginWithOAuth2} ><FaBrandsSquareFacebook class="size-5 mr-2" />Login with Facebook</Button>
  );
}