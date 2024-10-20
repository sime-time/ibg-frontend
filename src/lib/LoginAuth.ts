import { Setter } from "solid-js";
import * as v from "valibot";
import { authorizePB } from "./AuthorizePocketbase";

const LoginSchema = v.object({
  email: v.pipe(
    v.string('Your email must be a string of characters.'),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is formatted incorrectly.')
  ),
  password: v.pipe(
    v.string('Your password must be a string of characters.'),
    v.nonEmpty('Please enter your password'),
    v.minLength(5, 'Your password must have 5 characters or more.')
  )
});

type LoginData = v.InferOutput<typeof LoginSchema>;

export const loginAuth = async (accountType: string, loginData: LoginData, setError: Setter<string>): Promise<boolean> => {
  const pb = await authorizePB();

  try {
    //validate user input 
    const validLogin = v.parse(LoginSchema, loginData);

    // "logout" of the last authenticated model 
    pb.authStore.clear();

    if (accountType === "member") {
      await pb.collection("member").authWithPassword(
        validLogin.email,
        validLogin.password,
      );
    } else {
      await pb.admins.authWithPassword(
        validLogin.email,
        validLogin.password,
      );
    }
    console.log("Logged in successfully!")

  } catch (err) {
    if (err instanceof v.ValiError) {
      setError(err.issues[0].message);
    } else {
      setError("Email or password is incorrect.");
    }
    return false;
  }
  return true;
}
