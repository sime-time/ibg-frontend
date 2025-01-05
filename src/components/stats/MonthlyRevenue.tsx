import Chart, { ChartItem } from "chart.js/auto";
import { createSignal, onMount, Show } from "solid-js";

const getShortMonthNames = (labels: string[]): string[] => {
  return labels.map(label => {
    const [year, month] = label.split('-').map(Number);
    const date = new Date(year, month - 1); // months are 0-indexed in JS
    return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  });
};

export default function MonthlyRevenue() {
  const [data, setData] = createSignal<number[]>([]);
  const [labels, setLabels] = createSignal<string[]>([]);
  const [fetchCompleted, setFetchCompleted] = createSignal(false);

  type RevenueData = Record<string, number>;

  const fetchRevenue = async (monthsAgo: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/revenue-data`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ monthsAgo }),
      });
      if (response.ok) {
        const revenue: RevenueData = await response.json();
        setData(Object.values(revenue));
        const months = getShortMonthNames(Object.keys(revenue));
        setLabels(months);
        setFetchCompleted(true);
      }
    } catch (error) {
      console.error("Error fetching revenue (client): ", error);
    }
  }

  let canvasRef!: HTMLCanvasElement;
  const makeChart = async () => {
    const ctx = canvasRef.getContext("2d") as ChartItem;
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels(),
        datasets: [
          {
            label: "Monthly Revenue",
            data: data(),
            borderColor: "#4CAF50", // Softer green line
            backgroundColor: "rgba(76, 175, 80, 0.2)", // Lighter green fill
            borderWidth: 4, // Moderate line thickness
            pointRadius: 6, // Slightly smaller dots
            pointHoverRadius: 8, // Larger dots on hover
            pointBackgroundColor: "#36B37E", // Matching green circles
            tension: 0.3, // Smooth curves
            fill: true, // Fill under the line
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#ffffff", // White legend text
              font: {
                size: 16, // Slightly smaller legend font
                weight: "bold",
              },
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "#ffffff", // White tooltip background
            titleColor: "#1f202a", // Dark title text
            bodyColor: "#1f202a", // Dark body text
            titleFont: {
              size: 14,
            },
            bodyFont: {
              size: 20,
              weight: "bold",
            },
            padding: 12, // Comfortable padding for tooltip
            titleSpacing: 4,
            bodySpacing: 4,
            boxPadding: 6,
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `$${value.toLocaleString()}`; // Format values with commas
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: false,
              text: "Month",
              color: "#ffffff", // White axis title
              font: {
                size: 18,
                weight: "bold",
              },
            },
            ticks: {
              color: "#ffffff", // White text for x-axis
              font: {
                size: 18,
              },
              padding: 12, // Extra spacing between ticks and axis
            },
            grid: {
              display: false, // Remove x-axis grid lines
            },
          },
          y: {
            title: {
              display: false,
              text: "Revenue (USD)",
              color: "#ffffff", // White axis title
              font: {
                size: 18,
                weight: "bold",
              },
            },
            ticks: {
              color: "#ffffff", // White text for y-axis
              font: {
                size: 14,
              },
              padding: 12, // Extra spacing between ticks and axis
              callback: (value) => `$${Number(value).toLocaleString()}`, // Format values with commas
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)", // Subtle gridlines
            },
            beginAtZero: true, // Start y-axis at 0
          },
        },
      },
    });
    // end of chart
  }

  onMount(async () => {
    fetchRevenue(6).then(makeChart);
  });

  return (
    <div class="w-full md:w-2/3">
      <Show when={!fetchCompleted()}>
        <div class="flex flex-col justify-center items-center gap-5">
          <p>Gathering 6 months of payment data. Please wait...</p>
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      </Show>
      <canvas ref={canvasRef}></canvas>
    </div >
  );
}
