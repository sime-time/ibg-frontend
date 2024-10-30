import { createResource, For, Show, Suspense } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { FaRegularTrashCan, FaSolidPhone } from "solid-icons/fa";
import { BiSolidEdit } from "solid-icons/bi";

function TableHeaders() {
  return <>
    <tr>
      <th>Name</th>
      <th>Martial Art</th>
      <th>Phone</th>
      <th>Emergency Contact</th>
      <th>Subscription</th>
      <th>Edit</th>
      <th>Delete</th>
    </tr>
  </>;
}

export function MemberTable() {
  const { getMembers } = usePocket();
  const [members, { mutate, refetch }] = createResource(async () => {
    return getMembers();
  });

  return (
    <div class="overflow-x-auto whitespace-nowrap block">
      <Suspense fallback={<span class="loading loading-spinner loading-md"></span>}>
        <table class="table bg-base-100 ">
          <thead>
            <TableHeaders />
          </thead>

          <tbody>
            <For each={members()}>
              {(member, index) =>
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="avatar">
                        <div class="mask mask-squircle h-12 w-12">
                          <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component" />
                        </div>
                      </div>
                      <div>
                        <div class="font-bold">{member.name}</div>
                        <div class="text-sm opacity-50">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-neutral">{member.program ? member.program : "N/A"}</span>
                  </td>
                  <td>
                    <a href={`tel:${member.phone_number}`} class="btn btn-sm btn-outline btn-secondary text-xs"><FaSolidPhone class="size-4" /> Call</a>
                  </td>
                  <td>
                    <a href={`tel:${member.emergency_phone}`} class="btn btn-sm btn-outline btn-primary text-xs"><FaSolidPhone class="size-4" /> {member.emergency_name}</a>
                  </td>
                  <td>
                    {member.is_subscribed
                      ? <span class="badge badge-success">Paid</span>
                      : <span class="badge badge-error">Not Paid</span>
                    }
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm"><BiSolidEdit class="size-5" /></button>
                  </td>
                  <td>
                    <button class="btn btn-primary btn-sm "><FaRegularTrashCan class="size-5" /></button>
                  </td>
                </tr>
              }
            </For>
          </tbody>

          <tfoot>
            <TableHeaders />
          </tfoot>

        </table>
      </Suspense>
    </div>
  );
}