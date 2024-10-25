import { Accessor, createContext, useContext, createSignal, createEffect, ParentProps } from "solid-js";
import Pocketbase, { AuthModel } from "pocketbase";
import { PhoneType } from "~/enums/PhoneType";

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
  getPhone: (phoneType: PhoneType) => Promise<string>,
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
      // fetch phone type IDs from database 
      const personalPhoneType = await pb.collection("phone_type").getFirstListItem(`name="${PhoneType.Personal}"`);
      const emergencyPhoneType = await pb.collection("phone_type").getFirstListItem(`name="${PhoneType.Emergency}"`);
      console.log("PersonalPhoneID: ", personalPhoneType.id);
      console.log("EmergencyPhoneID: ", emergencyPhoneType.id);

      const newPhone = {
        "phone_number": contactInfo.phone,
        "phone_type_id": personalPhoneType.id,
        "description": `${user()?.name}'s Personal`,
        "member_id": user()?.id
      }

      const newEmergencyPhone = {
        "phone_number": contactInfo.emergencyPhone,
        "phone_type_id": emergencyPhoneType.id,
        "description": contactInfo.emergencyName,
        "member_id": user()?.id
      }

      await pb.collection("member_phone").create(newPhone);
      await pb.collection("member_phone").create(newEmergencyPhone);

      console.log("Contact info added successfully!");
      return true;

    } catch (err) {
      console.error("Error adding contact info: ", err);
      return false;
    }
  }

  const getPhone = async (phoneType: PhoneType) => {
    try {
      // fetch phone type ID from database 
      console.log(`Fetching ${phoneType} phone number...`);
      const phoneTypeRecord = await pb.collection("phone_type").getFirstListItem(`name="${phoneType}"`);
      const record = await pb.collection("member_phone").getFirstListItem(`phone_type_id="${phoneTypeRecord.id}" && member_id="${user()?.id}"`)
      const phoneNumber: string = record.phone_number;
      console.log(phoneNumber);
      return phoneNumber;
    } catch (err) {
      console.error("Error fetching phone number: ", err);
      return "";
    }
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


  return (
    <PocketbaseContext.Provider value={{ token, user, signup, loginMember, loginAdmin, logout, userIsAdmin, userIsMember, addContactInfo, getPhone }} >
      {props.children}
    </PocketbaseContext.Provider>
  );
}

export const usePocket = () => useContext(PocketbaseContext)!;