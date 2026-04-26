export interface CheckInRecord {
  date: string; // YYYY-MM-DD
  wordsLearned: number[];
  quizScore?: number;
}

export interface UserProgress {
  currentGrade: number;
  learnedWords: number[]; // word IDs
  masteredWords: number[]; // word IDs that passed quiz
  checkInRecords: CheckInRecord[];
  totalDaysCheckedIn: number;
  consecutiveDays: number;
  lastCheckInDate: string;
}

const STORAGE_KEY = "english_vocab_progress";

const defaultProgress: UserProgress = {
  currentGrade: 1,
  learnedWords: [],
  masteredWords: [],
  checkInRecords: [],
  totalDaysCheckedIn: 0,
  consecutiveDays: 0,
  lastCheckInDate: "",
};

export function getProgress(): UserProgress {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to load progress:", e);
  }
  return { ...defaultProgress };
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

export function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function isCheckedInToday(progress: UserProgress): boolean {
  return progress.lastCheckInDate === getTodayString();
}

export function checkIn(progress: UserProgress, wordIds: number[]): UserProgress {
  const today = getTodayString();
  if (progress.lastCheckInDate === today) {
    const existingRecord = progress.checkInRecords.find(r => r.date === today);
    if (existingRecord) {
      existingRecord.wordsLearned = [...new Set([...existingRecord.wordsLearned, ...wordIds])];
    }
    return {
      ...progress,
      learnedWords: [...new Set([...progress.learnedWords, ...wordIds])],
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  const isConsecutive = progress.lastCheckInDate === yesterdayStr;

  const newRecord: CheckInRecord = {
    date: today,
    wordsLearned: wordIds,
  };

  return {
    ...progress,
    learnedWords: [...new Set([...progress.learnedWords, ...wordIds])],
    checkInRecords: [...progress.checkInRecords, newRecord],
    totalDaysCheckedIn: progress.totalDaysCheckedIn + 1,
    consecutiveDays: isConsecutive ? progress.consecutiveDays + 1 : 1,
    lastCheckInDate: today,
  };
}

export function markMastered(progress: UserProgress, wordIds: number[]): UserProgress {
  return {
    ...progress,
    masteredWords: [...new Set([...progress.masteredWords, ...wordIds])],
  };
}
