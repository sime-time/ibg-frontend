import MonthlyRevenue from "./MonthlyRevenue";
import { Resource } from "solid-js";
import { RevenueData } from "./Revenue";

interface StatsProps {
  revenue: Resource<RevenueData | undefined>;
}

export default function Stats(props: StatsProps) {
  return (
    <MonthlyRevenue revenue={props.revenue} />
  );
}
