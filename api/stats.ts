import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb';
import { UserProgress } from './models/UserProgress';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    const userId = (req.query.userId as string) || (req.body?.userId as string) || 'default_user';

    if (req.method === 'GET') {
      let progress = await UserProgress.findOne({ userId });
      if (!progress) {
        progress = await UserProgress.create({ userId });
      }
      return res.status(200).json(progress);
    }

    if (req.method === 'POST') {
      const { xp, level, streak, hearts, maxHearts, completedModules, unlockedBadges } = req.body;

      const updatedProgress = await UserProgress.findOneAndUpdate(
        { userId },
        {
          $set: {
            xp,
            level,
            streak,
            hearts,
            maxHearts,
            completedModules,
            unlockedBadges,
            updatedAt: new Date()
          }
        },
        { new: true, upsert: true }
      );

      return res.status(200).json(updatedProgress);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: unknown) {
    console.error('MongoDB API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ error: message });
  }
}
