import { usePocket } from "~/context/PocketbaseContext";
import { createResource, For, onMount } from "solid-js";

export default function MembersAcquired() {
  const { getMembers } = usePocket();

  const [members, { mutate, refetch }] = createResource(async () => {
    return getMembers();
  });

  let memberProgramMap = new Map<string, number>();

  onMount(async () => {
    for (let i = 0; i < members()!.length - 1; i++) {
      const program: string = members()![i].program;
      //check if key exists first
      let exists = memberProgramMap.has(program);
      if (exists) {
        let currentVal: number = memberProgramMap.get(program) || 0;
        memberProgramMap.set(program, currentVal + 1);
      } else {
        memberProgramMap.set(program, 1);
      }
    }
    console.log(memberProgramMap);
  });

  return (
    <div>
      <For each={Array.from(memberProgramMap.entries())}>
        {([key, value]) => (
          <div>
            {key}: {value}
          </div>
        )}
      </For>
    </div>
  );
}
