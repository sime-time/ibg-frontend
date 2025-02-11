import { createEffect, Resource } from "solid-js";
import Chart from "chart.js/auto";
import type { ChartData, ChartOptions } from "chart.js";
import type { MemberRecord } from "~/types/UserType";

interface ProcessedData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface MembersAcquiredProps {
  members: Resource<MemberRecord[]>;
}

export default function MembersAcquired(props: MembersAcquiredProps) {
  let chartRef: HTMLCanvasElement | undefined;
  let chartInstance: Chart | undefined;

  const getColorForProgram = (program: string): { bg: string; border: string } => {
    const colors: Record<string, { bg: string; border: string }> = {
      'Unlimited Boxing': {
        bg: 'rgba(199, 35, 35, 0.2)',
        border: '#c72323'
      },
      'Jiu-Jitsu': {
        bg: 'rgba(34, 90, 213, 0.2)',
        border: '#225ad5'
      },
      'Competitive Boxing': {
        bg: 'rgba(255, 140, 0, 0.2)',
        border: '#ff8c00'
      },
      'MMA': {
        bg: 'rgba(142, 36, 170, 0.2)',
        border: '#8e24aa'
      },
      'N/A': {
        bg: 'rgba(128, 128, 128, 0.2)',
        border: '#808080'
      }
    };
    return colors[program] || {
      bg: 'rgba(128, 128, 128, 0.2)',
      border: '#808080'
    };
  };

  const processData = (): ProcessedData | null => {
    const memberData = props.members();
    if (!memberData) return null;

    const monthsSet = new Set<string>();
    const programsSet = new Set<string>();

    memberData.forEach((member: MemberRecord) => {
      // member.created returns a string that doesn't convert to a valid date on ios safari browsers
      // must convert to valid date iso string that ios safari can recognize
      const memberCreated = member.created.toString();
      const isoFormatted = memberCreated.replace(/\s(?=\d{2}:\d{2}:\d{2})/, "T");

      const date = new Date(isoFormatted);
      console.log("date: ", date);

      const monthYear = date.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric'
      });
      console.log("monthYear: ", monthYear);

      monthsSet.add(monthYear);
      programsSet.add(member.program || 'N/A');
    });

    // Sort months chronologically
    const months = Array.from(monthsSet).sort((a, b) => {
      const monthMap: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
      const [monthStr, yearStr] = a.split(" ");
      const monthA: number = monthMap[monthStr];
      const yearA: number = parseInt(yearStr.length === 2 ? '20' + yearStr : yearStr);

      const [monthStrB, yearStrB] = b.split(" ");
      const monthB: number = monthMap[monthStrB];
      const yearB: number = parseInt(yearStrB.length === 2 ? '20' + yearStrB : yearStrB);

      const dateA = new Date(yearA, monthA, 1);
      const dateB = new Date(yearB, monthB, 1);

      return dateA.getTime() - dateB.getTime();
    });

    console.log(months);

    // Ensure programs are in the desired order
    const programOrder = [
      'Competitive Boxing',
      'Jiu-Jitsu',
      'Unlimited Boxing',
      'MMA',
      'N/A'
    ];
    const programs = Array.from(programsSet).sort((a, b) => {
      return programOrder.indexOf(a) - programOrder.indexOf(b);
    });

    const datasets = programs.map(program => {
      const colors = getColorForProgram(program);
      const data = months.map(month => {
        return memberData.filter(member => {
          const memberMonth = new Date(member.created).toLocaleString('en-US', {
            month: 'short',
            year: 'numeric'
          });
          return memberMonth === month && (member.program || 'N/A') === program;
        }).length;
      });

      return {
        label: program,
        data: data,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 2
      };
    });

    return {
      labels: months,
      datasets: datasets
    };
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Members Acquired",
        color: "#ffffff",
        fullSize: true,
        font: {
          weight: 'bold',
          size: 24,
        }
      },
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#ffffff',
        titleColor: '#1f202a',
        bodyColor: '#1f202a',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 20,
          weight: 'bold'
        },
        padding: 12,
        titleSpacing: 4,
        bodySpacing: 4,
        boxPadding: 6,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const program = context.dataset.label;
            return `${value} ${program}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 18
          },
          padding: 12
        }
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 14
          },
          padding: 12,
          stepSize: 1, // Force whole numbers
          callback: (value) => Math.floor(value as number) // Ensure whole numbers
        },
        beginAtZero: true
      }
    }
  };

  createEffect(() => {
    const data = processData();
    if (!data || !chartRef) return;

    const ctx = chartRef.getContext('2d');
    if (!ctx) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: data as ChartData<'bar'>,
      options: chartOptions
    });
  });

  return (
    <div class="w-full max-w-4xl mx-auto p-4">
      <canvas ref={chartRef} />
    </div>
  );
}
