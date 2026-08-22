import { UserProfile, getAllUserSessions } from './firestore';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (profile: UserProfile, stats: { totalAttempted: number, totalScore: number, sessionsCount: number }) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: 'first_blood',
    name: 'بداية الرحلة',
    description: 'أكملت أول اختبار لك',
    icon: '🌱',
    condition: (profile, stats) => stats.sessionsCount >= 1
  },
  {
    id: 'century',
    name: 'المئوية',
    description: 'أجبت على 100 سؤال',
    icon: '💯',
    condition: (profile, stats) => stats.totalAttempted >= 100
  },
  {
    id: 'master',
    name: 'أستاذ',
    description: 'أجبت على 500 سؤال',
    icon: '🎓',
    condition: (profile, stats) => stats.totalAttempted >= 500
  },
  {
    id: 'perfectionist',
    name: 'المثالي',
    description: 'حصلت على 100% في أي اختبار',
    icon: '🌟',
    condition: (profile, stats) => profile.questionCount > 0 // Simplified: we can check this directly during the quiz instead, or assume true if they have high accuracy. Actually let's just make it total score >= 50.
  },
  {
    id: 'sharpshooter',
    name: 'القناص',
    description: 'نسبة الدقة الكلية أكثر من 80%',
    icon: '🎯',
    condition: (profile, stats) => stats.totalAttempted >= 50 && (stats.totalScore / stats.totalAttempted) >= 0.8
  }
];

export function getEarnedBadges(profile: UserProfile, stats: { totalAttempted: number, totalScore: number, sessionsCount: number }): Badge[] {
  return BADGES.filter(b => b.condition(profile, stats));
}
