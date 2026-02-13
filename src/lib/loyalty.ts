/**
 * Loyalty & Customer Engagement System
 * Points, Rewards, Referrals, Email Marketing
 */

export interface LoyaltyAccount {
  userId: string;
  totalPoints: number;
  pointsEarned: number;
  pointsRedeemed: number;
  currentTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierProgress: number; // 0-100
  nextTierRequirements: { pointsNeeded: number; ordersNeeded: number };
  rewards: Reward[];
  createdAt: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discount?: { type: 'percentage' | 'fixed'; value: number };
  freeShipping?: boolean;
  expiresAt: Date;
  status: 'available' | 'redeemed' | 'expired';
  redeemedAt?: Date;
}

export interface ReferralProgram {
  referrerId: string;
  referralCode: string;
  referralUrl: string;
  totalReferrals: number;
  successfulReferrals: number;
  bonusPoints: number;
  totalEarnings: number;
  status: 'active' | 'paused' | 'ended';
  createdAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  recipientList: string[];
  sentCount: number;
  openRate: number;
  clickRate: number;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledFor?: Date;
  sentAt?: Date;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  points: number;
  type: 'earned' | 'redeemed' | 'bonused' | 'expired';
  reason: string;
  orderId?: string;
  createdAt: Date;
}

// Loyalty Account functions
export async function getLoyaltyAccount(): Promise<LoyaltyAccount> {
  const response = await fetch('/api/loyalty/account');
  if (!response.ok) throw new Error('Failed to fetch loyalty account');
  return response.json();
}

export async function addLoyaltyPoints(points: number, reason: string, orderId?: string): Promise<PointsTransaction> {
  const response = await fetch('/api/loyalty/points', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points, reason, orderId }),
  });
  if (!response.ok) throw new Error('Failed to add points');
  return response.json();
}

export async function redeemPoints(points: number, rewardId?: string): Promise<{ success: boolean; message: string; reward?: Reward }> {
  const response = await fetch('/api/loyalty/redeem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points, rewardId }),
  });
  if (!response.ok) throw new Error('Failed to redeem points');
  return response.json();
}

export async function getPointsHistory(limit: number = 50): Promise<PointsTransaction[]> {
  const response = await fetch(`/api/loyalty/history?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch points history');
  return response.json();
}

// Tier-based benefits
export async function getTierBenefits(): Promise<{ tier: string; benefits: string[] }[]> {
  const response = await fetch('/api/loyalty/tiers');
  if (!response.ok) throw new Error('Failed to fetch tier benefits');
  return response.json();
}

// Reward functions
export async function availableRewards(): Promise<Reward[]> {
  const response = await fetch('/api/loyalty/rewards');
  if (!response.ok) throw new Error('Failed to fetch rewards');
  return response.json();
}

export async function redeemReward(rewardId: string): Promise<Reward> {
  const response = await fetch(`/api/loyalty/rewards/${rewardId}/redeem`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to redeem reward');
  return response.json();
}

// Referral functions
export async function getReferralProgram(): Promise<ReferralProgram> {
  const response = await fetch('/api/referrals/program');
  if (!response.ok) throw new Error('Failed to fetch referral program');
  return response.json();
}

export async function generateReferralCode(): Promise<{ code: string; url: string }> {
  const response = await fetch('/api/referrals/generate', { method: 'POST' });
  if (!response.ok) throw new Error('Failed to generate referral code');
  return response.json();
}

export async function trackReferral(referralCode: string, userId: string): Promise<void> {
  const response = await fetch('/api/referrals/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ referralCode, userId }),
  });
  if (!response.ok) throw new Error('Failed to track referral');
}

export async function getReferralHistory(): Promise<{ referrals: { email: string; status: string; bonusAwarded: number; dateReferred: Date }[] }> {
  const response = await fetch('/api/referrals/history');
  if (!response.ok) throw new Error('Failed to fetch referral history');
  return response.json();
}

// Email Campaign functions
export async function createEmailCampaign(campaign: Omit<EmailCampaign, 'id' | 'sentCount' | 'openRate' | 'clickRate' | 'sentAt'>): Promise<EmailCampaign> {
  const response = await fetch('/api/email-campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaign),
  });
  if (!response.ok) throw new Error('Failed to create campaign');
  return response.json();
}

export async function sendEmailCampaign(campaignId: string): Promise<{ success: boolean; sentCount: number }> {
  const response = await fetch(`/api/email-campaigns/${campaignId}/send`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to send campaign');
  return response.json();
}

export async function getCampaignMetrics(campaignId: string): Promise<{ openRate: number; clickRate: number; conversionRate: number }> {
  const response = await fetch(`/api/email-campaigns/${campaignId}/metrics`);
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
}

export async function subscribeToCampaigns(email: string, categories: string[]): Promise<void> {
  const response = await fetch('/api/email-campaigns/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, categories }),
  });
  if (!response.ok) throw new Error('Failed to subscribe to campaigns');
}

export async function unsubscribeFromCampaigns(email: string): Promise<void> {
  const response = await fetch('/api/email-campaigns/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error('Failed to unsubscribe from campaigns');
}

// SMS Notifications
export async function sendSMSNotification(phoneNumber: string, message: string): Promise<void> {
  const response = await fetch('/api/notifications/sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, message }),
  });
  if (!response.ok) throw new Error('Failed to send SMS');
}

export async function subscribeSMSNotifications(phoneNumber: string): Promise<void> {
  const response = await fetch('/api/notifications/sms/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  });
  if (!response.ok) throw new Error('Failed to subscribe to SMS');
}
