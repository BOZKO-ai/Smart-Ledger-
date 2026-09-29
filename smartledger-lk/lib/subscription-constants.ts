// Define tier limits
export const TIER_LIMITS = {
  free: {
    monthlyScans: 10,
    hasAIInsights: false,
    maxTeamMembers: 1,
    hasDataExport: false,
  },
  starter: {
    monthlyScans: Infinity,
    hasAIInsights: false,
    maxTeamMembers: 1,
    hasDataExport: false,
  },
  pro: {
    monthlyScans: Infinity,
    hasAIInsights: true,
    maxTeamMembers: 5,
    hasDataExport: true,
  },
} as const;

export const TIER_PRICES = {
  free: 0,
  starter: 599, // Rs. 599/month
  pro: 1299, // Rs. 1299/month
} as const;
