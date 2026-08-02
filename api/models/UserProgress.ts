import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  userId: string;
  xp: number;
  level: number;
  streak: number;
  hearts: number;
  maxHearts: number;
  completedModules: Record<string, { stars: number; highScore: number }>;
  unlockedBadges: string[];
  updatedAt: Date;
}

const UserProgressSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    hearts: { type: Number, default: 5 },
    maxHearts: { type: Number, default: 5 },
    completedModules: { type: Schema.Types.Mixed, default: {} },
    unlockedBadges: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const UserProgress =
  mongoose.models.UserProgress ||
  mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
