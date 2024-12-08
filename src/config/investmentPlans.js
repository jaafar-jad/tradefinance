export  const investmentPlans = {
  single: {
    starter: {
      name: "Starter Plan",
      minAmount: 500,
      maxAmount: 4999,
      roi: 150, // 150% total ROI
      duration: 6, // 6 months
      dailyBonus: 0.15, // 0.15% daily ≈ 27% over 6 months
      accountType: "single"
    },
    basic: {
      name: "Basic Plan",
      minAmount: 5000,
      maxAmount: 14999,
      roi: 150,
      duration: 4,
      dailyBonus: 0.20, // 0.20% daily ≈ 24% over 4 months
      accountType: "single"
    },
    premium: {
      name: "Premium Plan",
      minAmount: 15000,
      maxAmount: Infinity,
      roi: 150,
      duration: 2,
      dailyBonus: 0.35, // 0.35% daily ≈ 21% over 2 months
      accountType: "single"
    }
  },
  couple: {
    starter: {
      name: "Couple Starter Plan",
      minAmount: 500,
      maxAmount: 4999,
      roi: 150,
      duration: 6,
      dailyBonus: 0.20, // 0.20% daily ≈ 36% over 6 months
      accountType: "couple",
      coupleBonus: 25
    },
    basic: {
      name: "Couple Basic Plan",
      minAmount: 5000,
      maxAmount: 14999,
      roi: 150,
      duration: 4,
      dailyBonus: 0.25, // 0.25% daily ≈ 30% over 4 months
      accountType: "couple",
      coupleBonus: 50
    },
    premium: {
      name: "Couple Premium Plan",
      minAmount: 15000,
      maxAmount: Infinity,
      roi: 150,
      duration: 2,
      dailyBonus: 0.40, // 0.40% daily ≈ 24% over 2 months
      accountType: "couple",
      coupleBonus: 75
    }
  }
};