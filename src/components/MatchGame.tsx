import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Clock, Star, RotateCcw, Zap } from "lucide-react";
import { vocabulary } from "../data/vocabulary";
import { gradeNames } from "../data/vocabulary";
import { speak } from "../utils/speak";

interface MatchGameProps {
  onBack: () => void;
}

interface Card {
  id: string;
  text: string;
  wordId: number;
  type: "english" | "chinese";
  matched: boolean;
  flipped: boolean;
}

export default function MatchGame({ onBack }: MatchGameProps) {
  const [grade, setGrade] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [shakeCards, setShakeCards] = useState<string[]>([]);
  const [bestScore, setBestScore] = useState(0);

  const startGame = useCallback((g: number) => {
    const gradeWords = vocabulary.filter((w) => w.grade === g);
    const shuffled = [...gradeWords].sort(() => Math.random() - 0.5).slice(0, 6);
    const cardList: Card[] = [];
    shuffled.forEach((w) => {
      cardList.push({ id: `en-${w.id}`, text: w.english, wordId: w.id, type: "english", matched: false, flipped: false });
      cardList.push({ id: `zh-${w.id}`, text: w.chinese, wordId: w.id, type: "chinese", matched: false, flipped: false });
    });
    cardList.sort(() => Math.random() - 0.5);
    setCards(cardList);
    setSelected([]);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setGameOver(false);
    setMatchedCount(0);
    setTotalPairs(shuffled.length);
    setGrade(g);
    const saved = localStorage.getItem(`matchGame_best_${g}`);
    if (saved) setBestScore(parseInt(saved));
    else setBestScore(0);
  }, []);

  useEffect(() => {
    if (grade === null || gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [grade, gameOver, timeLeft]);

  useEffect(() => {
    if (matchedCount > 0 && matchedCount === totalPairs) {
      setGameOver(true);
      if (grade !== null && score > bestScore) {
        localStorage.setItem(`matchGame_best_${grade}`, score.toString());
        setBestScore(score);
      }
    }
  }, [matchedCount, totalPairs, grade, score, bestScore]);

  const handleCardClick = (cardId: string) => {
    if (gameOver) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.matched || selected.includes(cardId)) return;

    if (card.type === "english") speak(card.text);

    const newSelected = [...selected, cardId];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected.map((id) => cards.find((c) => c.id === id)!);
      if (first.wordId === second.wordId && first.type !== second.type) {
        // Match!
        setTimeout(() => {
          setCards((prev) => prev.map((c) => c.wordId === first.wordId ? { ...c, matched: true } : c));
          setSelected([]);
          setMatchedCount((m) => m + 1);
          const newCombo = combo + 1;
          setCombo(newCombo);
          setScore((s) => s + 10 * newCombo);
        }, 300);
      } else {
        // No match
        setShakeCards(newSelected);
        setTimeout(() => {
          setSelected([]);
          setShakeCards([]);
          setCombo(0);
        }, 600);
      }
    }
  };

  // Grade selection
  if (grade === null) {
    return (
      <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
        <div style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
          borderRadius: "0 0 28px 28px",
          padding: "48px 20px 28px",
        }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 12px", marginBottom: 16 }}>
            <ArrowLeft style={{ width: 20, height: 20, color: "#fff" }} />
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>🎮 单词消消乐</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6 }}>配对英文和中文，限时60秒挑战！</p>
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

  // Game over screen
  if (gameOver) {
    const allMatched = matchedCount === totalPairs;
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(135deg, #f59e0b, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px 28px", textAlign: "center", margin: 20, width: "100%", maxWidth: 360 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{allMatched ? "🎉" : "⏰"}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>
            {allMatched ? "太棒了！" : "时间到！"}
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 24px" }}>
            {allMatched ? `你在${60 - timeLeft}秒内完成了配对！` : `配对了 ${matchedCount}/${totalPairs} 组`}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b" }}>{score}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>得分</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#6366f1" }}>{bestScore < score ? score : bestScore}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>最高分</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => startGame(grade)} style={{
              flex: 1, background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#fff",
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

  // Game board
  return (
    <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
      {/* Top bar */}
      <div style={{
        background: "linear-gradient(135deg, #f59e0b, #ef4444)",
        padding: "44px 16px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "6px 10px" }}>
          <ArrowLeft style={{ width: 18, height: 18, color: "#fff" }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff" }}>
            <Clock style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{timeLeft}s</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff" }}>
            <Star style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 18, fontWeight: 800 }}>{score}</span>
          </div>
          {combo > 1 && (
            <div style={{
              background: "#fff", borderRadius: 20, padding: "2px 10px",
              display: "flex", alignItems: "center", gap: 2,
            }}>
              <Zap style={{ width: 14, height: 14, color: "#f59e0b" }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#f59e0b" }}>x{combo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ background: "#e2e8f0", borderRadius: 8, height: 6, overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(90deg, #f59e0b, #ef4444)",
            height: "100%", borderRadius: 8,
            width: `${(matchedCount / totalPairs) * 100}%`,
            transition: "width 0.3s",
          }} />
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 6 }}>
          {matchedCount} / {totalPairs} 组
        </div>
      </div>

      {/* Card grid */}
      <div style={{
        padding: 12,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
      }}>
        {cards.map((card) => {
          const isSelected = selected.includes(card.id);
          const isShaking = shakeCards.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{
                background: card.matched
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : isSelected
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "#fff",
                border: "none",
                borderRadius: 14,
                padding: "16px 8px",
                minHeight: 70,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isSelected ? "0 4px 16px rgba(99,102,241,0.3)" : "0 2px 6px rgba(0,0,0,0.06)",
                opacity: card.matched ? 0.5 : 1,
                transform: isShaking ? "translateX(-4px)" : isSelected ? "scale(1.05)" : "scale(1)",
                transition: "all 0.2s",
                animation: isShaking ? "shake 0.4s ease" : undefined,
                pointerEvents: card.matched ? "none" : "auto",
              }}
            >
              <span style={{
                fontSize: card.type === "english" ? 14 : 16,
                fontWeight: 700,
                color: card.matched || isSelected ? "#fff" : card.type === "english" ? "#6366f1" : "#1a1a2e",
                wordBreak: "break-word",
              }}>
                {card.matched ? "✓" : card.text}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
        }
      `}</style>
    </div>
  );
}
