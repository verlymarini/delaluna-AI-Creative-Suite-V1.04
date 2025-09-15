import { UsageStats } from './types';

export const saveUsageStats = (stats: UsageStats) => {
  try {
    const existing = JSON.parse(localStorage.getItem('delaluna_usage_stats') || '[]');
    existing.push(stats);
    localStorage.setItem('delaluna_usage_stats', JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving usage stats:', error);
  }
};

export const updateFeatureUsage = (feature: 'ideas' | 'scripts', tokens: number) => {
  try {
    // Keep for backward compatibility but simplified
    console.log(`Feature ${feature} used ${tokens} tokens`);
  } catch (error) {
    console.error('Error updating feature usage:', error);
  }
};

export const getUsageStats = () => {
  // Simplified stats without credits system
  return {
    today: { tokens: 0, cost: 0, ideas: 0, scripts: 0 },
    monthly: { tokens: 0, cost: 0 }
  };
};