import { type Setter } from "solid-js";
import * as v from "valibot";
import { authorizePB } from "./AuthorizePocketbase";

const ContactSchema = v.object({
  phone: v.pipe(
    v.string('You must include your phone number.'),
    v.maxLength(20, 'The phone number must not exceed 20 characters.'),
    v.nonEmpty('Please enter your phone number.'),
  ),
  emergencyName: v.pipe(
    v.string('The name must be in text.'),
    v.nonEmpty('Please enter the name of your emergency contact.'),
  ),
  emergencyPhone: v.pipe(
    v.string("You must include your emergency contact's phone number."),
    v.maxLength(20, 'The phone number must not exceed 20 characters.'),
    v.nonEmpty("Please enter your emergency contact's phone number."),
  ),
  birthDate: v.pipe(
    v.date(),
    v.toMaxValue(new Date()),
  )
});

type ContactData = v.InferOutput<typeof ContactSchema>;

// should always set this function in a try/catch block
export const addContactInfo = async (contactInfo: ContactData, setError: Setter<string>): Promise<boolean> => {

  const pb = await authorizePB();

  try {
    // get member info 
    if (pb.authStore.isAdmin) {
      throw new Error("admin_logged_in")
    }

    const member = pb.authStore.model;

    // validate user input 
    const validContactInfo = v.parse(ContactSchema, contactInfo);

    // check if phone numbers are the same 
    if (validContactInfo.phone === validContactInfo.emergencyPhone) {
      throw new Error("phone_match");
    }

    // check if birth year is valid 
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (validContactInfo.birthDate > oneYearAgo) {
      throw new Error("invalid_birth_date");
    }

    const newPhone = {
      "phone_number": validContactInfo.phone,
      "phone_type_id": import.meta.env.VITE_PERSONAL_PHONE_ID,
      "description": `${member?.name}'s Personal`,
      "member_id": member?.id,
    }

    const newEmergency = {
      "phone_number": validContactInfo.emergencyPhone,
      "phone_type_id": import.meta.env.VITE_EMERGENCY_PHONE_ID,
      "description": validContactInfo.emergencyName,
      "member_id": member?.id,
    }

    const newBirthDate = {
      "birth_date": validContactInfo.birthDate,
    };

    const phoneRecord = await pb.collection("member_phone").create(newPhone);
    const emergencyRecord = await pb.collection("member_phone").create(newEmergency);
    const updateBirthDate = await pb.collection("member").update(member?.id, newBirthDate);

    console.log("Contact info updated successfully!");

  } catch (err) {
    if (err instanceof v.ValiError) {
      setError(err.issues[0].message);
    } else if (err instanceof Error && err.message == "phone_match") {
      setError("The emergency contact phone number and your phone number cannot be the same.");
    } else if (err instanceof Error && err.message == "admin_logged_in") {
      setError("The Administrator (Coach) is logged in. Not a member.");
    } else if (err instanceof Error && err.message == "invalid_birth_date") {
      setError("Please enter a valid birth date.");
    } else {
      setError("An unexpected error occurred. Try again later.");
    }
    return false;
  }
  return true;
}

