import api from '../lib/api';

export type DailyBonusStatus = {
  todayReferrals: number;
  bonusAwarded: boolean;
  bonusAwardedCount: number;
  bonusAwardedAmount?: { pkr: number; usd: number } | null;
  potentialBonus: {
    count: number;
    amount: { pkr: number; usd: number };
    breakdown: Array<{ bonusNumber: number; thresholdReached: number; bonusAmount: number; description: string }>;
  };
  progress: { toNextBonus: number; referralsNeeded: number };
  bonusRules: {
    firstBonusThreshold: number;
    subsequentBonusThreshold: number;
    bonusAmount: { pkr: number; usd: number };
  };
};

export type DailyBonusHistoryItem = {
  id: string | number;
  bonusDate: string;
  referralsCount: number;
  bonusCount: number;
  bonusAmount: { pkr: number; usd: number };
  createdAt?: string;
};

export async function getDailyStatus() {
  const { data } = await api.get('/daily-referral-bonus/status');
  return (data as any)?.data ?? data;
}

export async function getDailyHistory(params?: { page?: number; limit?: number }) {
  const { data } = await api.get('/daily-referral-bonus/history', { params });
  return (data as any)?.data ?? data;
}

export async function checkAndAward() {
  const { data } = await api.post('/daily-referral-bonus/check', {});
  return (data as any)?.data ?? data;
}
