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
}

interface MemberData {
  name: string,
  email: string,
  emailVisibility: boolean,
  password: string,
  passwordConfirm: string
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
    <PocketbaseContext.Provider value={{ token, user, signup, loginMember, loginAdmin, logout, userIsAdmin, userIsMember }} >
      {props.children}
    </PocketbaseContext.Provider>
  );
}

export const usePocket = () => useContext(PocketbaseContext)!;