import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Volume2, Star, RotateCcw, Heart, Check } from "lucide-react";
import { vocabulary } from "../data/vocabulary";
import { gradeNames } from "../data/vocabulary";
import { speak } from "../utils/speak";

interface SpellingGameProps {
  onBack: () => void;
}

export default function SpellingGame({ onBack }: SpellingGameProps) {
  const [grade, setGrade] = useState<number | null>(null);
  const [words, setWords] = useState<typeof vocabulary>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [bestScore, setBestScore] = useState(0);

  const startGame = useCallback((g: number) => {
    const gradeWords = vocabulary.filter((w) => w.grade === g);
    const shuffled = [...gradeWords].sort(() => Math.random() - 0.5).slice(0, 10);
    setWords(shuffled);
    setCurrentIndex(0);
    setInput("");
    setLives(3);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setShowHint(false);
    setResult(null);
    setGrade(g);
    const saved = localStorage.getItem(`spellingGame_best_${g}`);
    if (saved) setBestScore(parseInt(saved));
    else setBestScore(0);
  }, []);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord && result === null) {
      speak(currentWord.english);
    }
  }, [currentIndex, currentWord, result]);

  const handleSubmit = () => {
    if (!currentWord || result !== null) return;
    const correct = input.trim().toLowerCase() === currentWord.english.toLowerCase();
    if (correct) {
      setResult("correct");
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 10 + (newStreak > 1 ? newStreak * 2 : 0);
      setScore((s) => s + points);
    } else {
      setResult("wrong");
      setStreak(0);
      setLives((l) => l - 1);
    }
  };

  const handleNext = () => {
    if (lives <= 0 && result === "wrong") {
      setGameOver(true);
      if (grade !== null && score > bestScore) {
        localStorage.setItem(`spellingGame_best_${grade}`, score.toString());
        setBestScore(score);
      }
      return;
    }
    if (currentIndex + 1 >= words.length) {
      setGameOver(true);
      if (grade !== null && score > bestScore) {
        localStorage.setItem(`spellingGame_best_${grade}`, score.toString());
        setBestScore(score);
      }
      return;
    }
    setCurrentIndex((i) => i + 1);
    setInput("");
    setResult(null);
    setShowHint(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (result !== null) handleNext();
      else handleSubmit();
    }
  };

  // Grade selection
  if (grade === null) {
    return (
      <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
        <div style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
          borderRadius: "0 0 28px 28px",
          padding: "48px 20px 28px",
        }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 12px", marginBottom: 16 }}>
            <ArrowLeft style={{ width: 20, height: 20, color: "#fff" }} />
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>✏️ 拼写挑战</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6 }}>听发音，看中文，拼出英文单词！</p>
        </div>
        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {Object.entries(gradeNames).map(([g, name]) => (
            <button key={g} onClick={() => startGame(Number(g))} style={{
              background: "#fff", border: "none", borderRadius: 16, padding: "24px 16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center",
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>
                {["📖", "📚", "📝", "🎯", "🏆", "🎓"][Number(g) - 1]}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                {vocabulary.filter((w) => w.grade === Number(g)).length} 个单词
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Game over
  if (gameOver) {
    const total = words.length;
    const answered = currentIndex + (result !== null ? 1 : 0);
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px 28px", textAlign: "center", margin: 20, width: "100%", maxWidth: 360 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{lives > 0 ? "🏆" : "💪"}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>
            {lives > 0 ? "全部完成！" : "挑战结束"}
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 24px" }}>
            答对了 {Math.min(score > 0 ? answered : answered - 1, total)} 题中的大部分
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#3b82f6" }}>{score}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>得分</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#6366f1" }}>{bestScore < score ? score : bestScore}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>最高分</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => startGame(grade)} style={{
              flex: 1, background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff",
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

  if (!currentWord) return null;

  // Game UI
  return (
    <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
      {/* Top bar */}
      <div style={{
        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
        padding: "44px 16px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "6px 10px" }}>
          <ArrowLeft style={{ width: 18, height: 18, color: "#fff" }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3, color: "#fff" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart key={i} style={{ width: 18, height: 18, fill: i < lives ? "#fff" : "none", opacity: i < lives ? 1 : 0.3 }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff" }}>
            <Star style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 18, fontWeight: 800 }}>{score}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ background: "#e2e8f0", borderRadius: 8, height: 6, overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(90deg, #3b82f6, #6366f1)",
            height: "100%", borderRadius: 8,
            width: `${((currentIndex) / words.length) * 100}%`,
            transition: "width 0.3s",
          }} />
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 6 }}>
          第 {currentIndex + 1} / {words.length} 题
        </div>
      </div>

      {/* Word card */}
      <div style={{ padding: "20px 16px" }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "32px 20px", textAlign: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          {/* Play button */}
          <button
            onClick={() => speak(currentWord.english)}
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              border: "none", borderRadius: "50%", width: 64, height: 64,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
            }}
          >
            <Volume2 style={{ width: 28, height: 28, color: "#fff" }} />
          </button>

          {/* Chinese meaning */}
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>
            {currentWord.chinese}
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>
            {currentWord.phonetic}
          </div>

          {/* Hint */}
          {showHint && (
            <div style={{
              background: "#fef3c7", borderRadius: 12, padding: "10px 16px",
              fontSize: 14, color: "#92400e", marginBottom: 16,
            }}>
              提示：{currentWord.english.charAt(0)}{"_ ".repeat(currentWord.english.length - 1).trim()}（{currentWord.english.length}个字母）
            </div>
          )}

          {/* Input */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入英文单词..."
              disabled={result !== null}
              autoFocus
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              style={{
                width: "100%", boxSizing: "border-box",
                fontSize: 20, fontWeight: 600, textAlign: "center",
                padding: "14px 16px", borderRadius: 14,
                border: result === "correct" ? "2px solid #10b981" : result === "wrong" ? "2px solid #ef4444" : "2px solid #e2e8f0",
                background: result === "correct" ? "#f0fdf4" : result === "wrong" ? "#fef2f2" : "#f8fafc",
                outline: "none",
                color: result === "correct" ? "#059669" : result === "wrong" ? "#dc2626" : "#1a1a2e",
              }}
            />
          </div>

          {/* Result feedback */}
          {result === "correct" && (
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#059669", fontWeight: 700 }}>
              <Check style={{ width: 18, height: 18 }} /> 正确！{streak > 1 && `连对 ${streak} 题 🔥`}
            </div>
          )}
          {result === "wrong" && (
            <div style={{ marginTop: 14 }}>
              <div style={{ color: "#dc2626", fontWeight: 700, marginBottom: 4 }}>正确答案：</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#3b82f6" }}>{currentWord.english}</div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {result === null ? (
              <>
                {!showHint && (
                  <button onClick={() => setShowHint(true)} style={{
                    flex: 1, background: "#fef3c7", color: "#92400e",
                    border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600,
                  }}>
                    💡 提示
                  </button>
                )}
                <button onClick={handleSubmit} style={{
                  flex: 2, background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff",
                  border: "none", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 700,
                  opacity: input.trim() ? 1 : 0.5,
                }}>
                  确认
                </button>
              </>
            ) : (
              <button onClick={handleNext} style={{
                flex: 1, background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff",
                border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700,
              }}>
                {currentIndex + 1 >= words.length || (lives <= 0 && result === "wrong") ? "查看结果" : "下一题 →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
