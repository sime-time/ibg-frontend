import Chart, { ChartItem } from "chart.js/auto";
import { createEffect } from "solid-js";

const getShortMonthNames = (labels: string[]): string[] => {
  return labels.map(label => {
    const [year, month] = label.split('-').map(Number);
    const date = new Date(year, month - 1); // months are 0-indexed in JS
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  });
};

interface MonthlyRevenueProps {
  revenueData: Record<string, number>;
}

export default function MonthlyRevenue(props: MonthlyRevenueProps) {
  let canvasRef!: HTMLCanvasElement;


  createEffect(async () => {
    const data = props.revenueData;
    if (data && canvasRef) {
      const values: number[] = Object.values(data);
      const months = getShortMonthNames(Object.keys(data));
      makeChart(values, months);
    }
  });

  const makeChart = async (chartData: number[], chartLabels: string[]) => {
    const ctx = canvasRef.getContext("2d") as ChartItem;
    new Chart(ctx, {
      type: "bar", // Changed from "line" to "bar"
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "USD",
            data: chartData,
            backgroundColor: "rgba(76, 175, 80, 0.2)", // Color of the bars
            borderColor: "#36B37E", // Border color of the bars
            borderWidth: 1,
            // pointRadius, tension, fill are not applicable to bar charts
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Monthly Revenue",
            color: "#ffffff",
            fullSize: true,
            font: {
              weight: 'bold',
              size: 24,
            }
          },
          legend: {
            display: true,
            position: "bottom",
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
  };



  return (
    <div class="w-full max-w-4xl mx-auto p-4 min-h-64 md:min-h-0">
      <canvas ref={canvasRef}></canvas>
    </div >
  );
}
