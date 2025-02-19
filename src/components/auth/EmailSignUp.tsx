import { createSignal, Show } from "solid-js";
import { FaSolidUser } from 'solid-icons/fa'
import { IoClose } from "solid-icons/io";
import { useNavigate } from "@solidjs/router";
import * as v from "valibot";
import { usePocket } from "~/context/PocketbaseContext";
import { SignUpData } from "~/types/ValidationType";
import { SignUpSchema } from "~/types/ValidationType";

export default function EmailSignUp() {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [passwordConfirm, setPasswordConfirm] = createSignal("");
  const [submitDisabled, setSubmitDisabled] = createSignal(false);
  const [error, setError] = createSignal("");

  const navigate = useNavigate();
  const { signup } = usePocket();

  const handleSignUp = async (e: Event) => {
    e.preventDefault();
    setSubmitDisabled(true);
    setError(""); // clear previous errors

    const signUpData: SignUpData = {
      name: firstName() + " " + lastName(),
      email: email(),
      emailVisibility: true,
      password: password(),
      passwordConfirm: passwordConfirm(),
    }

    try {
      // validate user input
      const validSignUp = v.parse(SignUpSchema, signUpData);

      const successful: boolean = await signup(validSignUp);

      if (successful === false) {
        throw new Error("server_error");
      } else {
        console.log("Member signed up successfully!");
        navigate("/member");
      }

    } catch (err) {
      if (err instanceof v.ValiError) {
        setError(err.issues[0].message);
      } else if (err instanceof Error && err.message == "server_error") {
        setError("Internal server error or email might already be taken. Try again later.")
      } else {
        setError("Email might already be taken. Go to login");
      }
    } finally {
      setSubmitDisabled(false);
    }
  }

  return (
    <div class="card bg-base-100 shadow-xl w-fit md:w-96">
      <div class="card-body">
        <h1 class="card-title text-2xl font-bold">Sign Up</h1>
        <form onSubmit={handleSignUp} class="flex flex-col gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">First Name</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <FaSolidUser class="w-4 h-4 opacity-70" />
              <input
                onInput={(event) => {
                  setFirstName(event.currentTarget.value)
                }}
                type="text"
                class="grow"
                placeholder="First"
                value={firstName()}
              />
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Last Name</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <FaSolidUser class="w-4 h-4 opacity-70" />
              <input
                onInput={(event) => {
                  setLastName(event.currentTarget.value)
                }}
                type="text"
                class="grow"
                placeholder="Last"
                value={lastName()}
              />
            </label>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
              <input
                onInput={(event) => {
                  setEmail(event.currentTarget.value)
                }}
                type="email"
                class="grow"
                placeholder="example@email.com"
                value={email()}
              />
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
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

          <div class="form-control">
            <label class="label">
              <span class="label-text">Confirm Password</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
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
