import { ParentProps, Show } from "solid-js";

interface ContactDialogProps extends ParentProps {
  name: string;
  phone: string;
  dialogId: string;
}

export default function ContactDialog(props: ContactDialogProps) {
  return (
    <dialog id={props.dialogId} class="modal">
      <form method="dialog" class="modal-backdrop">
        <button>close when clicked outside</button>
      </form>
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="font-bold text-lg mb-2">{props.children}</h3>
        <Show when={props.name && props.phone} fallback={<span class="loading loading-spinner loading-md"></span>}>
          <p class="text-base"><span class="font-semibold">Name:</span> {props.name} </p>
          <p class="text-base"><span class="font-semibold">Phone:</span> {props.phone} </p>
        </Show>
        <div class="modal-action">
          <form method="dialog" class="flex gap-4 w-full">
            <a href={`tel:${props.phone}`} class="btn btn-primary grow">Call</a>
            <a href={`sms:${props.phone}`} class="btn btn-accent btn-outline grow">Text</a>
            <button class="btn grow">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}