export interface PlanProps {
  id: string;
  name: string;
  description: string;
  price: number;
  features?: string[];
  popular?: boolean;
}

export const plans: PlanProps[] = [
  {
    id: "comp-boxing",
    name: "Competitive Boxing",
    description:
      "Training for aspiring amateur boxers. (Select this price if member is under 16 years old) ",
    price: 70,
    features: [
      "Group classes",
      "Access to 1-on-1 training",
      "Sparring sessions",
    ],
  },
  {
    id: "jiu-jitsu",
    name: "Jiu-Jitsu",
    description: "Training for beginners and competitive-level athletes.",
    price: 100,
    features: [
      "Unlimited group classes",
      "1-on-1 technique training",
      "Expert coaching",
    ],
  },
  {
    id: "unlimited-boxing",
    name: "Unlimited Boxing",
    description: "High-intensity group training for beginners and competitors.",
    price: 110,
    features: [
      "Unlimited group classes",
      "Access to 1-on-1 training",
      "Free wellness consultation",
    ],
    popular: true,
  },
  {
    id: "mma",
    name: "MMA",
    description:
      "Advanced training for Mixed Martial Arts athletes. (INVITE-ONLY)",
    price: 120,
    features: [
      "Strength & conditioning",
      "Access to 1-on-1 training",
      "Expert coaching",
    ],
  },
];
