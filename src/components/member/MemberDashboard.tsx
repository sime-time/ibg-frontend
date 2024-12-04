import { createSignal } from "solid-js";
import { usePocket } from "~/context/PocketbaseContext";
import { BsCreditCard2BackFill } from 'solid-icons/bs';
import { RiDesignEditFill } from 'solid-icons/ri';
import { FaRegularCalendarDays } from 'solid-icons/fa';
import LogoutButton from "../ui/LogoutButton";
import MemberEdit from "./MemberEdit";
import MemberSchedule from "./MemberSchedule";

export default function MemberDashboard() {
  const { user, logout } = usePocket();
  const [buttonsDisabled, setButtonsDisabled] = createSignal(false);

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

  const openSchedule = (e: Event) => {
    e.preventDefault();
    const dialog = document.getElementById("member-schedule-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  return (
    <div class="card bg-base-100 shadow-xl mx-4 my-1 w-full md:w-96">
      <div class="card-body flex flex-col gap-5">
        <h1 class="card-title text-2xl font-bold">{`Welcome, ${user()?.name}`}</h1>
        <button onClick={openSchedule} disabled={buttonsDisabled()} class="btn btn-accent">
          {buttonsDisabled() ? <span class="loading loading-spinner loading-md"></span> : <><FaRegularCalendarDays class="size-5" /> Class Schedule</>}
        </button>
        <button onClick={handleManageSubscription} disabled={buttonsDisabled()} class="btn btn-accent">
          {buttonsDisabled() ? <span class="loading loading-spinner loading-md"></span> : <><BsCreditCard2BackFill class="size-5" /> Manage Subscription</>}
        </button>
        <MemberEdit />
        <LogoutButton />
      </div>
      <MemberSchedule />
    </div>
  );
}