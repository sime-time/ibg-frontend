import { createSignal, Show } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { FaSolidUser, FaSolidPhone, FaSolidUserDoctor } from "solid-icons/fa";
import * as v from "valibot";

const ContactSchema = v.pipe(v.object({
  phone: v.pipe(
    v.string('You must include your phone number.'),
    v.maxLength(30, 'The phone number must not exceed 30 characters.'),
    v.nonEmpty('Please enter your phone number.'),
  ),
  emergencyName: v.pipe(
    v.string('The name must be in text.'),
    v.nonEmpty('Please enter the name of your emergency contact.'),
  ),
  emergencyPhone: v.pipe(
    v.string("You must include your emergency contact's phone number."),
    v.maxLength(30, 'The phone number must not exceed 30 characters.'),
    v.nonEmpty("Please enter your emergency contact's phone number."),
  ),
}),
  v.forward(
    v.partialCheck(
      [['phone'], ['emergencyPhone']],
      (input) => input.phone != input.emergencyPhone,
      'Your phone number and the emergency number cannot be the same.'
    ),
    ['phone']
  ),
);

type ContactData = v.InferOutput<typeof ContactSchema>;

export default function MemberContactInfo() {
  const [phone, setPhone] = createSignal("");
  const [emergencyName, setEmergencyName] = createSignal("");
  const [emergencyPhone, setEmergencyPhone] = createSignal("");
  const [error, setError] = createSignal("");
  const [submitDisabled, setSubmitDisabled] = createSignal(false);

  const { user, addContactInfo } = usePocket();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setSubmitDisabled(true);

    const contactData: ContactData = {
      phone: phone(),
      emergencyName: emergencyName(),
      emergencyPhone: emergencyPhone(),
    }

    try {
      // validate user input 
      const validContactInfo = v.parse(ContactSchema, contactData);

      const successful: boolean = await addContactInfo(validContactInfo);

      if (successful) {
        console.log("Contact info added to member: ", user()?.name);
        location.reload();
      } else {
        throw new Error("server_error");
      }

    } catch (err) {
      if (err instanceof v.ValiError) {
        setError(err.issues[0].message);
      } else if (err instanceof Error && err.message == "server_error") {
        setError("Internal server error. Try again later.")
      } else {
        setError("An unexpected error occured. Try again later.");
      }
    } finally {
      setSubmitDisabled(false);
    }
  };

  return (
    <div class="card bg-base-100 shadow-xl w-fit md:w-96">
      <div class="card-body">
        <h1 class="card-title text-2xl font-bold">Contact Information</h1>
        <form onSubmit={handleSubmit} class="flex flex-col gap-4">

          <div class="form-control">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <FaSolidUser class="w-4 h-4 opacity-70" />
              <input type="text" disabled={true} class="grow" placeholder={user()?.name} />
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Phone</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <FaSolidPhone class="w-4 h-4 opacity-70" />
              <input
                onInput={(event) => {
                  setPhone(event.currentTarget.value)
                }}
                type="tel"
                class="grow"
                placeholder="(123) 456-7890"
                value={phone()}
              />
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Emergency Contact Name</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <FaSolidUserDoctor class="w-4 h-4 opacity-70" />
              <input
                onInput={(event) => {
                  setEmergencyName(event.currentTarget.value)
                }}
                type="text"
                class="grow"
                placeholder="Name of relative, doctor, etc."
                value={emergencyName()}
              />
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Emergency Contact Phone</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <FaSolidPhone class="w-4 h-4 opacity-70" />
              <input
                onInput={(event) => {
                  setEmergencyPhone(event.currentTarget.value)
                }}
                type="tel"
                class="grow"
                placeholder="(098) 765-4321"
                value={emergencyPhone()}
              />
            </label>
          </div>

          <Show when={error()}>
            <p class="text-error">{error()}</p>
          </Show>

          <div class="form-control mt-3">
            <button type="submit" class="btn btn-primary" disabled={submitDisabled()}>
              {submitDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Continue"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}