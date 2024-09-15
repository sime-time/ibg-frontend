import { createEffect, createSignal } from "solid-js";
import PocketBase from "pocketbase";
import { updateMember } from "~/lib/UpdateMember";
import FormInput from "~/components/ui/FormInput";

interface UpdateMemberProps {
  pb: PocketBase;
  memberId: string;
}

export default function FormUpdateMember(props: UpdateMemberProps) {
  const [email, setEmail] = createSignal("");
  const [name, setName] = createSignal("");
  const [error, setError] = createSignal("");

  createEffect(async () => {
    const record = await props.pb.collection('member').getOne(props.memberId);
    setEmail(record.email);
    setName(record.name);
  });

  const confirmUpdate = async (e: Event) => {
    e.preventDefault();
    setError("");

    const formData = {
      name: name(),
      email: email(),
    }

    try {
      const successful = updateMember(props.memberId, formData, setError);
      if (await successful) {
        location.reload();
      }
    } catch (err) {
      console.error("Error updating member: ", err);
    }
  }

  return (
    <form onSubmit={confirmUpdate} class="flex flex-col gap-4 mb-4">
      <FormInput type="text" name="name" label="Full Name" required={false} value={name()} setValue={setName} placeholder={name()} />
      <FormInput type="email" name="email" label="Email" required={false} value={email()} setValue={setEmail} placeholder={email()} />

      {error() && <p class="text-red-500">{error()}</p>}

      <button type="submit" class="bg-blue-600/90 hover:bg-blue-700 text-white rounded-md py-3 px-5 mt-2 font-bold">Update Member</button>
    </form>
  );

}