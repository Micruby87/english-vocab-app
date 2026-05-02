import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, RotateCcw, Trophy } from "lucide-react";
import { vocabulary, gradeNames } from "../data/vocabulary";
import type { Word } from "../data/vocabulary";
import type { UserProgress } from "../utils/storage";
import { markMastered, saveProgress } from "../utils/storage";
import { speak } from "../utils/speak";

interface QuizPageProps {
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
  onBack: () => void;
}

type QuizMode = "select_grade" | "quiz" | "result";

interface QuizQuestion {
  word: Word;
  options: string[];
  correctIndex: number;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(words: Word[], count: number): QuizQuestion[] {
  const selected = shuffleArray(words).slice(0, count);
  return selected.map((word) => {
    const otherWords = words.filter((w) => w.id !== word.id);
    const distractors = shuffleArray(otherWords)
      .slice(0, 3)
      .map((w) => w.chinese);
    const allOptions = shuffleArray([word.chinese, ...distractors]);
    return {
      word,
      options: allOptions,
      correctIndex: allOptions.indexOf(word.chinese),
    };
  });
}

export default function QuizPage({ progress, setProgress, onBack }: QuizPageProps) {
  const [mode, setMode] = useState<QuizMode>("select_grade");
  const [selectedGrade, setSelectedGrade] = useState<number>(progress.currentGrade);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<number[]>([]);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [goldEarned, setGoldEarned] = useState(0);

  const startQuiz = (grade: number) => {
    const gradeWords = vocabulary.filter((w) => w.grade === grade);
    if (gradeWords.length < 4) return;
    const qs = generateQuestions(gradeWords, Math.min(10, gradeWords.length));
    setQuestions(qs);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setAnsweredIds([]);
    setWrongIds([]);
    setGoldEarned(0);
    setSelectedGrade(grade);
    setMode("quiz");
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const question = questions[currentQ];
    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setAnsweredIds((ids) => [...ids, question.word.id]);
    } else {
      setWrongIds((ids) => [...ids, question.word.id]);
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelectedAnswer(null);
      } else {
        setMode("result");
        const finalAnsweredIds = [...answeredIds, ...(isCorrect ? [question.word.id] : [])];
        if (finalAnsweredIds.length > 0) {
          const updated = markMastered(progress, finalAnsweredIds);
          // Calculate gold reward based on correct answers
          const goldReward = finalAnsweredIds.length * 10; // 10 gold per correct answer
          setGoldEarned(goldReward);
          updated.gold = (updated.gold || 0) + goldReward;
          setProgress(updated);
          saveProgress(updated);
        }
      }
    }, 1200);
  };

  useEffect(() => {
    if (mode === "quiz" && questions[currentQ]) {
      speak(questions[currentQ].word.english);
    }
  }, [currentQ, mode]);

  if (mode === "select_grade") {
    return (
      <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
        <PageHeader onBack={onBack} title="单词测验" />
        <div style={{ padding: "0 16px 32px" }}>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>选择年级开始测验（每次10题）</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(gradeNames).map(([grade, name]) => {
              const gradeWords = vocabulary.filter((w) => w.grade === Number(grade));
              const learnedInGrade = gradeWords.filter((w) =>
                progress.learnedWords.includes(w.id)
              ).length;
              const pct = gradeWords.length > 0 ? Math.round((learnedInGrade / gradeWords.length) * 100) : 0;
              return (
                <button
                  key={grade}
                  onClick={() => startQuiz(Number(grade))}
                  style={{
                    width: "100%", background: "#fff", borderRadius: 16, padding: "16px 18px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.04)", textAlign: "left",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      {gradeWords.length} 个单词 · 已学 {learnedInGrade} 个 ({pct}%)
                    </div>
                  </div>
                  <div style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
                    fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 50,
                  }}>
                    开始
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "result") {
    const total = questions.length;
    const score = Math.round((correctCount / total) * 100);
    const trophyColor = score >= 80 ? "#f59e0b" : score >= 60 ? "#6366f1" : "#94a3b8";
    return (
      <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
        <PageHeader onBack={onBack} title="测验结果" />
        <div style={{ padding: "0 16px 32px" }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "36px 24px", textAlign: "center", marginBottom: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <Trophy style={{ width: 56, height: 56, color: trophyColor, margin: "0 auto 16px" }} />
            <div style={{ fontSize: 52, fontWeight: 800, color: "#1a1a2e", lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>分</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 28 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>{correctCount}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>正确</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#ef4444" }}>{total - correctCount}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>错误</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b" }}>+{goldEarned}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>💰 金币</div>
              </div>
            </div>
            <div style={{ marginTop: 20, fontSize: 14, color: "#64748b" }}>
              {score >= 80 ? "太棒了！继续保持！🎉" : score >= 60 ? "还不错，继续加油！💪" : "需要多多复习哦！📚"}
            </div>
          </div>

          {wrongIds.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 20, padding: "18px 18px", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 12 }}>需要复习的单词</div>
              {wrongIds.map((id) => {
                const word = vocabulary.find((w) => w.id === id);
                if (!word) return null;
                return (
                  <div key={id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontWeight: 600, color: "#1a1a2e" }}>{word.english}</span>
                    <span style={{ color: "#64748b", fontSize: 13 }}>{word.chinese}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => startQuiz(selectedGrade)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "14px 0", borderRadius: 14, fontSize: 15, fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              }}
            >
              <RotateCcw style={{ width: 16, height: 16 }} />
              再来一次
            </button>
            <button
              onClick={onBack}
              style={{
                flex: 1, padding: "14px 0", borderRadius: 14, fontSize: 15, fontWeight: 600,
                background: "#fff", color: "#64748b", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];
  if (!question) return null;

  const quizPct = Math.round(((currentQ + 1) / questions.length) * 100);

  return (
    <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
      <PageHeader onBack={onBack} title="单词测验" />

      <div style={{ padding: "0 16px 32px" }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${quizPct}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)", borderRadius: 6, transition: "width 0.3s" }} />
          </div>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
            {currentQ + 1}/{questions.length}
          </span>
        </div>

        {/* Question Card */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "32px 24px", textAlign: "center", marginBottom: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>选择正确的中文意思</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#1a1a2e", marginBottom: 6 }}>{question.word.english}</div>
          <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 18 }}>{question.word.phonetic}</div>
          <button
            onClick={() => speak(question.word.english)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 20px", borderRadius: 50,
              background: "#eef2ff", color: "#6366f1", fontSize: 13, fontWeight: 600,
            }}
          >
            <Volume2 style={{ width: 16, height: 16 }} />
            播放发音
          </button>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {question.options.map((option, index) => {
            let bg = "#fff";
            let color = "#1a1a2e";
            let border = "2px solid transparent";

            if (selectedAnswer !== null) {
              if (index === question.correctIndex) {
                bg = "#f0fdf4"; color = "#15803d"; border = "2px solid #4ade80";
              } else if (index === selectedAnswer && index !== question.correctIndex) {
                bg = "#fef2f2"; color = "#b91c1c"; border = "2px solid #f87171";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                style={{
                  width: "100%", padding: "16px 18px", borderRadius: 14,
                  textAlign: "left", fontSize: 15, fontWeight: 600,
                  background: bg, color, border,
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                }}
              >
                <span style={{ color: "#94a3b8", marginRight: 12 }}>
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PageHeader({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px 12px" }}>
      <button
        onClick={onBack}
        style={{
          width: 40, height: 40, borderRadius: 12, background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <ArrowLeft style={{ width: 20, height: 20, color: "#475569" }} />
      </button>
      <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>{title}</span>
    </div>
  );
}
