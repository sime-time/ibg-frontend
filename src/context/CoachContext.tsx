import {
  createContext,
  useContext,
  createSignal,
  ParentProps,
  createResource,
  Resource,
  Accessor,
} from "solid-js";
import { usePocket } from "./PocketbaseContext";
import { ClassRecord, MemberRecord } from "~/types/UserType";

interface CoachContextProps {
  classes: Resource<ClassRecord[]>,
  refetchClasses: (info?: unknown) => ClassRecord[] | Promise<ClassRecord[] | undefined> | null | undefined,
  members: Resource<MemberRecord[]>,
  refetchMembers: (info?: unknown) => MemberRecord[] | Promise<MemberRecord[] | undefined> | null | undefined,
  revenue: Resource<any>;
  monthsAgo: Accessor<number>;
}
const CoachContext = createContext<CoachContextProps>();

export function CoachContextProvider(props: ParentProps) {
  const { getClasses, getMembers } = usePocket();

  const [members, { mutate: mutateMembers, refetch: refetchMembers }] = createResource(async () => {
    return getMembers();
  });

  const [classes, { mutate: mutateClasses, refetch: refetchClasses }] = createResource(async () => {
    return getClasses();
  });

  const [monthsAgo, setMonthsAgo] = createSignal(6);
  const fetchRevenue = async (monthsAgo: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_POCKETBASE_URL}/revenue-data`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ monthsAgo }),
        }
      );
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error("Error fetching revenue (client): ", error);
      throw error;
    }
  };
  const [revenue] = createResource(() => fetchRevenue(monthsAgo()));



  return (
    <CoachContext.Provider
      value={{
        classes: classes,
        refetchClasses,
        members: members,
        refetchMembers,
        revenue,
        monthsAgo,
      }}
    >
      {props.children}
    </CoachContext.Provider>
  );
}

export const useCoachContext = () => useContext(CoachContext)!;
