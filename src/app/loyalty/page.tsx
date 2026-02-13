'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Share2, Trophy, Zap, Award } from 'lucide-react';

interface LoyaltyAccount {
  userId: string;
  totalPoints: number;
  pointsEarned: number;
  pointsRedeemed: number;
  currentTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierProgress: number;
  nextTierThreshold: number;
  nextTierName: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'discount' | 'free-shipping' | 'special';
  discount?: number;
}

const TIER_CONFIG = {
  bronze: { color: 'from-amber-800 to-amber-600', benefits: ['5% Points', '10% Birthday Bonus'] },
  silver: { color: 'from-gray-400 to-gray-300', benefits: ['10% Points', '20% Birthday Bonus', 'Free Shipping'] },
  gold: { color: 'from-yellow-400 to-yellow-300', benefits: ['15% Points', '30% Birthday Bonus', 'Free Shipping', 'VIP Support'] },
  platinum: { color: 'from-purple-400 to-indigo-400', benefits: ['20% Points', '50% Birthday Bonus', 'Free Shipping', 'VIP Support', 'Early Access'] },
};

export default function LoyaltyPage() {
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccount | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'referral'>('overview');
  const [referralUrl, setReferralUrl] = useState('');

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const userId = 'user-123'; // Replace with actual user ID

      const [accountRes, rewardsRes] = await Promise.all([
        fetch(`/api/loyalty/account?userId=${userId}`),
        fetch(`/api/loyalty/rewards?userId=${userId}`),
      ]);

      if (accountRes.ok) {
        const accountData = await accountRes.json();
        setLoyaltyAccount(accountData);
      }

      if (rewardsRes.ok) {
        const rewardsData = await rewardsRes.json();
        setRewards(rewardsData);
      }
    } catch (error) {
      console.error('Failed to fetch loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReferral = async () => {
    try {
      const response = await fetch('/api/referrals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-123' }),
      });

      if (response.ok) {
        const data = await response.json();
        setReferralUrl(data.referralUrl);
      }
    } catch (error) {
      console.error('Failed to generate referral:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const tierConfig = loyaltyAccount ? TIER_CONFIG[loyaltyAccount.currentTier] : null;
  const tierColors: Record<string, string> = {
    bronze: '#92400e',
    silver: '#a0aec0',
    gold: '#eab308',
    platinum: '#a78bfa',
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold">Loyalty Program</h1>
          </div>
          <p className="text-gray-400">Earn points, unlock rewards, and enjoy exclusive benefits</p>
        </motion.div>

        {/* Loyalty Card */}
        {loyaltyAccount && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-gradient-to-br ${tierConfig?.color} rounded-2xl p-8 mb-8 text-white shadow-xl overflow-hidden relative`}
          >
            <div className="absolute top-0 right-0 opacity-10"><Trophy className="w-64 h-64" /></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm opacity-80 mb-1">Current Tier</p>
                  <h2 className="text-3xl font-bold capitalize">{loyaltyAccount.currentTier}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80 mb-1">Total Points</p>
                  <p className="text-3xl font-bold">{loyaltyAccount.totalPoints}</p>
                </div>
              </div>

              {/* Tier Progress */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Progress to {loyaltyAccount.nextTierName}</span>
                  <span className="text-sm font-semibold">{loyaltyAccount.tierProgress}%</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-2">
                  <motion.div
                    initial={false}
                    animate={{ width: `${loyaltyAccount.tierProgress}%` }}
                    transition={{ duration: 1.5 }}
                    className="bg-white h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-2">
                {tierConfig?.benefits.map((benefit, idx) => (
                  <span key={idx} className="text-xs bg-white/20 px-3 py-1 rounded-full">
                    ✓ {benefit}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Points Earned', value: loyaltyAccount?.pointsEarned || 0, icon: Zap },
            { label: 'Points Redeemed', value: loyaltyAccount?.pointsRedeemed || 0, icon: Gift },
            { label: 'Current Balance', value: loyaltyAccount?.totalPoints || 0, icon: Award },
          ].map(({ label, value, icon: Icon }, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 p-6 rounded-lg border border-gray-800"
            >
              <Icon className="w-7 h-7 text-amber-600 mb-3" />
              <p className="text-gray-400 text-sm mb-1">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-4 border-b border-gray-700 mb-6">
            {(['overview', 'rewards', 'referral'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab === 'overview' && 'Benefits'}
                {tab === 'rewards' && 'Redeem Rewards'}
                {tab === 'referral' && 'Referral Program'}
              </button>
            ))}
          </div>

          {/* Benefits Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {[
                { tier: 'bronze', description: 'Entry level rewards', points: '5%' },
                { tier: 'silver', description: 'Enhanced benefits', points: '10%' },
                { tier: 'gold', description: 'Premium perks', points: '15%' },
                { tier: 'platinum', description: 'VIP experience', points: '20%' },
              ].map(({ tier, description, points }) => (
                <div
                  key={tier}
                  className={`p-6 rounded-lg border-2 ${
                    loyaltyAccount?.currentTier === tier
                      ? 'bg-amber-900/20 border-amber-600'
                      : 'bg-gray-900/50 border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: tierColors[tier] }}
                    />
                    <div>
                      <h3 className="font-bold capitalize">{tier}</h3>
                      <p className="text-xs text-gray-400">{description}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-amber-500 mb-3">{points} Points</p>
                  {loyaltyAccount?.currentTier === tier && (
                    <span className="text-xs bg-amber-600 text-white px-3 py-1 rounded">
                      Your current tier
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {rewards.length > 0 ? (
                rewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-900/50 p-6 rounded-lg border border-gray-800"
                  >
                    <Gift className="w-8 h-8 text-amber-600 mb-3" />
                    <h3 className="font-bold mb-1">{reward.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-amber-500">
                        {reward.cost} pts
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!loyaltyAccount || loyaltyAccount.totalPoints < reward.cost}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Redeem
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-400">
                  No rewards available yet
                </div>
              )}
            </motion.div>
          )}

          {/* Referral Tab */}
          {activeTab === 'referral' && (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 rounded-lg p-8 border border-gray-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <Share2 className="w-8 h-8 text-amber-600" />
                <h3 className="text-2xl font-bold">Share & Earn</h3>
              </div>

              <p className="text-gray-400 mb-6">
                Refer friends and earn 500 bonus points for each successful referral.
              </p>

              {referralUrl ? (
                <motion.div
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/50 border border-amber-600 rounded-lg p-4 mb-6"
                >
                  <p className="text-sm text-gray-400 mb-2">Your Referral Link</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralUrl}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigator.clipboard.writeText(referralUrl)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded"
                    >
                      Copy
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateReferral}
                  className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors mb-6"
                >
                  Generate Referral Link
                </motion.button>
              )}

              <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
                <h4 className="font-semibold mb-3">Referral Rewards</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ You earn 500 points per successful referral</li>
                  <li>✓ Your friend gets 10% off their first order</li>
                  <li>✓ Unlimited referrals = unlimited rewards</li>
                  <li>✓ Referral points credited within 24 hours</li>
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
