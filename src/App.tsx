import { useState, useEffect } from 'react';
import type { UserStats, LearningModule, Exercise } from './types/game';
import { ALL_LEARNING_MODULES } from './data/englishTopicsData';
import { GAME_BADGES } from './data/verbToBeData';
import { Navbar } from './components/Navbar';
import { ModuleSelector } from './components/ModuleSelector';
import { ExerciseCard } from './components/ExerciseCard';
import { ResultScreen } from './components/ResultScreen';
import { GrammarModal } from './components/GrammarModal';
import { AchievementsModal } from './components/AchievementsModal';
import { AiTutorModal } from './components/AiTutorModal';
import { soundFx } from './utils/soundFx';

import { fetchUserStatsFromDb, syncUserStatsToDb } from './services/api';

const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: new Date().toISOString(),
  hearts: 5,
  maxHearts: 5,
  completedModules: {},
  unlockedBadges: []
};

export function App() {
  // Persistence in localStorage
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('muvlern_user_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_STATS;
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => soundFx.getMuted());
  const [isGrammarOpen, setIsGrammarOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Active session state
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState<number>(0);
  const [sessionXpEarned, setSessionXpEarned] = useState<number>(0);
  const [isModuleFinished, setIsModuleFinished] = useState(false);

  // Sync with MongoDB on mount
  useEffect(() => {
    fetchUserStatsFromDb().then((remoteStats) => {
      if (remoteStats) {
        setStats(remoteStats);
      }
    });
  }, []);

  // Save stats on update to LocalStorage & MongoDB
  useEffect(() => {
    localStorage.setItem('muvlern_user_stats', JSON.stringify(stats));
    syncUserStatsToDb(stats);
  }, [stats]);

  // Handle Mute Toggle
  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Start selected module
  const handleSelectModule = (module: LearningModule) => {
    setActiveModule(module);
    setCurrentExerciseIndex(0);
    setSessionCorrectCount(0);
    setSessionXpEarned(0);
    setIsModuleFinished(false);
  };

  // Answer handler
  const handleAnswer = (isCorrect: boolean) => {
    setStats((prevStats) => {
      let newHearts = prevStats.hearts;
      let newStreak = prevStats.streak;
      let newXp = prevStats.xp;

      if (isCorrect) {
        newStreak += 1;
        const xpGain = 15 + Math.min(newStreak * 2, 20); // Combo bonus!
        newXp += xpGain;
        setSessionCorrectCount((c) => c + 1);
        setSessionXpEarned((x) => x + xpGain);
      } else {
        newStreak = 0;
        newHearts = Math.max(0, prevStats.hearts - 1);
      }

      const newLevel = Math.floor(newXp / 100) + 1;

      return {
        ...prevStats,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        hearts: newHearts
      };
    });
  };

  // Move to next exercise or complete module
  const handleNextExercise = () => {
    if (!activeModule) return;

    if (currentExerciseIndex + 1 < activeModule.exercises.length) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      // Finish module
      const accuracy = Math.round((sessionCorrectCount / activeModule.exercises.length) * 100);
      let stars = 1;
      if (accuracy >= 90) stars = 3;
      else if (accuracy >= 60) stars = 2;

      setStats((prev) => {
        const updatedCompleted = {
          ...prev.completedModules,
          [activeModule.id]: {
            stars: Math.max(stars, prev.completedModules[activeModule.id]?.stars || 0),
            highScore: Math.max(sessionXpEarned, prev.completedModules[activeModule.id]?.highScore || 0)
          }
        };

        // Check new badges unlocked
        const tempStats = { ...prev, completedModules: updatedCompleted };
        const newlyUnlocked = GAME_BADGES
          .filter((b) => b.condition(tempStats))
          .map((b) => b.id);

        return {
          ...tempStats,
          unlockedBadges: Array.from(new Set([...prev.unlockedBadges, ...newlyUnlocked]))
        };
      });

      setIsModuleFinished(true);
    }
  };

  // Return to Dashboard / Go Home
  const handleGoHome = () => {
    setActiveModule(null);
    setIsModuleFinished(false);
  };

  // Refill hearts if depleted
  const handleRefillHearts = () => {
    soundFx.playClick();
    setStats((prev) => ({ ...prev, hearts: prev.maxHearts }));
  };

  const currentExercise: Exercise | undefined = activeModule?.exercises[currentExerciseIndex];

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar
        stats={stats}
        onOpenGrammar={() => setIsGrammarOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenAiTutor={() => setIsAiOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="main-content">

        {/* Game Over Screen when Hearts reach 0 */}
        {stats.hearts === 0 && !isModuleFinished && (
          <div className="out-of-hearts-card">
            <div className="heart-icon-bounce">💔</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Suas vidas acabaram!</h2>
            <p className="text-gray-300 mb-6 max-w-md text-center">
              Você cometeu alguns erros durante a prática. Não desanime! Recarregue suas vidas para continuar aprendendo.
            </p>
            <button onClick={handleRefillHearts} className="primary-btn">
              ❤️ Recarregar Vidas Gratuitamente
            </button>
          </div>
        )}

        {/* Dashboard / Module Path Selection */}
        {!activeModule && stats.hearts > 0 && (
          <ModuleSelector
            modules={ALL_LEARNING_MODULES}
            stats={stats}
            onSelectModule={handleSelectModule}
          />
        )}

        {/* Active Gameplay Session */}
        {activeModule && !isModuleFinished && stats.hearts > 0 && currentExercise && (
          <ExerciseCard
            exercise={currentExercise}
            currentIndex={currentExerciseIndex}
            totalExercises={activeModule.exercises.length}
            heartsRemaining={stats.hearts}
            currentStreak={stats.streak}
            onAnswer={handleAnswer}
            onNext={handleNextExercise}
            onClose={handleGoHome}
          />
        )}

        {/* Level Complete / Result Screen */}
        {activeModule && isModuleFinished && (
          <ResultScreen
            moduleTitle={activeModule.title}
            correctAnswers={sessionCorrectCount}
            totalQuestions={activeModule.exercises.length}
            xpEarned={sessionXpEarned}
            heartsRemaining={stats.hearts}
            onNextModule={() => {
              const currentIdx = ALL_LEARNING_MODULES.findIndex((m: LearningModule) => m.id === activeModule.id);
              if (currentIdx + 1 < ALL_LEARNING_MODULES.length) {
                handleSelectModule(ALL_LEARNING_MODULES[currentIdx + 1]);
              } else {
                handleGoHome();
              }
            }}
            onRetryModule={() => handleSelectModule(activeModule)}
          />
        )}

      </main>

      {/* Modals */}
      <GrammarModal
        isOpen={isGrammarOpen}
        onClose={() => setIsGrammarOpen(false)}
      />

      <AchievementsModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        stats={stats}
      />

      <AiTutorModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />
    </div>
  );
}
