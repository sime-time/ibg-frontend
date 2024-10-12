import { onMount } from "solid-js";

interface DocuSealProps {
  memberEmail: string;
}

export default function DocuSealForm(props: DocuSealProps) {
  let formRef: HTMLDivElement | undefined;

  onMount(() => {
    // load the script
    const script = document.createElement("script");
    script.src = "https://cdn.docuseal.co/js/form.js";
    script.async = true;
    document.body.appendChild(script);

    // initialize the form 
    script.onload = () => {
      if (formRef) {
        const el = document.createElement('docuseal-form');
        el.setAttribute('id', 'docusealForm');
        el.setAttribute('data-src', import.meta.env.VITE_DOCUSEAL_URL);
        el.setAttribute('data-email', props.memberEmail);

        formRef.appendChild(el);

        // add event listener after form is rendered 
        window.docusealForm?.addEventListener('completed', (e: CustomEvent) => {
          console.log("Form completed: ", e.detail);
        });
      }
    };
  });

  return (
    <div ref={formRef} class="bg-white"></div>
  );
}