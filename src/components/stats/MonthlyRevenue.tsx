import Chart, { ChartItem } from "chart.js/auto";
import { createSignal, onMount, Show, Resource, Accessor } from "solid-js";
import { type RevenueData } from "./Revenue";

interface MonthlyRevenueProps {
  revenue: Resource<RevenueData | undefined>;
  fetchCompleted: Accessor<boolean>;
}
export default function MonthlyRevenue(props: MonthlyRevenueProps) {
  const data = Object.values(props.revenue);
  const labels = Object.values(props.revenue);
  let canvasRef!: HTMLCanvasElement;

  const makeChart = async () => {
    const ctx = canvasRef.getContext("2d") as ChartItem;
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Revenue by Month",
          data: data,
        }]
      },
    });
  }

  onMount(async () => {
    makeChart();
  });

  return (
    <div>
      <Show when={!props.fetchCompleted()}>
        <div class="flex justify-center"><span class="loading loading-spinner loading-lg"></span></div>
      </Show>
      <canvas ref={canvasRef}></canvas>
    </div >
  );
}
