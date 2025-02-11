import { Resource } from "solid-js";
import { MemberRecord } from "~/types/UserType";
import { FaSolidFileInvoiceDollar } from 'solid-icons/fa'
import { AiOutlineUserAdd } from 'solid-icons/ai'
import { FaSolidUserPlus } from 'solid-icons/fa'
import { RiUserFacesUserAddFill } from 'solid-icons/ri'

interface StatsProps {
  members: Resource<MemberRecord[]>;
  revenue: Record<string, number>;
}

export default function Stats(props: StatsProps) {
  const totalRevenue = Object.values(props.revenue).reduce((sum, value) => sum + value, 0);
  function toDollarString(num: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  }

  return (
    <div class="stats shadow">

      <div class="stat">
        <div class="stat-figure text-[#4CAF50] mt-2">
          <FaSolidFileInvoiceDollar class="size-10" />
        </div>
        <div class="stat-title">Total Revenue</div>
        {/* Same green color as MonthlyRevenue chart */}
        <div class="stat-value text-[#4CAF50]">{toDollarString(totalRevenue)}</div>
        <div class="stat-desc">Subscription payments</div>
      </div>

      <div class="stat flex items-center justify-center flex-row-reverse">
        <div class="stat-figure text-primary mt-2">
          <FaSolidUserPlus class="size-10" />
        </div>
        <div>
          <div class="stat-title">Total Members</div>
          <div class="stat-value text-primary">{props.members()?.length}</div>
          <div class="stat-desc">Signed up</div>

        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary mt-2">
          <div class="avatar">
            <div class="w-16 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
        </div>
        <div class="stat-title">Top Attendance</div>
        <div class="stat-value text-secondary">24</div>
        <div class="stat-desc">Days attended this month</div>
      </div>
    </div>
  );
}
