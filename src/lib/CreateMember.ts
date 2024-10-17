import { type Setter } from "solid-js";
import * as v from "valibot";
import { authorizePB } from "./PocketBaseAuth";


const MemberSchema = v.object({
  fullName: v.pipe(
    v.string('Your name must be in text.'),
    v.nonEmpty('Please enter your name.'),
  ),
  email: v.pipe(
    v.string('Your email must be a string of characters.'),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is formatted incorrectly.')
  ),
  password: v.pipe(
    v.string('Your password must be a string of characters.'),
    v.nonEmpty('Please enter your password'),
    v.minLength(5, 'Your password must have 5 characters or more.')
  ),
  passwordConfirm: v.pipe(
    v.string('Your password must be a string of characters.'),
    v.nonEmpty('Please enter your password'),
    v.minLength(5, 'Your password must have 5 characters or more.')
  )
});

type MemberData = v.InferOutput<typeof MemberSchema>;

// should always set this function in a try/catch block
export const createMember = async (memberData: MemberData, setError: Setter<string>): Promise<boolean> => {

  const pb = await authorizePB();

  try {
    // validate user input 
    const validMember = v.parse(MemberSchema, memberData);

    // check if passwords are the same 
    if (validMember.password !== validMember.passwordConfirm) {
      throw new Error("password_mismatch");
    }

    const newMember = {
      "name": validMember.fullName,
      "email": validMember.email,
      "emailVisibility": true,
      "password": validMember.password,
      "passwordConfirm": validMember.passwordConfirm,
    };


    const record = await pb.collection("member").create(newMember);
    console.log("New member created successfully!");
    console.log("Logging in as new member...")
    pb.authStore.clear();
    await pb.collection("member").authWithPassword(
      validMember.email,
      validMember.password,
    );

  } catch (err) {
    if (err instanceof v.ValiError) {
      setError(err.issues[0].message);
    } else if (err instanceof Error && err.message == "password_mismatch") {
      setError("Passwords do not match.");
    } else {
      setError("An unexpected error occurred. No member created.");
    }
    return false;
  }
  return true;
}
