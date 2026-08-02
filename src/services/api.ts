import type { UserStats } from '../types/game';

const API_BASE = '/api/stats';
const USER_ID_KEY = 'muvlern_user_id';

function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export async function fetchUserStatsFromDb(): Promise<UserStats | null> {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE}?userId=${userId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      xp: data.xp || 0,
      level: data.level || 1,
      streak: data.streak || 0,
      lastActiveDate: data.updatedAt || new Date().toISOString(),
      hearts: data.hearts ?? 5,
      maxHearts: data.maxHearts ?? 5,
      completedModules: data.completedModules || {},
      unlockedBadges: data.unlockedBadges || []
    };
  } catch (error) {
    console.warn('Could not sync with MongoDB (offline or local dev without serverless api):', error);
    return null;
  }
}

export async function syncUserStatsToDb(stats: UserStats): Promise<void> {
  try {
    const userId = getUserId();
    await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...stats })
    });
  } catch (error) {
    console.warn('Could not save stats to MongoDB:', error);
  }
}
