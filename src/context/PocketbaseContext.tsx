import {
  Accessor,
  createContext,
  useContext,
  createSignal,
  createEffect,
  ParentProps,
} from "solid-js";
import Pocketbase, { AuthModel } from "pocketbase";
import { ClassData, MemberPasswordData } from "~/types/ValidationType";
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
import {
  signup,
  loginMember,
  loginAdmin,
  addContactInfo,
  refreshMember,
  getEmergencyContact,
  updatePassword,
  updateMember,
  getMembers,
  getMember,
  deleteMember,
  getMartialArtId,
  getMartialArts,
  createClass,
  updateClass,
  getClasses,
  getClass,
  deleteClass,
  getAvatarUrl,
  checkIn,
  checkOut,
  getMemberAttendance,
  requestVerification,
  requestEmailChange,
  requestPasswordReset,
  waiverTimestamp,
  memberPayWithCash,
  getMembersAttendedThisMonth
} from "~/server/pocketbaseServer";

interface PocketbaseContextType {
  user: Accessor<AuthModel>;
  signup: (newMember: MemberData) => Promise<boolean>;
  loginMember: (email: string, password: string) => Promise<boolean>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loggedIn: () => boolean;
  userIsAdmin: () => boolean;
  userIsMember: () => boolean;
  addContactInfo: (contactInfo: ContactInfo, memberId: string) => Promise<boolean>
  refreshMember: () => Promise<boolean>;
  getEmergencyContact: (memberId: string) => Promise<{ id: string, phone: string; name: string }>;
  updatePassword: (
    memberId: string,
    memberEmail: string,
    p: MemberPasswordData
  ) => Promise<PasswordUpdateResult>;
  updateMember: (
    memberId: string,
    updatedData: UpdateMemberData
  ) => Promise<void>;
  getMember: (memberId: string) => Promise<MemberRecord>;
  getMembers: () => Promise<MemberRecord[]>;
  deleteMember: (memberId: string) => Promise<void>;
  getMartialArtId: (shortname: string) => Promise<string>;
  getMartialArts: () => Promise<MartialArtRecord[]>;
  createClass: (newClass: ClassData) => Promise<boolean>;
  updateClass: (classId: string, updatedClass: ClassData) => Promise<boolean>;
  getClasses: () => Promise<ClassRecord[]>;
  getClass: (id: string) => Promise<ClassRecord>;
  deleteClass: (classId: string) => Promise<boolean>;
  getAvatarUrl: (memberId: string) => Promise<string>;
  checkIn: (date: Date, memberId: string) => Promise<boolean>;
  checkOut: (date: Date, memberId: string) => Promise<boolean>;
  getMemberAttendance: (date: Date) => Promise<MemberRecord[]>;
  requestVerification: (email: string) => Promise<boolean>;
  requestEmailChange: (
    newEmail: string,
    currentEmail: string
  ) => Promise<{ success: boolean; message: string }>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  waiverTimestamp: (memberId: string, time: Date) => Promise<boolean>;
  memberPayWithCash: (
    memberId: string,
    selected: boolean,
    program: string
  ) => Promise<boolean>;
  getMembersAttendedThisMonth: (members: MemberRecord[]) => Promise<MemberRecord[]>;
}
const PocketbaseContext = createContext<PocketbaseContextType>();

// Get the existing auth data from `localStorage`
const getInitialAuth = () => {
  if (typeof window === "undefined") return { token: null, user: null }; // Prevent server-side errors

  const storedAuth = localStorage.getItem("pocketbase_auth");
  if (!storedAuth) return { token: null, user: null };

  try {
    const parsedAuth = JSON.parse(storedAuth);
    return { token: parsedAuth.token, user: parsedAuth.model }; // ✅ Extract token & user model
  } catch (error) {
    console.error("Error parsing pocketbase_auth:", error);
    return { token: null, user: null };
  }
};

export function PocketbaseContextProvider(props: ParentProps) {
  const { token: initialToken, user: initialUser } = getInitialAuth();
  const [token, setToken] = createSignal<string | null>(initialToken);
  const [user, setUser] = createSignal<any>(initialUser);

  const saveAuth = (thisToken: string | null, thisUser: any) => {
    setToken(thisToken);
    setUser(thisUser);
    if (thisToken != null) {
      localStorage.setItem("pocketbase_auth", JSON.stringify({ token: thisToken, model: thisUser }));
    } else {
      localStorage.removeItem("pocketbase_auth");
    }
  };

  createEffect(() => {
    saveAuth(token(), user());
  });

  const signupClient = async (newMember: MemberData): Promise<boolean> => {
    try {
      const auth: TokenUser = await signup(newMember);
      saveAuth(auth.token, auth.user)
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };


  const loginAdminClient = async (email: string, password: string) => {
    const auth = await loginAdmin(email, password);
    saveAuth(auth.token, auth.user);
    return !!auth.token; // turn a string into a boolean with double !
  };

  const loginMemberClient = async (email: string, password: string) => {
    const auth = await loginMember(email, password);
    saveAuth(auth.token, auth.user);
    return !!auth.token;
  };

  const logout = () => {
    saveAuth(null, null);
  };

  const loggedIn = () => {
    return token() !== null;
  };

  const userIsAdmin = () => {
    return loggedIn() && user()?.collectionName === "admins";
  };

  const userIsMember = () => {
    return loggedIn() && user()?.collectionName === "member";
  };

  const refreshMemberClient = async () => {
    const result = await refreshMember(token());
    if (result.token) {
      saveAuth(result.token, result.user);
      return true;
    } else {
      return false;
    }
  }



  return (
    <PocketbaseContext.Provider
      value={{
        user,
        signup: signupClient,
        loginMember: loginMemberClient,
        loginAdmin: loginAdminClient,
        logout,
        loggedIn,
        userIsAdmin,
        userIsMember,
        addContactInfo,
        refreshMember: refreshMemberClient,
        getEmergencyContact,
        updatePassword,
        updateMember,
        getMembers,
        getMember,
        deleteMember,
        getMartialArtId,
        getMartialArts,
        createClass,
        updateClass,
        getClasses,
        getClass,
        deleteClass,
        getAvatarUrl,
        checkIn,
        checkOut,
        getMemberAttendance,
        requestVerification,
        requestEmailChange,
        requestPasswordReset,
        waiverTimestamp,
        memberPayWithCash,
        getMembersAttendedThisMonth
      }}
    >
      {props.children}
    </PocketbaseContext.Provider>
  );
}

export const usePocket = () => useContext(PocketbaseContext)!;
