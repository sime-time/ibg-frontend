import { Accessor, createContext, useContext, createSignal, createEffect, ParentProps, createResource } from "solid-js";
import Pocketbase, { AuthModel, RecordModel, RecordListOptions, RecordFullListOptions } from "pocketbase";
import { ClassData } from "~/types/ValidationType";

interface PocketbaseContextProps {
  token: Accessor<string>,
  user: Accessor<AuthModel>,
  signup: (newMember: MemberData) => Promise<boolean>,
  loginMember: (email: string, password: string) => Promise<boolean>,
  loginAdmin: (email: string, password: string) => Promise<boolean>,
  logout: () => void,
  loggedIn: () => boolean,
  userIsAdmin: () => boolean,
  userIsMember: () => boolean,
  addContactInfo: (contactInfo: ContactInfo) => Promise<boolean>,
  refreshMember: () => Promise<void>,
  getEmergencyContact: () => Promise<{ phone: string; name: string; }>,
  getMemberEmergencyContact: (memberId: string) => Promise<{ id: string, phone: string; name: string; }>,
  updateMember: (memberId: string, updatedData: UpdateMemberData) => Promise<void>,
  getMember: (memberId: string) => Promise<MemberRecord>,
  getMembers: () => Promise<MemberRecord[]>,
  deleteMember: (memberId: string) => Promise<void>,
  createMember: (newMember: MemberData, newContact: ContactInfo) => Promise<boolean>,
  getMartialArtId: (shortname: string) => Promise<string>,
  getMartialArts: () => Promise<MartialArtRecord[]>,
  createClass: (newClass: ClassData) => Promise<boolean>,
  updateClass: (classId: string, updatedClass: ClassData) => Promise<boolean>,
  getClasses: () => Promise<ClassRecord[]>,
  getClassesFromDay: (day: number) => Promise<ClassRecord[]>,
  getClass: (id: string) => Promise<ClassRecord>,
  deleteClass: (classId: string) => Promise<boolean>,
}

export interface MemberData {
  name: string,
  email: string,
  emailVisibility: boolean,
  password: string,
  passwordConfirm: string
}

export interface ContactInfo {
  phone: string,
  emergencyName: string,
  emergencyPhone: string,
}

export interface UpdateMemberData {
  name?: string,
  email?: string,
  newPassword?: string,
  oldPassword?: string,
  phone?: string,
  emergencyName?: string,
  emergencyPhone?: string,
}

export interface MemberRecord extends RecordModel {
  id: string;
  name: string;
  email: string;
  is_subscribed: string;
  program: string;
  phone_number: string;
  stripe_customer_id: string;
}

export interface ClassRecord extends RecordModel {
  id: string;
  date: Date;
  martial_art: string;
  is_recurring: boolean;
  active: boolean;
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
  week_day: number;
}

export interface MartialArtRecord extends RecordModel {
  id: string;
  name: string;
  shortname: string;
}

const PocketbaseContext = createContext<PocketbaseContextProps>();

export function PocketbaseContextProvider(props: ParentProps) {
  const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

  const [token, setToken] = createSignal(pb.authStore.token);
  const [user, setUser] = createSignal(pb.authStore.model);

  createEffect(() => {
    return pb.authStore.onChange((tkn, model) => {
      setToken(tkn);
      setUser(model);
    });
  });

  const logout = () => {
    console.log("Logging out...");
    pb.authStore.clear();
  };

  const signup = async (newMember: MemberData) => {
    if (!userIsAdmin()) {
      await pb.admins.authWithPassword(
        import.meta.env.VITE_POCKETBASE_EMAIL,
        import.meta.env.VITE_POCKETBASE_PASSWORD
      );
    }
    await pb.collection("member").create(newMember);
    console.log("New member created: ", newMember.name);
    return await loginMember(newMember.email, newMember.password);
  };

  const createMember = async (newMember: MemberData, newContact: ContactInfo) => {
    try {
      if (!userIsAdmin()) {
        throw new Error("User is not an admin. Cannot create new member.")
      }
      const memberCreated = await pb.collection("member").create(newMember)
      console.log("New member created: ", memberCreated.name);

      const memberPhone = {
        "phone_number": newContact.phone,
      }

      const emergencyContact = {
        "phone_number": newContact.emergencyPhone,
        "name": newContact.emergencyName,
        "member_id": memberCreated.id
      }

      await pb.collection("member").update(memberCreated.id, memberPhone);
      await pb.collection("member_emergency").create(emergencyContact);
      console.log("Contact info added to member");

      return true;

    } catch (err) {
      console.error("Create member cancelled: ", err);
      return false;
    }
  }

  const loginMember = async (email: string, password: string) => {
    logout();
    const response = await pb.collection("member").authWithPassword(email, password);
    return pb.authStore.isValid;
  };

  const loginAdmin = async (email: string, password: string) => {
    logout();
    const response = await pb.admins.authWithPassword(email, password);
    return pb.authStore.isValid && pb.authStore.isAdmin;
  };

  const loggedIn = () => {
    return pb.authStore.isValid;
  };

  const userIsAdmin = () => {
    return pb.authStore.isValid && pb.authStore.isAdmin;
  };

  const userIsMember = () => {
    return pb.authStore.isValid && !pb.authStore.isAdmin;
  };

  const addContactInfo = async (contactInfo: ContactInfo) => {
    try {
      const memberPhone = {
        "phone_number": contactInfo.phone,
      }

      const emergencyContact = {
        "phone_number": contactInfo.emergencyPhone,
        "name": contactInfo.emergencyName,
        "member_id": user()?.id
      }

      await pb.collection("member").update(user()?.id, memberPhone);
      await pb.collection("member_emergency").create(emergencyContact);

      console.log("Contact info added successfully!");
      return true;

    } catch (err) {
      console.error("Error adding contact info: ", err);
      return false;
    }
  };

  const getEmergencyContact = async () => {
    const emergencyRecord = await pb.collection("member_emergency").getFirstListItem(`member_id="${user()?.id}"`);
    return {
      phone: String(emergencyRecord.phone_number),
      name: String(emergencyRecord.name)
    };
  };

  const getMemberEmergencyContact = async (memberId: string) => {
    const emergencyRecord = await pb.collection("member_emergency").getFirstListItem(`member_id="${memberId}"`);
    return {
      id: String(emergencyRecord.id),
      phone: String(emergencyRecord.phone_number),
      name: String(emergencyRecord.name)
    };
  }

  const updateMember = async (memberId: string, updatedData: UpdateMemberData) => {

    const updateMemberRecord = {
      "name": updatedData.name,
      "oldPassword": updatedData.oldPassword,
      "password": updatedData.newPassword,
      "passwordConfirm": updatedData.newPassword,
      "phone_number": updatedData.phone,
    }

    const updateEmergencyRecord = {
      "phone_number": updatedData.emergencyPhone,
      "name": updatedData.emergencyName,
    }

    // update member 
    try {
      await pb.collection("member").update(memberId, updateMemberRecord);
    } catch (err) {
      console.error("Error updating member: ", err)
    }

    // update emergency contact 
    try {
      const emergencyRecord = await pb.collection("member_emergency").getFirstListItem(`member_id="${memberId}"`);
      await pb.collection("member_emergency").update(emergencyRecord.id, updateEmergencyRecord);
    } catch (err) {
      console.error("Error updating emergency contact: ", err)
    }
  };


  const refreshMember = async () => {
    // requires a valid record auth to be set 
    try {
      if (pb.authStore.isValid) {
        await testPocketbase()
        await pb.collection("member").authRefresh();
      } else {
        throw new Error("Auth store invalid");
      }
    } catch (err) {
      console.log("Auth store: ", pb.authStore)
      console.log("Is Auth store valid: ", pb.authStore.isValid)
      console.error(err)
    }
  };

  const getMember = async (memberId: string) => {
    const member = await pb.collection("member").getOne<MemberRecord>(memberId);
    return member;
  };

  const getMembers = async () => {
    const members = await pb.collection("member").getFullList<MemberRecord>();
    return members;
  };

  const deleteMember = async (memberId: string) => {
    try {
      if (!userIsAdmin()) {
        throw new Error("Deletion cancelled. User is not admin.");
      }

      // cancel stripe subscription 
      const member = await pb.collection("member").getOne(memberId);
      if (member.is_subscribed) {
        const cancelled = await cancelSubscription(member.stripe_customer_id);
        if (!cancelled) {
          throw new Error("Active subscription was not cancelled. Member not deleted.")
        } else {
          console.log("Member subscription cancelled");
        }
      } else {
        console.log("Member has no active subscription");
      }

      // delete emergency contact 
      try {
        const emergencyRecord = await getMemberEmergencyContact(memberId);
        await pb.collection("member_emergency").delete(emergencyRecord.id).then(() => {
          console.log("Emergency contact deleted.")
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

  const cancelSubscription = async (stripeCustomerId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/cancel-subscription`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          customerId: stripeCustomerId
        }),
      });

      console.log("Response: ", response);

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error("Error cancelling subscription: ", error);
    }
    return false;
  };

  // client side needs to use the shortname so the database id is not exposed 
  const getMartialArtId = async (shortname: string) => {
    try {
      const record = await pb.collection("martial_art").getFirstListItem(`shortname="${shortname}"`);
      return record.id;
    } catch (err) {
      console.error("Could not find martial art id: ", err);
      return "";
    }
  };

  const getMartialArts = async () => {
    const martialArts = await pb.collection("martial_art").getFullList<MartialArtRecord>();
    return martialArts;
  }

  const testPocketbase = async () => {
    try {
      console.log('Testing PB connection...');
      const response = await pb.health.check();
      console.log('PB health check response:', response);
    } catch (error) {
      console.error('PB connection test failed:', error);
    }
  };

  const createClass = async (newClass: ClassData) => {
    if (!userIsAdmin()) {
      return false;
    }
    await pb.collection("class").create(newClass);
    console.log("New class created!");
    return true;
  };

  const updateClass = async (classId: string, updatedClass: ClassData) => {
    try {
      await pb.collection("class").update(classId, updatedClass);
      return true;
    } catch (err) {
      console.error("Error updating class: ", err);
      return false;
    }
  };

  const deleteClass = async (classId: string) => {
    try {
      if (!userIsAdmin()) {
        throw new Error("Deletion cancelled. User is not admin.");
      }
      await pb.collection("class").delete(classId);
      return true;
    } catch (err) {
      console.error("Error deleting class: ", err);
      return false;
    }
  }

  const getClasses = async () => {
    try {
      const classes = await pb.collection("class").getFullList<ClassRecord>();
      return classes;
    } catch (err) {
      console.error("Error fetching classes: ", err);
      return [];
    }
  };

  const getClassesFromDay = async (day: number) => {
    // get all classes that occur on this day of the week
    try {
      const classes = await pb.collection("class").getFullList<ClassRecord>(100);
      return classes;
    } catch (err) {
      console.error("Error fetching classes", err);
      return [];
    }
  };

  const getClass = async (id: string) => {
    const record = await pb.collection("class").getOne<ClassRecord>(id);
    return record;
  };

  return (
    <PocketbaseContext.Provider value={{ token, user, signup, loginMember, loginAdmin, logout, userIsAdmin, userIsMember, addContactInfo, refreshMember, getEmergencyContact, getMemberEmergencyContact, updateMember, getMembers, getMember, deleteMember, createMember, loggedIn, getMartialArtId, getMartialArts, createClass, updateClass, getClasses, getClassesFromDay, getClass, deleteClass }} >
      {props.children}
    </PocketbaseContext.Provider>
  );
}

export const usePocket = () => useContext(PocketbaseContext)!;