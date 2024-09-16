import { type Setter } from "solid-js";
import * as v from "valibot";
import { authorizePB } from "./PocketBaseAuth";

enum PhoneType {
  Mobile = "2j1p75vipuy1i5i",
  Emergency = "c6chz0l9vhs4ts3",
}

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
  phone: v.pipe(
    v.string('Your phone number must be a string of numbers.'),
    v.nonEmpty('Please enter your phone number.'),
  ),
  emergencyPhone: v.pipe(
    v.string('Your emergency number must be a string of numbers.'),
    v.nonEmpty('Please enter your emergency contact number.'),
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
    console.log("Member registered successfully!");

    // grab the id of this newly created member
    const memberId = record.id;

    // add the phone number of this member
    await pb.collection("member_phone").create({
      "member_id": [memberId],
      "phone": validMember.phone,
      "phone_type_id": [PhoneType.Mobile],
    });

    // add the emergency number 
    await pb.collection("member_phone").create({
      "member_id": [memberId],
      "phone": validMember.emergencyPhone,
      "phone_type_id": [PhoneType.Emergency],
    });

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
