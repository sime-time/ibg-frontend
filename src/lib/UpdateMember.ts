import { Setter } from "solid-js";
import * as v from "valibot";
import { authorizePB } from "./AuthorizePocketbase";

const UpdateSchema = v.object({
  name: v.optional(
    v.string('Your name must be in text.'),
  ),
  email: v.optional(v.pipe(
    v.string('Your email must be a string of characters.'),
    v.email('The email address is formatted incorrectly.'),
  )),
});

type UpdateData = v.InferOutput<typeof UpdateSchema>;

// should always set this function in a try/catch block
export const updateMember = async (memberId: string, memberData: UpdateData, setError: Setter<string>): Promise<boolean> => {

  const pb = await authorizePB();

  try {
    // validate user input 
    const validMemberData = v.parse(UpdateSchema, memberData);

    const memberUpdate = {
      "name": validMemberData.name,
      "email": validMemberData.email,
    };

    await pb.collection("member").update(memberId, memberUpdate);
    console.log("Member updated successfully!");

  } catch (err) {
    if (err instanceof v.ValiError) {
      setError(err.issues[0].message);
    } else {
      setError("An unexpected error occurred. Member not updated.");
    }
    return false;
  }
  return true;
}
