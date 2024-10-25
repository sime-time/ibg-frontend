import { createSignal, Show } from "solid-js";
import { Title } from "@solidjs/meta";
import SocialAuth from "~/components/SocialAuth";
import { FaSolidUser } from 'solid-icons/fa'
import { useNavigate } from "@solidjs/router";
import * as v from "valibot";
import { usePocket } from "~/context/PocketbaseContext";

const SignUpSchema = v.pipe(
  v.object({
    name: v.pipe(
      v.string('Your name must be in text.'),
      v.nonEmpty('Please enter your name.'),
    ),
    email: v.pipe(
      v.string('Your email must be a string of characters.'),
      v.nonEmpty('Please enter your email.'),
      v.email('The email address is formatted incorrectly.')
    ),
    emailVisibility: v.literal(true),
    password: v.pipe(
      v.string('Your password must be a string of characters.'),
      v.nonEmpty('Please enter your password'),
      v.minLength(8, 'Your password must have 8 characters or more.')
    ),
    passwordConfirm: v.pipe(
      v.string('Your password must be a string of characters.'),
      v.nonEmpty('Please enter your password'),
      v.minLength(8, 'Your password must have 8 characters or more.')
    )
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['passwordConfirm']],
      (input) => input.password === input.passwordConfirm,
      'The passwords do not match.'
    ),
    ['password']
  ),
);

type SignUpData = v.InferOutput<typeof SignUpSchema>;

export default function SignUp() {
  const [name, setName] = createSignal("");
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

    const signUpData = {
      name: name(),
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
        setError("Failed to connect to server. Try again later.")
      } else {
        setError("Email or password is incorrect.");
      }
    } finally {
      setSubmitDisabled(false);
    }
  }

  return <>
    <Title>Sign Up</Title>
    <main class="flex items-start justify-center min-h-screen">
      <div class="card bg-base-100 shadow-xl w-fit md:w-96">
        <div class="card-body">
          <h1 class="card-title text-2xl font-bold mb-3">Sign Up</h1>

          <form onSubmit={handleSignUp} class="flex flex-col gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Name</span>
              </label>
              <label class="input input-bordered flex items-center gap-2">
                <FaSolidUser class="w-4 h-4 opacity-70" />
                <input
                  onInput={(event) => {
                    setName(event.currentTarget.value)
                  }}
                  type="text"
                  class="grow"
                  placeholder="Full name"
                  value={name()}
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
            <div class="form-control mt-2">
              <button type="submit" class="btn btn-primary" disabled={submitDisabled()}>
                {submitDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Continue"}
              </button>
            </div>
          </form>

          <div class="divider">OR</div>
          <SocialAuth />

        </div>
      </div>
    </main>
  </>
}
