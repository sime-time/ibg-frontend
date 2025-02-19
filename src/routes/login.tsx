import { createSignal, Show, Switch, Match } from "solid-js";
import { Title } from "@solidjs/meta";
import { UserType } from "~/types/UserType";
import { useNavigate } from "@solidjs/router";
import { IoClose } from 'solid-icons/io'
import { usePocket } from "~/context/PocketbaseContext";
import { LoginSchema, LoginData } from "~/types/ValidationType";
import * as v from "valibot";
import ForgotPassword from "~/components/auth/ForgotPassword";

export default function Login() {
  const [memberLogin, setMemberLogin] = createSignal(false);
  const [coachLogin, setCoachLogin] = createSignal(false);
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [submitDisabled, setSubmitDisabled] = createSignal(false);

  const navigate = useNavigate();
  const { loginAdmin, loginMember } = usePocket();

  const handleLogin = async (e: Event, userType: UserType) => {
    e.preventDefault();
    setSubmitDisabled(true);
    setError(""); // clear any previous errors

    const loginData: LoginData = {
      email: email(),
      password: password(),
    }

    try {
      // validate user input
      const validLogin = v.parse(LoginSchema, loginData);

      let successful: boolean;
      let nextPage: string;

      if (userType === UserType.Member) {
        successful = await loginMember(
          validLogin.email,
          validLogin.password
        );
        nextPage = "/member";
      } else {
        successful = await loginAdmin(
          validLogin.email,
          validLogin.password
        );
        nextPage = "/coach";
      }

      if (successful === false) {
        throw new Error("server_error");
      } else {
        console.log("Logged in successfully!");
        navigate(nextPage);
      }

    } catch (err) {
      if (err instanceof v.ValiError) {
        setError(err.issues[0].message);
      } else {
        setError("Email or password is incorrect.");
      }
    } finally {
      setSubmitDisabled(false);
    }
  }

  return <>
    <Title>Log In - Indy Boxing and Grappling</Title>
    <main class="flex items-start justify-center mt-4">
      <Switch fallback={
        <div class="flex flex-col gap-4 mt-24">
          <h2 class="text-2xl text-center font-bold">I am a...</h2>
          <div class="flex gap-4">
            <button onClick={() => setMemberLogin(true)} class="btn btn-primary">Member</button>
            <button onClick={() => setCoachLogin(true)} class="btn btn-secondary">Coach</button>
          </div>
        </div>
      }>
        <Match when={memberLogin()}>
          <div class="card bg-base-100 shadow-xl w-fit md:w-96">
            <div class="card-body">

              <div class="flex justify-between items-center">
                <h1 class="card-title text-2xl font-bold">Member Login</h1>
                <button onClick={() => setMemberLogin(false)} class="btn btn-circle"><IoClose class="w-5 h-5" /></button>
              </div>

              <form onSubmit={(e: Event) => handleLogin(e, UserType.Member)} class="flex flex-col gap-4">

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Email</span>
                  </label>
                  <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                    <input onInput={(event) => {
                      setEmail(event.currentTarget.value);
                    }}
                      type="email" class="grow" placeholder="example@email.com" value={email()} />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Password</span>
                  </label>
                  <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
                    <input onInput={(event) => {
                      setPassword(event.currentTarget.value);
                    }}
                      type="password" class="grow" placeholder="Enter password" value={password()} />
                  </label>
                  <ForgotPassword />
                </div>

                <Show when={error()}>
                  <p class="text-error">{error()}</p>
                </Show>

                <div class="form-control">
                  <button type="submit" class="btn btn-primary" disabled={submitDisabled()}>
                    {submitDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Login"}
                  </button>
                </div>

                <div class="text-center text-sm">
                  <p>Don't have an account?</p>
                  <a href="/signup" class="link link-primary">Sign up here</a>
                </div>

              </form>
            </div>
          </div>
        </Match>

        <Match when={coachLogin()}>
          <div class="card bg-base-100 shadow-xl w-fit md:w-96">
            <div class="card-body">

              <div class="flex justify-between items-center">
                <h1 class="card-title text-2xl font-bold">Coach Login</h1>
                <button onClick={() => setCoachLogin(false)} class="btn btn-circle"><IoClose class="w-5 h-5" /></button>
              </div>

              <form onSubmit={(e: Event) => handleLogin(e, UserType.Coach)} class="flex flex-col gap-4">

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Email</span>
                  </label>
                  <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                    <input onInput={(event) => {
                      setEmail(event.currentTarget.value);
                    }}
                      type="email" class="grow" placeholder="example@email.com" value={email()} />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Password</span>
                  </label>
                  <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
                    <input onInput={(event) => {
                      setPassword(event.currentTarget.value);
                    }}
                      type="password" class="grow" placeholder="Enter password" value={password()} />
                  </label>
                  <ForgotPassword />
                </div>

                <Show when={error()}>
                  <p class="text-error">{error()}</p>
                </Show>

                <div class="form-control">
                  <button type="submit" class="btn btn-secondary" disabled={submitDisabled()}>
                    {submitDisabled() ? <span class="loading loading-spinner loading-md"></span> : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Match>
      </Switch>
    </main>
  </>
}
