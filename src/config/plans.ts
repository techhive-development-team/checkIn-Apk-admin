export type SubscriptionPlanKey = "FREE" | "BASIC" | "MEDIUM" | "ENTERPRISE";

export interface SubscriptionPlan {
  key: SubscriptionPlanKey;
  name: string;
  shortName: string;
  employeeRange: string;
  /** Maximum members allowed. `null` means unlimited. */
  maxEmployees: number | null;
  priceLabel: string;
  highlight?: boolean;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    key: "FREE",
    name: "Free",
    shortName: "Free",
    employeeRange: "1 – 10 members",
    maxEmployees: 10,
    priceLabel: "Free",
    features: [
      "Up to 10 members",
      "Attendance & leave management",
      "Email support",
    ],
  },
  {
    key: "BASIC",
    name: "Basic Business",
    shortName: "Basic",
    employeeRange: "11 – 50 members",
    maxEmployees: 50,
    priceLabel: "$10 – $40 / mo",
    highlight: true,
    features: [
      "11 – 50 members",
      "Attendance & leave management",
      "Priority email support",
    ],
  },
  {
    key: "MEDIUM",
    name: "Medium Business",
    shortName: "Medium",
    employeeRange: "51 – 200 members",
    maxEmployees: 200,
    priceLabel: "$50 – $100 / mo",
    features: ["51 – 200 members", "Advanced reporting", "Priority support"],
  },
  {
    key: "ENTERPRISE",
    name: "Enterprise",
    shortName: "Enterprise",
    employeeRange: "201+ members",
    maxEmployees: null,
    priceLabel: "$100 – $300 / mo",
    features: [
      "Unlimited members",
      "Custom features",
      "API integration",
      "Dedicated support",
    ],
  },
];

export const PLAN_BY_KEY: Record<SubscriptionPlanKey, SubscriptionPlan> =
  SUBSCRIPTION_PLANS.reduce(
    (acc, plan) => {
      acc[plan.key] = plan;
      return acc;
    },
    {} as Record<SubscriptionPlanKey, SubscriptionPlan>,
  );

export const getPlan = (key?: string | null): SubscriptionPlan =>
  (key && PLAN_BY_KEY[key as SubscriptionPlanKey]) || PLAN_BY_KEY.FREE;

/** Update this to your real sales contact. */
export const SALES_CONTACT_EMAIL = "office@techhive-innovation.io";
