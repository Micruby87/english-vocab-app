import { useState, useCallback } from "react";
import { ArrowLeft, Star, RotateCcw, Zap } from "lucide-react";
import { emojiWords } from "../data/emojiWords";
import { gradeNames } from "../data/vocabulary";
import { speak } from "../utils/speak";

interface EmojiGameProps {
  onBack: () => void;
}

export default function EmojiGame({ onBack }: EmojiGameProps) {
  const [grade, setGrade] = useState<number | null>(null);
  const [questions, setQuestions] = useState<typeof emojiWords>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showEmoji, setShowEmoji] = useState(true);

  const generateOptions = useCallback((correctWord: string, gradeNum: number) => {
    const gradePool = emojiWords
      .filter((w) => w.grade === gradeNum && w.english !== correctWord)
      .map((w) => w.english);
    const shuffled = [...gradePool].sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [...shuffled, correctWord].sort(() => Math.random() - 0.5);
    return allOptions;
  }, []);

  const startGame = useCallback((g: number) => {
    const gradeEmojis = emojiWords.filter((w) => w.grade === g);
    const shuffled = [...gradeEmojis].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setGameOver(false);
    setCorrectCount(0);
    setShowEmoji(true);
    setGrade(g);
    if (shuffled.length > 0) {
      setOptions(generateOptions(shuffled[0].english, g));
    }
    const saved = localStorage.getItem(`emojiGame_best_${g}`);
    if (saved) setBestScore(parseInt(saved));
    else setBestScore(0);
  }, [generateOptions]);

  const currentQ = questions[currentIndex];

  const handleSelect = (answer: string) => {
    if (selected !== null) return;
    setSelected(answer);
    speak(currentQ.english);

    const correct = answer === currentQ.english;
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((s) => s + 10 + (newStreak > 1 ? newStreak * 3 : 0));
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        const finalScore = correct
          ? score + 10 + ((streak + 1) > 1 ? (streak + 1) * 3 : 0)
          : score;
        setGameOver(true);
        if (grade !== null && finalScore > bestScore) {
          localStorage.setItem(`emojiGame_best_${grade}`, finalScore.toString());
          setBestScore(finalScore);
        }
      } else {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setSelected(null);
        setShowEmoji(true);
        setOptions(generateOptions(questions[nextIndex].english, grade!));
      }
    }, 1200);
  };

  // Grade selection
  if (grade === null) {
    return (
      <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
        <div style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          borderRadius: "0 0 28px 28px",
          padding: "48px 20px 28px",
        }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 12px", marginBottom: 16 }}>
            <ArrowLeft style={{ width: 20, height: 20, color: "#fff" }} />
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>😄 Emoji猜单词</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6 }}>看Emoji表情，猜出对应的英文单词！</p>
        </div>
        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {Object.entries(gradeNames).map(([g, name]) => {
            const count = emojiWords.filter((w) => w.grade === Number(g)).length;
            return (
              <button key={g} onClick={() => startGame(Number(g))} style={{
                background: "#fff", border: "none", borderRadius: 16, padding: "24px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center",
                opacity: count < 4 ? 0.5 : 1,
                pointerEvents: count < 4 ? "none" : "auto",
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>
                  {["📖", "📚", "📝", "🎯", "🏆", "🎓"][Number(g) - 1]}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{count} 个Emoji</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Game over
  if (gameOver) {
    const total = questions.length;
    const percent = Math.round((correctCount / total) * 100);
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px 28px", textAlign: "center", margin: 20, width: "100%", maxWidth: 360 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>
            {percent >= 80 ? "🏆" : percent >= 50 ? "👍" : "💪"}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>
            {percent >= 80 ? "太厉害了！" : percent >= 50 ? "做得不错！" : "继续加油！"}
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 24px" }}>
            答对 {correctCount}/{total} 题，正确率 {percent}%
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>{score}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>得分</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#059669" }}>{bestScore < score ? score : bestScore}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>最高分</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => startGame(grade)} style={{
              flex: 1, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff",
              border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700,
            }}>
              <RotateCcw style={{ width: 16, height: 16, display: "inline", verticalAlign: -3, marginRight: 4 }} /> 再来一局
            </button>
            <button onClick={() => setGrade(null)} style={{
              flex: 1, background: "#f1f5f9", color: "#475569",
              border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700,
            }}>
              换年级
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  // Game UI
  return (
    <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
      {/* Top bar */}
      <div style={{
        background: "linear-gradient(135deg, #10b981, #059669)",
        padding: "44px 16px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "6px 10px" }}>
          <ArrowLeft style={{ width: 18, height: 18, color: "#fff" }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
            {currentIndex + 1}/{questions.length}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff" }}>
            <Star style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 18, fontWeight: 800 }}>{score}</span>
          </div>
          {streak > 1 && (
            <div style={{
              background: "#fff", borderRadius: 20, padding: "2px 10px",
              display: "flex", alignItems: "center", gap: 2,
            }}>
              <Zap style={{ width: 14, height: 14, color: "#f59e0b" }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#f59e0b" }}>x{streak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ background: "#e2e8f0", borderRadius: 8, height: 6, overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(90deg, #10b981, #059669)",
            height: "100%", borderRadius: 8,
            width: `${(currentIndex / questions.length) * 100}%`,
            transition: "width 0.3s",
          }} />
        </div>
      </div>

      {/* Emoji display */}
      <div style={{ padding: "24px 16px 0", textAlign: "center" }}>
        <div
          onClick={() => setShowEmoji(!showEmoji)}
          style={{
            background: "#fff", borderRadius: 24, padding: "40px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            display: "inline-block", minWidth: 200,
          }}
        >
          <div style={{
            fontSize: 80, lineHeight: 1.2, marginBottom: 12,
            transition: "transform 0.3s",
            transform: showEmoji ? "scale(1)" : "scale(0.8)",
          }}>
            {currentQ.emoji}
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8" }}>
            这个Emoji是什么单词？
          </div>
          <div style={{ fontSize: 16, color: "#64748b", fontWeight: 600, marginTop: 6 }}>
            {currentQ.chinese}
          </div>
        </div>
      </div>

      {/* Options */}
      <div style={{ padding: "24px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {options.map((opt) => {
          const isCorrect = opt === currentQ.english;
          const isSelected = selected === opt;
          let bg = "#fff";
          let color = "#1a1a2e";
          let border = "2px solid #e2e8f0";
          let shadow = "0 2px 6px rgba(0,0,0,0.04)";

          if (selected !== null) {
            if (isCorrect) {
              bg = "#f0fdf4";
              border = "2px solid #10b981";
              color = "#059669";
              shadow = "0 4px 12px rgba(16,185,129,0.2)";
            } else if (isSelected && !isCorrect) {
              bg = "#fef2f2";
              border = "2px solid #ef4444";
              color = "#dc2626";
              shadow = "0 4px 12px rgba(239,68,68,0.2)";
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              style={{
                background: bg, border, borderRadius: 16,
                padding: "18px 12px", textAlign: "center",
                boxShadow: shadow,
                transition: "all 0.2s",
                transform: isSelected ? "scale(0.97)" : "scale(1)",
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 700, color }}>
                {opt}
              </div>
              {selected !== null && isCorrect && (
                <div style={{ fontSize: 12, color: "#10b981", marginTop: 4 }}>✓ 正确</div>
              )}
              {selected !== null && isSelected && !isCorrect && (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>✗ 错误</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
