import { Accessor, createContext, useContext, createSignal, createEffect, ParentProps } from "solid-js";
import Pocketbase, { AuthModel } from "pocketbase";

interface PocketbaseContextProps {
  token: Accessor<string>,
  user: Accessor<AuthModel>,
  signup: (newMember: MemberData) => Promise<boolean>,
  loginMember: (email: string, password: string) => Promise<boolean>,
  loginAdmin: (email: string, password: string) => Promise<boolean>,
  logout: () => void,
  userIsAdmin: () => boolean,
  userIsMember: () => boolean,
  addContactInfo: (contactInfo: ContactInfo) => Promise<boolean>,
  refreshMember: () => Promise<void>,
  getEmergencyContact: () => Promise<{ phone: string; name: string; }>
}

interface MemberData {
  name: string,
  email: string,
  emailVisibility: boolean,
  password: string,
  passwordConfirm: string
}

interface ContactInfo {
  phone: string,
  emergencyName: string,
  emergencyPhone: string,
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
    pb.authStore.clear();
  };

  const signup = async (newMember: MemberData) => {
    logout();
    await pb.admins.authWithPassword(
      import.meta.env.VITE_POCKETBASE_EMAIL,
      import.meta.env.VITE_POCKETBASE_PASSWORD
    );
    await pb.collection("member").create(newMember);
    console.log("New member created: ", newMember.name);
    return await loginMember(newMember.email, newMember.password);
  };

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

  const userIsAdmin = () => {
    return pb.authStore.isValid && pb.authStore.isAdmin;
  }

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
        "description": contactInfo.emergencyName,
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
    const emergencyRecord = await pb.collection("member_emergency").getFirstListItem(`member_id="${user()?.id}`);
    return {
      phone: String(emergencyRecord.phone_number),
      name: String(emergencyRecord.description)
    };
  };

  const refreshMember = async () => {
    // requires a valid record auth to be set 
    try {
      if (pb.authStore.isValid) {
        await pb.collection("member").authRefresh();
      }
    } catch (err) {
      console.error("Auth refresh error: ", err)
    }
  };

  const testPocketbase = async () => {
    try {
      console.log('Testing PB connection...');
      const response = await pb.health.check();
      console.log('PB health check response:', response);
    } catch (error) {
      console.error('PB connection test failed:', error);
    }
  };


  return (
    <PocketbaseContext.Provider value={{ token, user, signup, loginMember, loginAdmin, logout, userIsAdmin, userIsMember, addContactInfo, refreshMember, getEmergencyContact, }} >
      {props.children}
    </PocketbaseContext.Provider>
  );
}

export const usePocket = () => useContext(PocketbaseContext)!;