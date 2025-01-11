import { onMount } from 'solid-js';

interface FacebookSDKProps {
  appId: string;
  apiVersion?: string;
  onSDKLoaded?: () => void;
}

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function FacebookSDK(props: FacebookSDKProps) {
  const initFacebookSDK = () => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: props.appId,
        cookie: true,
        xfbml: true,
        version: props.apiVersion || 'v18.0'
      });

      window.FB.AppEvents.logPageView();

      if (props.onSDKLoaded) {
        props.onSDKLoaded();
      }
    };

    // Load the SDK asynchronously
    const loadSDK = () => {
      const id = 'facebook-jssdk';
      const fjs = document.getElementsByTagName('script')[0];

      if (document.getElementById(id)) return;

      const js = document.createElement('script');
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode!.insertBefore(js, fjs);
    };

    loadSDK();
  };

  onMount(() => {
    initFacebookSDK();
  });

  return null; // This component doesn't render anything
}
