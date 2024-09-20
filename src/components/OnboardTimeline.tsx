import { Timeline } from "~/components/ui/Timeline";

export default function OnboardTimeline() {
  return (
    <Timeline
      items={[
        {
          title: "Choose a martial art",
          description: "This is the first event of the timeline."
        },
        {
          title: "Sign liability waiver",
          description: "This is the second event of the timeline."
        },
        {
          title: "Billing info",
          description: "This is the third event of the timeline."
        }
      ]}
      activeItem={1}
    />
  );
} 