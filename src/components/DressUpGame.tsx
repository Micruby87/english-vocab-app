import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Heart, Sparkles, RotateCcw } from "lucide-react";
import { vocabulary, gradeNames } from "../data/vocabulary";
import { speak } from "../utils/speak";

interface DressUpGameProps {
  onBack: () => void;
}

interface OutfitSlot {
  name: string;
  emoji: string;
  unlocked: boolean;
}

interface Theme {
  name: string;
  icon: string;
  bgGradient: string;
  character: string;
  slots: { name: string; emoji: string }[];
}

const themes: Theme[] = [
  {
    name: "公主风",
    icon: "👑",
    bgGradient: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
    character: "👩",
    slots: [
      { name: "皇冠", emoji: "👑" },
      { name: "礼服", emoji: "👗" },
      { name: "高跟鞋", emoji: "👠" },
      { name: "手包", emoji: "👜" },
      { name: "戒指", emoji: "💍" },
      { name: "魔法棒", emoji: "✨" },
    ],
  },
  {
    name: "运动风",
    icon: "🏃‍♀️",
    bgGradient: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    character: "🧑",
    slots: [
      { name: "发带", emoji: "🎀" },
      { name: "运动衫", emoji: "🎽" },
      { name: "运动裤", emoji: "👖" },
      { name: "运动鞋", emoji: "👟" },
      { name: "墨镜", emoji: "🕶️" },
      { name: "水壶", emoji: "🥤" },
    ],
  },
  {
    name: "校园风",
    icon: "🎒",
    bgGradient: "linear-gradient(135deg, #fef9c3, #fde68a)",
    character: "👧",
    slots: [
      { name: "蝴蝶结", emoji: "🎀" },
      { name: "衬衫", emoji: "👚" },
      { name: "短裙", emoji: "👗" },
      { name: "小白鞋", emoji: "🥿" },
      { name: "书包", emoji: "🎒" },
      { name: "手表", emoji: "⌚" },
    ],
  },
  {
    name: "派对风",
    icon: "🎉",
    bgGradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
    character: "💃",
    slots: [
      { name: "礼帽", emoji: "🎩" },
      { name: "亮片裙", emoji: "💃" },
      { name: "高跟鞋", emoji: "👠" },
      { name: "项链", emoji: "📿" },
      { name: "口红", emoji: "💄" },
      { name: "香水", emoji: "🌸" },
    ],
  },
  {
    name: "海滩风",
    icon: "🏖️",
    bgGradient: "linear-gradient(135deg, #cffafe, #a5f3fc)",
    character: "👩",
    slots: [
      { name: "遮阳帽", emoji: "👒" },
      { name: "比基尼", emoji: "👙" },
      { name: "凉鞋", emoji: "🩴" },
      { name: "太阳镜", emoji: "🕶️" },
      { name: "防晒霜", emoji: "🧴" },
      { name: "贝壳", emoji: "🐚" },
    ],
  },
  {
    name: "甜美风",
    icon: "🍰",
    bgGradient: "linear-gradient(135deg, #fce7f3, #f9a8d4)",
    character: "👧",
    slots: [
      { name: "花环", emoji: "🌺" },
      { name: "连衣裙", emoji: "👗" },
      { name: "芭蕾鞋", emoji: "🩰" },
      { name: "手链", emoji: "📿" },
      { name: "蝴蝶", emoji: "🦋" },
      { name: "棒棒糖", emoji: "🍭" },
    ],
  },
];

function generateQuestion(gradeWords: typeof vocabulary) {
  const type = Math.random() > 0.5 ? "en2cn" : "cn2en";
  const shuffled = [...gradeWords].sort(() => Math.random() - 0.5);
  const word = shuffled[0];
  if (type === "en2cn") {
    const distractors = shuffled.filter((w) => w.id !== word.id).slice(0, 3).map((w) => w.chinese);
    const options = [...distractors, word.chinese].sort(() => Math.random() - 0.5);
    return { prompt: word.english, correctAnswer: word.chinese, options, type, word };
  } else {
    const distractors = shuffled.filter((w) => w.id !== word.id).slice(0, 3).map((w) => w.english);
    const options = [...distractors, word.english].sort(() => Math.random() - 0.5);
    return { prompt: word.chinese, correctAnswer: word.english, options, type, word };
  }
}

export default function DressUpGame({ onBack }: DressUpGameProps) {
  const [grade, setGrade] = useState<number | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [outfitSlots, setOutfitSlots] = useState<OutfitSlot[]>([]);
  const [question, setQuestion] = useState<ReturnType<typeof generateQuestion> | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [lives, setLives] = useState(3);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [gradeWords, setGradeWords] = useState<typeof vocabulary>([]);
  const [sparkle, setSparkle] = useState(false);
  const [completedThemes, setCompletedThemes] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("dressup_completed");
    if (saved) setCompletedThemes(JSON.parse(saved));
  }, []);

  const startTheme = useCallback((t: Theme, g: number) => {
    const words = vocabulary.filter((w) => w.grade === g);
    setGradeWords(words);
    setTheme(t);
    setOutfitSlots(t.slots.map((s) => ({ ...s, unlocked: false })));
    setCurrentSlot(0);
    setLives(3);
    setGameOver(false);
    setCompleted(false);
    setSelected(null);
    setResult(null);
    setQuestion(generateQuestion(words));
  }, []);

  useEffect(() => {
    if (question && result === null) {
      speak(question.word.english);
    }
  }, [question, result]);

  const handleSelect = (opt: string) => {
    if (selected !== null || !question) return;
    setSelected(opt);
    if (opt === question.correctAnswer) {
      setResult("correct");
      setSparkle(true);
      setTimeout(() => setSparkle(false), 800);
      // Unlock current slot
      setOutfitSlots((slots) =>
        slots.map((s, i) => (i === currentSlot ? { ...s, unlocked: true } : s))
      );
    } else {
      setResult("wrong");
      setLives((l) => l - 1);
    }
  };

  const handleNext = () => {
    if (!theme) return;

    // Check if lost all lives
    if (lives <= 0 && result === "wrong") {
      setGameOver(true);
      return;
    }

    // If correct, move to next slot
    if (result === "correct") {
      const nextSlot = currentSlot + 1;
      if (nextSlot >= theme.slots.length) {
        // All slots unlocked - completed!
        setCompleted(true);
        const newCompleted = [...new Set([...completedThemes, theme.name])];
        setCompletedThemes(newCompleted);
        localStorage.setItem("dressup_completed", JSON.stringify(newCompleted));
        return;
      }
      setCurrentSlot(nextSlot);
    }

    setQuestion(generateQuestion(gradeWords));
    setSelected(null);
    setResult(null);
  };

  // Grade selection
  if (grade === null) {
    return (
      <div style={{ minHeight: "100dvh", background: "#fff5f7" }}>
        <div style={{
          background: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
          borderRadius: "0 0 28px 28px",
          padding: "48px 20px 28px",
        }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 12px", marginBottom: 16 }}>
            <ArrowLeft style={{ width: 20, height: 20, color: "#fff" }} />
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>👗 单词穿搭秀</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 6 }}>答对单词解锁服饰，打造你的专属穿搭！</p>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af", marginBottom: 4 }}>选择年级开始穿搭</div>
          {Object.entries(gradeNames).map(([g, name]) => (
            <button key={g} onClick={() => setGrade(Number(g))} style={{
              background: "#fff", border: "none", borderRadius: 16, padding: "18px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "left",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, #ec4899, #f472b6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: "#fff", fontWeight: 800,
                }}>{g}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{name}</div>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {vocabulary.filter((w) => w.grade === Number(g)).length} 个单词
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Theme selection
  if (theme === null) {
    return (
      <div style={{ minHeight: "100dvh", background: "#fff5f7" }}>
        <div style={{
          background: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
          borderRadius: "0 0 28px 28px",
          padding: "48px 20px 28px",
        }}>
          <button onClick={() => setGrade(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 12px", marginBottom: 16 }}>
            <ArrowLeft style={{ width: 20, height: 20, color: "#fff" }} />
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>👗 选择穿搭主题</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 6 }}>每个主题6件单品，答对6题即可完成！</p>
        </div>
        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {themes.map((t) => {
            const isDone = completedThemes.includes(t.name);
            return (
              <button key={t.name} onClick={() => startTheme(t, grade)} style={{
                background: t.bgGradient, border: isDone ? "2px solid #10b981" : "2px solid transparent",
                borderRadius: 18, padding: "20px 14px", textAlign: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)", position: "relative",
              }}>
                {isDone && (
                  <div style={{
                    position: "absolute", top: 8, right: 8,
                    background: "#10b981", borderRadius: 8, padding: "2px 6px",
                    fontSize: 10, color: "#fff", fontWeight: 700,
                  }}>✓ 已完成</div>
                )}
                <div style={{ fontSize: 40, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>
                  {t.slots.map((s, i) => <span key={i}>{s.emoji}</span>)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Completed screen
  if (completed) {
    return (
      <div style={{
        minHeight: "100dvh", background: theme.bgGradient,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: "#fff", borderRadius: 24, padding: "36px 24px",
          textAlign: "center", margin: 20, width: "100%", maxWidth: 360,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}>
            ✨ 穿搭完成！
          </div>

          {/* Show dressed character */}
          <div style={{
            background: theme.bgGradient, borderRadius: 20, padding: "24px 16px",
            marginBottom: 20, position: "relative", overflow: "hidden",
          }}>
            <div style={{ fontSize: 56, marginBottom: 10 }}>{theme.character}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
              {outfitSlots.map((s, i) => (
                <div key={i} style={{
                  fontSize: 28, animation: `bounceIn 0.5s ${i * 0.15}s both`,
                }}>
                  {s.emoji}
                </div>
              ))}
            </div>
            <div style={{
              fontSize: 16, fontWeight: 700, color: "#6b21a8", marginTop: 10,
            }}>
              {theme.icon} {theme.name}
            </div>
          </div>

          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
            太棒了！你完成了「{theme.name}」主题穿搭 🎉
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setTheme(null); }} style={{
              flex: 1, background: "linear-gradient(135deg, #ec4899, #f472b6)", color: "#fff",
              border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700,
            }}>
              <Sparkles style={{ width: 16, height: 16, display: "inline", verticalAlign: -3, marginRight: 4 }} />
              换主题
            </button>
            <button onClick={() => { setGrade(null); setTheme(null); }} style={{
              flex: 1, background: "#f1f5f9", color: "#475569",
              border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700,
            }}>
              换年级
            </button>
          </div>
        </div>

        <style>{`
          @keyframes bounceIn {
            0% { transform: scale(0) rotate(-20deg); opacity: 0; }
            60% { transform: scale(1.2) rotate(5deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Game over (lost all lives)
  if (gameOver) {
    const unlocked = outfitSlots.filter((s) => s.unlocked).length;
    return (
      <div style={{
        minHeight: "100dvh", background: theme.bgGradient,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: "#fff", borderRadius: 24, padding: "36px 24px",
          textAlign: "center", margin: 20, width: "100%", maxWidth: 360,
        }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>😢</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>穿搭未完成</h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 20px" }}>
            解锁了 {unlocked}/{theme.slots.length} 件单品
          </p>

          <div style={{
            background: theme.bgGradient, borderRadius: 16, padding: "16px",
            marginBottom: 20, display: "flex", justifyContent: "center", gap: 8,
          }}>
            {outfitSlots.map((s, i) => (
              <div key={i} style={{
                fontSize: 28, opacity: s.unlocked ? 1 : 0.2,
                filter: s.unlocked ? "none" : "grayscale(1)",
              }}>
                {s.emoji}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => startTheme(theme, grade)} style={{
              flex: 1, background: "linear-gradient(135deg, #ec4899, #f472b6)", color: "#fff",
              border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700,
            }}>
              <RotateCcw style={{ width: 16, height: 16, display: "inline", verticalAlign: -3, marginRight: 4 }} />
              再试一次
            </button>
            <button onClick={() => { setTheme(null); }} style={{
              flex: 1, background: "#f1f5f9", color: "#475569",
              border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700,
            }}>
              换主题
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const progress = outfitSlots.filter((s) => s.unlocked).length;
  const total = outfitSlots.length;
  const nextItem = outfitSlots[currentSlot];

  return (
    <div style={{ minHeight: "100dvh", background: "#fff5f7" }}>
      {/* Top bar */}
      <div style={{
        background: "linear-gradient(135deg, #ec4899, #f472b6)",
        padding: "44px 16px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "6px 10px" }}>
          <ArrowLeft style={{ width: 18, height: 18, color: "#fff" }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "3px 10px",
            fontSize: 12, fontWeight: 700, color: "#fff",
          }}>
            {theme.icon} {theme.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3, color: "#fff" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart key={i} style={{ width: 18, height: 18, fill: i < lives ? "#fff" : "none", opacity: i < lives ? 1 : 0.3 }} />
            ))}
          </div>
        </div>
      </div>

      {/* Progress: outfit slots */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "14px 16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ fontSize: 32 }}>{theme.character}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: 600 }}>
              穿搭进度 {progress}/{total}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {outfitSlots.map((s, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: s.unlocked ? theme.bgGradient : "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, border: i === currentSlot && !s.unlocked ? "2px dashed #ec4899" : "2px solid transparent",
                  opacity: s.unlocked ? 1 : 0.5,
                  transition: "all 0.3s",
                  animation: s.unlocked && sparkle && i === currentSlot ? "sparkleIn 0.6s" : "none",
                }}>
                  {s.unlocked ? s.emoji : "?"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next unlock hint */}
      <div style={{ padding: "10px 16px 0", textAlign: "center" }}>
        <span style={{
          display: "inline-block", background: "#fce7f3", borderRadius: 10,
          padding: "4px 14px", fontSize: 13, fontWeight: 600, color: "#db2777",
        }}>
          答对即可解锁：{nextItem?.emoji} {nextItem?.name}
        </span>
      </div>

      {/* Question card */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "24px 18px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center",
        }}>
          <div style={{ marginBottom: 6 }}>
            <span style={{
              display: "inline-block", background: question.type === "en2cn" ? "#eff6ff" : "#fef3c7",
              borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 600,
              color: question.type === "en2cn" ? "#3b82f6" : "#d97706",
            }}>
              {question.type === "en2cn" ? "英 → 中" : "中 → 英"}
            </span>
          </div>

          <button onClick={() => speak(question.word.english)} style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1a2e", marginBottom: 2 }}>
              {question.prompt}
            </div>
          </button>
          {question.type === "en2cn" && (
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 14 }}>{question.word.phonetic}</div>
          )}
          {question.type === "cn2en" && <div style={{ height: 14 }} />}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {question.options.map((opt) => {
              const isCorrect = opt === question.correctAnswer;
              const isSelected = selected === opt;
              let bg = "#fdf2f8";
              let border = "2px solid #fce7f3";
              let color = "#1a1a2e";

              if (selected !== null) {
                if (isCorrect) { bg = "#f0fdf4"; border = "2px solid #10b981"; color = "#059669"; }
                else if (isSelected && !isCorrect) { bg = "#fef2f2"; border = "2px solid #ef4444"; color = "#dc2626"; }
              }

              return (
                <button key={opt} onClick={() => handleSelect(opt)} disabled={selected !== null}
                  style={{
                    background: bg, border, borderRadius: 12, padding: "12px 16px",
                    textAlign: "left", fontSize: 15, fontWeight: 600, color, transition: "all 0.2s",
                  }}>
                  {opt}
                  {selected !== null && isCorrect && <span style={{ float: "right", color: "#10b981" }}>✓</span>}
                  {selected !== null && isSelected && !isCorrect && <span style={{ float: "right", color: "#ef4444" }}>✗</span>}
                </button>
              );
            })}
          </div>

          {result === "correct" && (
            <div style={{ marginTop: 14, color: "#db2777", fontWeight: 700, fontSize: 14 }}>
              <Sparkles style={{ width: 16, height: 16, display: "inline", verticalAlign: -3 }} /> 解锁了 {outfitSlots[currentSlot].emoji} {outfitSlots[currentSlot].name}！
            </div>
          )}
          {result === "wrong" && (
            <div style={{ marginTop: 14 }}>
              <div style={{ color: "#dc2626", fontWeight: 700, fontSize: 14 }}>答错了 😿</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                正确答案：<strong>{question.correctAnswer}</strong>
              </div>
            </div>
          )}

          {result !== null && (
            <button onClick={handleNext} style={{
              width: "100%", marginTop: 14,
              background: "linear-gradient(135deg, #ec4899, #f472b6)", color: "#fff",
              border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700,
            }}>
              {lives <= 0 && result === "wrong"
                ? "查看结果"
                : result === "correct" && currentSlot + 1 >= total
                ? "🎉 查看穿搭"
                : "下一题 →"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes sparkleIn {
          0% { transform: scale(1); }
          30% { transform: scale(1.4) rotate(10deg); }
          60% { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
