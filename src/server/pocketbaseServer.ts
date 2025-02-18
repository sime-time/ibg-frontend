"use server";

import {
  MemberData,
  MemberRecord,
  ContactInfo,
  UpdateMemberData,
  MartialArtRecord,
  ClassRecord,
  PasswordUpdateResult,
  TokenUser,
} from "~/types/UserType";
import { ClassData, MemberPasswordData } from "~/types/ValidationType";
import Pocketbase from "pocketbase";

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL;
const ADMIN_EMAIL = import.meta.env.VITE_POCKETBASE_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_POCKETBASE_PASSWORD;

export const signup = async (newMember: MemberData): Promise<TokenUser> => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    await pb.collection("member").create(newMember);
    await pb.collection("member").requestVerification(newMember.email);
    return await loginMember(newMember.email, newMember.password);
  } catch (err) {
    console.error("Signup failed: ", err);
    return { token: null, user: null };
  }
};

export const loginMember = async (email: string, password: string): Promise<TokenUser> => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.collection("member").authWithPassword(email, password);
    return { token: pb.authStore.token, user: pb.authStore.model };
  } catch (err) {
    console.error("Login failed:", err);
    return { token: null, user: null };
  }
};

export const loginAdmin = async (email: string, password: string): Promise<TokenUser> => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(email, password);
    return { token: pb.authStore.token, user: pb.authStore.model };
  } catch (err) {
    console.error("Login failed:", err);
    return { token: null, user: null };
  }
};

export const addContactInfo = async (contactInfo: ContactInfo, memberId: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  const memberData = {
    avatar: contactInfo.avatar,
    phone_number: contactInfo.phone,
  };
  const emergencyContact = {
    phone_number: contactInfo.emergencyPhone,
    name: contactInfo.emergencyName,
    member_id: memberId,
  };

  try {
    await pb.collection("member").update(memberId, memberData);
    await pb.collection("member_emergency").create(emergencyContact);
    return true;
  } catch (err) {
    return false;
  }
};

export const getEmergencyContact = async (memberId: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    const emergencyRecord = await pb.collection("member_emergency").getFirstListItem(`member_id="${memberId}"`);
    return {
      id: String(emergencyRecord.id),
      phone: String(emergencyRecord.phone_number),
      name: String(emergencyRecord.name),
    };
  } catch (err) {
    console.error(err);
    return {
      id: "",
      phone: "",
      name: "",
    };
  }
};

export const updatePassword = async (memberId: string, memberEmail: string, p: MemberPasswordData) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  let result: PasswordUpdateResult;

  // determine if old password is incorrect
  try {
    await pb.collection("member").authWithPassword(memberEmail, p.oldPassword);
  } catch (err) {
    result = {
      success: false,
      message: "Current password is incorrect",
    };
    return result;
  }

  let updateMemberPassword = {
    password: p.newPassword,
    passwordConfirm: p.newPasswordConfirm,
    oldPassword: p.oldPassword,
  };

  // try to update the password
  try {
    await pb.collection("member").update(memberId, updateMemberPassword);
    result = {
      success: true,
      message: "Password updated successfully!",
    };
  } catch (err) {
    console.error("Error updating password:", err);
    result = {
      success: false,
      message: "Error updating password",
    };
  }
  return result;
};

export const updateMember = async (memberId: string, updatedData: UpdateMemberData) => {
  const pb = new Pocketbase(POCKETBASE_URL);

  // for avatar, use undefined instead of null
  // because null will delete the previous avatar
  let updateMemberRecord = {
    name: updatedData.name,
    phone_number: updatedData.phone,
  };

  const updateEmergencyRecord = {
    phone_number: updatedData.emergencyPhone,
    name: updatedData.emergencyName,
  };

  // update member
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    await pb.collection("member").update(memberId, updateMemberRecord);
    // update the member's avatar if applicable
    if (updatedData.avatar) {
      const updateAvatar = new FormData();
      updateAvatar.append("avatar", updatedData.avatar);
      await pb.collection("member").update(memberId, updateAvatar);
    }
  } catch (err) {
    console.error("Error updating member: ", err);
  }

  // update emergency contact
  try {
    const emergencyRecord = await pb
      .collection("member_emergency")
      .getFirstListItem(`member_id="${memberId}"`);
    await pb
      .collection("member_emergency")
      .update(emergencyRecord.id, updateEmergencyRecord);
  } catch (err) {
    console.error("Error updating emergency contact: ", err);
  }
};

export const getMember = async (memberId: string): Promise<MemberRecord> => {
  const pb = new Pocketbase(POCKETBASE_URL);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  const member = await pb.collection("member").getOne<MemberRecord>(memberId);
  member.avatarUrl = member.avatar
    ? pb.files.getUrl(member, member.avatar)
    : "https://www.gravatar.com/avatar/?d=mp";
  return member;
};

export const getMembers = async (): Promise<MemberRecord[]> => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    const members: MemberRecord[] = await pb.collection("member").getFullList<MemberRecord>();
    return members.map(
      (member) =>
      ({
        ...member,
        program: !member.program ? "N/A" : member.program,
        avatarUrl: member.avatar
          ? pb.files.getUrl(member, member.avatar)
          : "https://www.gravatar.com/avatar/?d=mp",
      } as MemberRecord)
    );
  } catch (err) {
    console.error("Error fetching members: ", err);
    return [];
  }
};

export const deleteMember = async (memberId: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

    // cancel stripe subscription if not paying with cash
    const member = await pb.collection("member").getOne(memberId);
    if (member.is_subscribed && !member.pay_with_cash) {
      const cancelled = await cancelSubscription(member.stripe_customer_id);
      if (!cancelled) {
        throw new Error(
          "Active subscription was not cancelled. Member not deleted."
        );
      } else {
        console.log("Member subscription cancelled");
      }
    } else {
      console.log("Member has no active subscription");
    }

    // delete emergency contact
    try {
      const emergencyRecord = await getEmergencyContact(memberId);
      await pb
        .collection("member_emergency")
        .delete(emergencyRecord.id)
        .then(() => {
          console.log("Emergency contact deleted.");
        });
    } catch (err) {
      console.error("No emergency contact deleted.", err);
    }

    // delete member
    await pb.collection("member").delete(memberId);
    console.log("Deleted member: ", member.name);
  } catch (err) {
    console.error(err);
  }
};

export const refreshMember = async (token: string | null): Promise<TokenUser> => {
  const pb = new Pocketbase(POCKETBASE_URL);
  if (token == null) {
    return { token: null, user: null };
  }
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    // restore session using token
    pb.authStore.save(token, null);

    if (pb.authStore.isValid) {
      // refresh authentication
      const refreshedAuth = await pb.collection("member").authRefresh();
      return { token: pb.authStore.token, user: pb.authStore.model };
    }
  } catch (err) {
    console.error("Error refreshing auth:", err);
  }
  return { token: null, user: null }; // Return null if refresh fails
};

interface MemberAttendanceRecord extends MemberRecord {
  checkedIn: boolean;
}
export const getMemberAttendance = async (date: Date): Promise<MemberAttendanceRecord[]> => {
  const pb = new Pocketbase(POCKETBASE_URL);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

  date.setHours(0, 0, 0, 0);
  const filterDate = date.toISOString().slice(0, 10); // Format as "YYYY-MM-DD"
  const filter = `check_in_date >= "${filterDate} 00:00:00Z" && check_in_date < "${filterDate} 23:59:59Z"`;
  const attendanceList = await pb.collection("attendance").getFullList({
    filter: filter,
  });

  const members: MemberRecord[] = await getMembers();

  // go through members
  // if member is in the attendanceList
  // add property to member obj -> checkedIn: true
  // otherwise add -> checkedIn: false
  const hasAttended = (memberId: string) => {
    for (let i = 0; i < attendanceList.length; i++) {
      if (attendanceList[i].member_id === memberId) {
        return true;
      }
    }
    return false;
  };
  return members.map(
    (member) =>
    ({
      ...member,
      checkedIn: hasAttended(member.id),
    } as MemberAttendanceRecord)
  );
};

export const cancelSubscription = async (stripeCustomerId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_POCKETBASE_URL}/cancel-subscription`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          customerId: stripeCustomerId,
        }),
      }
    );

    console.log("Cancel Subscription Response: ", response);

    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error("Error cancelling subscription: ", error);
  }
  return false;
};

export const getMartialArtId = async (shortname: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    const record = await pb.collection("martial_art").getFirstListItem(`shortname="${shortname}"`);
    return record.id;
  } catch (err) {
    console.error("Could not find martial art id: ", err);
    return "";
  }
};

export const getMartialArts = async () => {
  const pb = new Pocketbase(POCKETBASE_URL);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  const martialArts = await pb.collection("martial_art").getFullList<MartialArtRecord>();
  return martialArts;
};

export const testPocketbase = async () => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    console.log("Testing PB connection...");
    const response = await pb.health.check();
    console.log("PB health check response:", response);
  } catch (error) {
    console.error("PB connection test failed:", error);
  }
};

export const createClass = async (newClass: ClassData) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    await pb.collection("class").create(newClass);
    console.log("New class created!");
    return true;
  } catch (err) {
    console.error("Error creating class: ", err);
    return false;
  }
};

export const updateClass = async (classId: string, updatedClass: ClassData) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    await pb.collection("class").update(classId, updatedClass);
    return true;
  } catch (err) {
    console.error("Error updating class: ", err);
    return false;
  }
};

export const deleteClass = async (classId: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    await pb.collection("class").delete(classId);
    return true;
  } catch (err) {
    console.error("Error deleting class: ", err);
    return false;
  }
};

export const getClasses = async () => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    const classes = await pb.collection("class").getFullList<ClassRecord>();
    return classes;
  } catch (err) {
    console.error("Error fetching classes: ", err);
    return [];
  }
};

export const getClass = async (id: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  const record = await pb.collection("class").getOne<ClassRecord>(id);
  return record;
};

export const getAvatarUrl = async (memberId: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  const member = await pb.collection("member").getOne<MemberRecord>(memberId);
  const avatarUrl: string = member.avatar
    ? pb.files.getUrl(member, member.avatar)
    : "https://www.gravatar.com/avatar/?d=mp";
  return avatarUrl;
};

export const checkIn = async (date: Date, memberId: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  // do not include time, we are tracking the attendance for the full day
  // including time will make it difficult to search for duplicates
  date.setHours(0, 0, 0, 0);
  const utcDate = date.toISOString();
  const checkInData = {
    check_in_date: utcDate,
    member_id: memberId,
  };

  try {
    // prevent duplicate check-ins
    // if this try is successful, then there is a dupe
    const filter = `member_id="${memberId}" && check_in_date="${utcDate.replace("T", " ")}"`;
    const duplicate = await pb.collection("attendance").getFirstListItem(filter);
    console.log(`member ${memberId} already checked-in on ${utcDate.replace("T", " ")}`);
    return false;
  } catch (err) {
    console.log("No duplicate attendance check-in found.");
  }
  const record = await pb.collection("attendance").create(checkInData);
  return true;
};

export const checkOut = async (date: Date, memberId: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  date.setHours(0, 0, 0, 0);
  const filterDate = date.toISOString().replace("T", " ");

  // remove attendance record if member already checked in on this date.
  try {
    const filter = `member_id="${memberId}" && check_in_date="${filterDate}"`;
    const record = await pb.collection("attendance").getFirstListItem(filter);
    await pb.collection("attendance").delete(record.id);
    return true;
  } catch (err) {
    console.log("No attendance check-in for this member on ", filterDate);
    throw err;
  }
};

export const requestVerification = async (email: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  return await pb.collection("member").requestVerification(email);
};

export const changeEmail = async (newEmail: string, memberId: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    const member = await pb.collection("member").getOne(memberId);
    if (!member) {
      return { success: false, message: "Member not found" };
    }
    // check if new email is the same as current email
    if (member.email == newEmail) {
      return {
        success: false,
        message: `New email cannot be the same as current email: ${member.email}`,
      };
    }
    // directly update the member's email as admin
    await pb.collection("member").update(memberId, { email: newEmail });
    return { success: true, message: `Email changed successfully to ${newEmail}` };
  } catch (err) {
    console.error("Email change failed: ", err);
    return { success: false, message: "Email change request failed to process on server" };
  }
};

export const requestPasswordReset = async (email: string) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    // "this function always return a success response as a very basic user emails enumeration protection because the endpoint is public." - pocketbase author
    await pb.collection("member").requestPasswordReset(email);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const waiverTimestamp = async (memberId: string, time: Date) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    const waiverData = { waiver_accepted: time };
    await pb.collection("member").update(memberId, waiverData);
    return true;
  } catch (err) {
    console.error("Error accepting waiver: ", err);
    return false;
  }
};

export const memberPayWithCash = async (
  memberId: string,
  selected: boolean,
  program: string
) => {
  const pb = new Pocketbase(POCKETBASE_URL);
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    const memberData = {
      is_subscribed: selected,
      pay_with_cash: selected,
      program: program,
    };
    await pb.collection("member").update(memberId, memberData);
    return true;
  } catch (err) {
    console.error("Error selecting cash payment option: ", err);
    return false;
  }
};

export const getMembersAttendedThisMonth = async (
  members: MemberRecord[]
): Promise<MemberRecord[]> => {
  const pb = new Pocketbase(POCKETBASE_URL);
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

  const today = new Date();
  const currentMonth: number = today.getMonth();
  const currentYear: number = today.getFullYear();
  const firstDayInMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0);
  const firstDayString = firstDayInMonth.toISOString().slice(0, 10); // Format as "YYYY-MM-DD"

  // first get all the attendance records this month
  const attendanceList = await pb.collection("attendance").getFullList({
    filter: `check_in_date >= "${firstDayString} 00:00:00Z"`
  });

  // count the attendance of each member this month using the attendance list
  const numAttended = (memberId: string) => {
    let count = 0;
    for (let i = 0; i < attendanceList.length; i++) {
      if (attendanceList[i].member_id === memberId) {
        count++;
      }
    }
    return count;
  };

  // return the members and number of times they attended this month
  // only return members that have attended this month (greater than 0)
  const attendedMembers = members
    .map((member) => ({
      ...member,
      attendance: numAttended(member.id),
    }))
    .filter((member) => member.attendance > 0) as MemberRecord[];

  return attendedMembers;
};
