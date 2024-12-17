import { createContext, ParentProps } from "solid-js";

const MemberListContext = createContext();

export function MemberListContextProvider(props: ParentProps) => {
  return (
    <MemberListContext.Provider>
      {props.children}
    </MemberListContext.Provider>
  );
}
