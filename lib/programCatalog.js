export const PROGRAM_CATALOG = {
  starter: {
    key: "starter",
    label: "Starter",
    stripeType: "call",
    amount: 50,
    checkoutSuccessPath: "/success-call",
    checkoutCancelPath: "/contact",
    features: [
      "1-on-1 strategy call",
      "Mentorship fit assessment",
      "Roadmap for your first inventory move",
      "Direct next-step recommendations",
    ],
  },
  growth: {
    key: "growth",
    label: "Growth",
    stripeType: "mentorship",
    amount: 500,
    checkoutSuccessPath: "/success-mentorship",
    checkoutCancelPath: "/",
    features: [
      "Direct mentorship access",
      "Verified supplier introduction flow",
      "Execution systems and weekly support",
      "Store, sourcing, and margin guidance",
    ],
  },
  elite: {
    key: "elite",
    label: "Elite Access",
    stripeType: "advisory",
    amount: 1000,
    checkoutSuccessPath: "/success-advisory",
    checkoutCancelPath: "/",
    features: [
      "Everything in Growth",
      "Higher-touch strategic advisory",
      "Advanced sourcing and trading support",
      "Priority implementation guidance",
    ],
  },
  course: {
    key: "course",
    label: "Course",
    stripeType: "course",
    amount: 129,
    checkoutSuccessPath: "/success-course",
    checkoutCancelPath: "/",
    features: [
      "4-week structured systems curriculum",
      "Execution-first lessons",
      "Foundational store and sourcing education",
    ],
  },
};

export function getProgramByStripeType(type) {
  return Object.values(PROGRAM_CATALOG).find((program) => program.stripeType === type) || null;
}

