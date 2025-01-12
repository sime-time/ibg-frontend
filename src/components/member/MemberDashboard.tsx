import { createEffect, createSignal, Show, onMount } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { BsCreditCard2BackFill } from 'solid-icons/bs';
import { FaSolidArrowLeft, FaRegularCalendarDays } from 'solid-icons/fa';
import LogoutButton from "../ui/LogoutButton";
import MemberEdit from "./MemberEdit";
import FullSchedule from "../schedule/readonly/FullSchedule";
import EmailVerifyToast from "../auth/EmailVerifyToast";

export default function MemberDashboard() {
  const { user, getAvatarUrl } = usePocket();
  const [buttonsDisabled, setButtonsDisabled] = createSignal(false);
  const [scheduleIsOpen, setScheduleIsOpen] = createSignal(false);
  const [avatarUrl, setAvatarUrl] = createSignal("");

  createEffect(async () => {
    let url: string = await getAvatarUrl();
    setAvatarUrl(url);
  });

  const handleManageSubscription = (async (e: Event) => {
    e.preventDefault();
    setButtonsDisabled(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/customer-portal`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          customerId: user()?.stripe_customer_id
        })
      });

      const data = await response.json();
      if (response.ok && data.url) {
        // redirect to customer portal link
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error opening customer portal: ", error);
    } finally {
      setButtonsDisabled(false);
    }
  });

  return (
    <Show when={!scheduleIsOpen()} fallback={
      <div class="flex flex-col gap-6 w-5/6">
        <button onClick={() => setScheduleIsOpen(false)} class="btn items-center flex md:hidden"><FaSolidArrowLeft />Back</button>
        <FullSchedule />
        <button onClick={() => setScheduleIsOpen(false)} class="btn items-center flex"><FaSolidArrowLeft />Back</button>
      </div>
    }>
      <div class="card bg-base-100 shadow-xl mx-4 my-1 w-full md:w-96">
        <div class="card-body flex flex-col gap-5">
          <div class="flex flex-row gap-3">
            <div class="avatar">
              <div class="mask mask-squircle h-12 w-12">
                <Show when={avatarUrl()} fallback={<div class="flex items-center justify-center"><span class="loading loading-spinner loading-md"></span></div>}>
                  <img
                    src={avatarUrl()}
                    alt="Member Avatar" />
                </Show>
              </div>
            </div>
            <h1 class="card-title text-2xl font-bold">{user()?.name}</h1>
          </div>
          <button onClick={() => setScheduleIsOpen(true)} class="btn btn-accent">
            <FaRegularCalendarDays class="size-5" /> Class Schedule
          </button>
          <button onClick={handleManageSubscription} disabled={buttonsDisabled()} class="btn btn-accent">
            {buttonsDisabled() ? <span class="loading loading-spinner loading-md"></span> : <><BsCreditCard2BackFill class="size-5" /> Manage Subscription</>}
          </button>
          <MemberEdit />
          <LogoutButton />
        </div>
      </div>
      <Show when={!user()?.verified}>
        <EmailVerifyToast email={user()?.email} />
      </Show>
    </Show>
  );
}
