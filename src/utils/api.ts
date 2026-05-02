// src/utils/api.ts

export interface LeaderboardEntry {
  id: string; // Unique identifier for the user
  name: string;
  score: number; // For now, let's use gold as the score
  level: number; // Max level reached in BattleGame
}

const LEADERBOARD_STORAGE_KEY = "english_vocab_leaderboard";

// Simulate fetching leaderboard data from a backend
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      const leaderboard: LeaderboardEntry[] = data ? JSON.parse(data) : [];
      // Sort by score (gold) descending, then by level descending
      leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return b.level - a.level;
      });
      resolve(leaderboard);
    }, 300);
  });
}

// Simulate submitting a score to the backend
export async function submitScore(entry: Omit<LeaderboardEntry, 'id'>): Promise<LeaderboardEntry[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      let leaderboard: LeaderboardEntry[] = data ? JSON.parse(data) : [];

      // Generate a unique ID for the user if they don't have one
      const userId = localStorage.getItem("user_id") || `user_${Date.now()}`;
      localStorage.setItem("user_id", userId);

      const existingIndex = leaderboard.findIndex((e) => e.id === userId);

      if (existingIndex > -1) {
        // Update existing entry if new score is higher or level is higher with same score
        const existingEntry = leaderboard[existingIndex];
        if (entry.score > existingEntry.score || (entry.score === existingEntry.score && entry.level > existingEntry.level)) {
          leaderboard[existingIndex] = { ...existingEntry, name: entry.name, score: entry.score, level: entry.level };
        }
      } else {
        // Add new entry
        leaderboard.push({ ...entry, id: userId });
      }

      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));

      // Sort and return updated leaderboard
      leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return b.level - a.level;
      });
      resolve(leaderboard);
    }, 300);
  });
}
