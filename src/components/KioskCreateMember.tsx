import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { FaSolidUser, FaSolidPhone, FaSolidUserDoctor } from 'solid-icons/fa'
import * as v from "valibot";
import { usePocket } from "~/context/PocketbaseContext";
import { SignUpData, SignUpSchema } from "~/types/ValidationType";
import { ContactSchema, ContactData } from "~/types/ValidationType";

export default function KioskCreateMember() {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [passwordConfirm, setPasswordConfirm] = createSignal("");

  const [phone, setPhone] = createSignal("");
  const [emergencyName, setEmergencyName] = createSignal("");
  const [emergencyPhone, setEmergencyPhone] = createSignal("");
  const [submitDisabled, setSubmitDisabled] = createSignal(false);
  const [error, setError] = createSignal("");

  const { createMember } = usePocket();
  const navigate = useNavigate();

  const handleCreate = async (e: Event) => {
    e.preventDefault();
    setSubmitDisabled(true);
    setError(""); // clear previous errors

    const memberData: SignUpData = {
      name: firstName() + " " + lastName(),
      email: email(),
      emailVisibility: true,
      password: password(),
      passwordConfirm: passwordConfirm(),
    };

    const contactData: ContactData = {
      avatar: null, // no profile picture on creation
      phone: phone(),
      emergencyName: emergencyName(),
      emergencyPhone: emergencyPhone(),
    };

    try {
      // validate info
      const validMember = v.parse(SignUpSchema, memberData);
      const validContact = v.parse(ContactSchema, contactData);

      console.log("Creating member...");
      const successful: boolean = await createMember(validMember, validContact);

      if (successful) {
        navigate("/qr-login");
      } else {
        throw new Error("server_error");
      }

    } catch (err) {
      if (err instanceof v.ValiError) {
        setError(err.issues[0].message);
      } else if (err instanceof Error && err.message == "server_error") {
        setError("Internal server error. Try again later.")
      } else {
        setError("Email or password is incorrect.");
      }
    } finally {
      setSubmitDisabled(false);
    }
  }

  return (
    <div class="card bg-base-100 shadow-xl w-5/6">
      <div class="card-body">
        <h1 class="card-title text-2xl font-bold mb-3">New Member</h1>
        <form onSubmit={handleCreate} class="flex flex-col md:grid md:grid-cols-2 gap-5">

          <div class="form-control">
            <label class="label">
              <span class="label-text">First Name</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow">
                <FaSolidUser class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setFirstName(event.currentTarget.value)
                  }}
                  type="text"
                  class="grow"
                  placeholder="First Name"
                  value={firstName()}
                />
              </label>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Last Name</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow">
                <FaSolidUser class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setLastName(event.currentTarget.value)
                  }}
                  type="text"
                  class="grow"
                  placeholder="Last Name"
                  value={lastName()}
                />
              </label>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                <input
                  onInput={(event) => {
                    setEmail(event.currentTarget.value)
                  }}
                  type="email"
                  class="grow"
                  placeholder="Email"
                  value={email()}
                />
              </label>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Phone</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow">
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
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Emergency Contact Name</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow">
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
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Emergency Contact Phone</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow">
                <FaSolidPhone class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setEmergencyPhone(event.currentTarget.value)
                  }}
                  type="text"
                  class="grow"
                  placeholder="(098) 765-4321"
                  value={emergencyPhone()}
                />
              </label>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
                <input
                  onInput={(event) => {
                    setPassword(event.currentTarget.value)
                  }}
                  type="password"
                  class="grow"
                  placeholder="Enter password"
                  value={password()}
                />
              </label>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Confirm Password</span>
            </label>
            <div class="flex gap-3 w-full">
              <label class="input input-bordered flex items-center gap-2 grow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
                <input
                  onInput={(event) => {
                    setPasswordConfirm(event.currentTarget.value)
                  }}
                  type="password"
                  class="grow"
                  placeholder="Confirm password"
                  value={passwordConfirm()}
                />
              </label>
            </div>
          </div>

          <Show when={error()}>
            <p class="text-error mt-3 col-span-2">{error()}</p>
          </Show>

          <div class="form-control mt-3 col-span-2">
            <button type="submit" class="btn btn-secondary" disabled={submitDisabled()}>
              {submitDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}