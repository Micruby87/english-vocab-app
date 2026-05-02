import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Volume2, Star, RotateCcw, Heart, Check } from "lucide-react";
import { vocabulary } from "../data/vocabulary";
import { gradeNames } from "../data/vocabulary";
import { phonetics } from "../data/phonetics";
import type { Phonetic } from "../data/phonetics";
import { speak } from "../utils/speak";
import { getProgress, saveProgress } from "../utils/storage";

type GameMode = "word" | "phonetic" | "symbols";

interface SpellingGameProps {
  onBack: () => void;
}

export default function SpellingGame({ onBack }: SpellingGameProps) {
  const [mode, setMode] = useState<GameMode | null>(null);
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
  const [phoneticOptions, setPhoneticOptions] = useState<string[]>([]);
  const [selectedPhonetic, setSelectedPhonetic] = useState<string | null>(null);
  const [symbolQuestions, setSymbolQuestions] = useState<Phonetic[]>([]);
  const [symbolOptions, setSymbolOptions] = useState<string[]>([]);
  const [symbolCategory, setSymbolCategory] = useState<string | null>(null);

  const generatePhoneticOptions = useCallback((correctPhonetic: string, gradeNum: number) => {
    const pool = vocabulary
      .filter((w) => w.grade === gradeNum && w.phonetic !== correctPhonetic)
      .map((w) => w.phonetic);
    const unique = [...new Set(pool)];
    const shuffled = unique.sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffled, correctPhonetic].sort(() => Math.random() - 0.5);
  }, []);

  const generateSymbolOptions = useCallback((correct: Phonetic, pool: Phonetic[]) => {
    const others = pool
      .filter((p) => p.symbol !== correct.symbol)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((p) => p.symbol);
    return [...others, correct.symbol].sort(() => Math.random() - 0.5);
  }, []);

  const startSymbolGame = useCallback((cat: string) => {
    const pool = cat === "all" ? phonetics : phonetics.filter((p) => p.type === cat);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 12);
    setSymbolQuestions(shuffled);
    setCurrentIndex(0);
    setInput("");
    setLives(3);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setResult(null);
    setSelectedPhonetic(null);
    setSymbolCategory(cat);
    setGrade(-1);
    if (shuffled.length > 0) {
      setSymbolOptions(generateSymbolOptions(shuffled[0], pool));
    }
    const saved = localStorage.getItem(`symbolGame_best_${cat}`);
    if (saved) setBestScore(parseInt(saved));
    else setBestScore(0);
  }, [generateSymbolOptions]);

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
    setSelectedPhonetic(null);
    setGrade(g);
    if (mode === "phonetic" && shuffled.length > 0) {
      setPhoneticOptions(generatePhoneticOptions(shuffled[0].phonetic, g));
    }
    const storageKey = mode === "phonetic" ? `phoneticGame_best_${g}` : `spellingGame_best_${g}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) setBestScore(parseInt(saved));
    else setBestScore(0);
  }, [mode, generatePhoneticOptions]);

  const currentSymbol = symbolQuestions[currentIndex];

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (mode === "symbols" && currentSymbol && result === null) {
      speak(currentSymbol.exampleWord);
    } else if (currentWord && result === null) {
      speak(currentWord.english);
    }
  }, [currentIndex, currentWord, currentSymbol, result, mode]);

  const saveBest = useCallback(() => {
    if (score > bestScore) {
      let storageKey: string;
      if (mode === "symbols") storageKey = `symbolGame_best_${symbolCategory}`;
      else if (mode === "phonetic") storageKey = `phoneticGame_best_${grade}`;
      else storageKey = `spellingGame_best_${grade}`;
      localStorage.setItem(storageKey, score.toString());
      setBestScore(score);
    }
    // Award gold coins based on score
    const goldReward = Math.floor(score / 10); // 1 gold per 10 points
    const progress = getProgress();
    progress.gold = (progress.gold || 0) + goldReward;
    saveProgress(progress);
  }, [grade, score, bestScore, mode, symbolCategory]);

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

  const handleSymbolSelect = (selected: string) => {
    if (!currentSymbol || selectedPhonetic !== null) return;
    setSelectedPhonetic(selected);
    const correct = selected === currentSymbol.symbol;
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

  const handlePhoneticSelect = (selected: string) => {
    if (!currentWord || selectedPhonetic !== null) return;
    setSelectedPhonetic(selected);
    const correct = selected === currentWord.phonetic;
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
      saveBest();
      return;
    }
    const totalLen = mode === "symbols" ? symbolQuestions.length : words.length;
    if (currentIndex + 1 >= totalLen) {
      setGameOver(true);
      saveBest();
      return;
    }
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setInput("");
    setResult(null);
    setShowHint(false);
    setSelectedPhonetic(null);
    if (mode === "symbols" && symbolCategory !== null) {
      const pool = symbolCategory === "all" ? phonetics : phonetics.filter((p) => p.type === symbolCategory);
      setSymbolOptions(generateSymbolOptions(symbolQuestions[nextIndex], pool));
    } else if (mode === "phonetic" && grade !== null) {
      setPhoneticOptions(generatePhoneticOptions(words[nextIndex].phonetic, grade));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (result !== null) handleNext();
      else handleSubmit();
    }
  };

  const goToModeSelect = () => { setMode(null); setGrade(null); setSymbolCategory(null); };

  // Mode selection
  if (mode === null) {
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
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6 }}>选择挑战模式开始学习！</p>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <button onClick={() => setMode("word")} style={{
            background: "#fff", border: "none", borderRadius: 18, padding: "24px 20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)", textAlign: "left",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: 28 }}>✏️</span>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>单词拼写</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>听发音，看中文，拼出英文单词</div>
            </div>
          </button>
          <button onClick={() => setMode("phonetic")} style={{
            background: "#fff", border: "none", borderRadius: 18, padding: "24px 20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)", textAlign: "left",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: 28 }}>🔤</span>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>音标听写</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>听发音，看单词，选出正确音标</div>
            </div>
          </button>
          <button onClick={() => setMode("symbols")} style={{
            background: "#fff", border: "none", borderRadius: 18, padding: "24px 20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)", textAlign: "left",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: 28 }}>🎯</span>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>48音标符号</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>听例词发音，选出对应的音标符号</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Symbols category selection
  if (mode === "symbols" && grade === null) {
    return (
      <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
        <div style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          borderRadius: "0 0 28px 28px",
          padding: "48px 20px 28px",
        }}>
          <button onClick={goToModeSelect} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 12px", marginBottom: 16 }}>
            <ArrowLeft style={{ width: 20, height: 20, color: "#fff" }} />
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>🎯 48音标符号</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6 }}>听例词发音，选出对应的音标符号！</p>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => startSymbolGame("all")} style={{
            background: "#fff", border: "none", borderRadius: 16, padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "left",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ fontSize: 36 }}>🎲</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>全部音标</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>48个音标随机出题</div>
            </div>
          </button>
          <button onClick={() => startSymbolGame("vowel")} style={{
            background: "#fff", border: "none", borderRadius: 16, padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "left",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ fontSize: 36 }}>🅰️</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>元音（20个）</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>长元音 · 短元音 · 双元音</div>
            </div>
          </button>
          <button onClick={() => startSymbolGame("consonant")} style={{
            background: "#fff", border: "none", borderRadius: 16, padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "left",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ fontSize: 36 }}>🅱️</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>辅音（28个）</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>爆破音 · 摩擦音 · 破擦音 · 鼻音 ...</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Grade selection
  if (grade === null) {
    const isPhonetic = mode === "phonetic";
    return (
      <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
        <div style={{
          background: isPhonetic
            ? "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
            : "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
          borderRadius: "0 0 28px 28px",
          padding: "48px 20px 28px",
        }}>
          <button onClick={goToModeSelect} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 12px", marginBottom: 16 }}>
            <ArrowLeft style={{ width: 20, height: 20, color: "#fff" }} />
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>
            {isPhonetic ? "🔤 音标听写" : "✏️ 单词拼写"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6 }}>
            {isPhonetic ? "听发音，看单词，选出正确的音标！" : "听发音，看中文，拼出英文单词！"}
          </p>
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

  const isPhonetic = mode === "phonetic";
  const isSymbols = mode === "symbols";
  const gradientStyle = isSymbols
    ? "linear-gradient(135deg, #10b981, #059669)"
    : isPhonetic
    ? "linear-gradient(135deg, #f59e0b, #ef4444)"
    : "linear-gradient(135deg, #3b82f6, #6366f1)";
  const accentColor = isSymbols ? "#10b981" : isPhonetic ? "#f59e0b" : "#3b82f6";
  const totalLen = isSymbols ? symbolQuestions.length : words.length;

  // Game over
  if (gameOver) {
    const answered = currentIndex + (result !== null ? 1 : 0);
    const handleReplay = () => {
      if (isSymbols && symbolCategory) startSymbolGame(symbolCategory);
      else if (grade !== null && grade > 0) startGame(grade);
    };
    return (
      <div style={{ minHeight: "100dvh", background: gradientStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px 28px", textAlign: "center", margin: 20, width: "100%", maxWidth: 360 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{lives > 0 ? "🏆" : "💪"}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>
            {lives > 0 ? "全部完成！" : "挑战结束"}
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 24px" }}>
            答对了 {Math.min(score > 0 ? answered : answered - 1, totalLen)} 题中的大部分
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: accentColor }}>{score}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>得分</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: accentColor }}>{bestScore < score ? score : bestScore}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>最高分</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleReplay} style={{
              flex: 1, background: gradientStyle, color: "#fff",
              border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700,
            }}>
              <RotateCcw style={{ width: 16, height: 16, display: "inline", verticalAlign: -3, marginRight: 4 }} /> 再来一局
            </button>
            <button onClick={goToModeSelect} style={{
              flex: 1, background: "#f1f5f9", color: "#475569",
              border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700,
            }}>
              换模式
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSymbols && !currentSymbol) return null;
  if (!isSymbols && !currentWord) return null;

  // Game UI
  return (
    <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
      {/* Top bar */}
      <div style={{
        background: gradientStyle,
        padding: "44px 16px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "6px 10px" }}>
          <ArrowLeft style={{ width: 18, height: 18, color: "#fff" }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "3px 10px",
            fontSize: 12, fontWeight: 600, color: "#fff",
          }}>
            {isSymbols ? "🎯 音标符号" : isPhonetic ? "🔤 音标" : "✏️ 拼写"}
          </div>
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
            background: isSymbols ? "linear-gradient(90deg, #10b981, #059669)" : isPhonetic ? "linear-gradient(90deg, #f59e0b, #ef4444)" : "linear-gradient(90deg, #3b82f6, #6366f1)",
            height: "100%", borderRadius: 8,
            width: `${((currentIndex) / totalLen) * 100}%`,
            transition: "width 0.3s",
          }} />
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 6 }}>
          第 {currentIndex + 1} / {totalLen} 题
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
            onClick={() => speak(isSymbols ? currentSymbol!.exampleWord : currentWord!.english)}
            style={{
              background: gradientStyle,
              border: "none", borderRadius: "50%", width: 64, height: 64,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", boxShadow: `0 4px 16px rgba(0,0,0,0.15)`,
            }}
          >
            <Volume2 style={{ width: 28, height: 28, color: "#fff" }} />
          </button>

          {isSymbols && currentSymbol ? (
            <>
              {/* Symbols mode: show example word, ask for phonetic symbol */}
              <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>
                {currentSymbol.exampleWord}
              </div>
              <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 4 }}>
                {currentSymbol.exampleChinese}
              </div>
              <div style={{
                display: "inline-block", background: "#ecfdf5", borderRadius: 8,
                padding: "3px 10px", fontSize: 12, color: "#059669", fontWeight: 600, marginBottom: 16,
              }}>
                {currentSymbol.category}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#64748b", marginBottom: 14 }}>
                这个例词包含哪个音标？
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {symbolOptions.map((opt) => {
                  const isCorrectOpt = opt === currentSymbol.symbol;
                  const isSelectedOpt = selectedPhonetic === opt;
                  let bg = "#f8fafc";
                  let border = "2px solid #e2e8f0";
                  let color = "#1a1a2e";
                  if (selectedPhonetic !== null) {
                    if (isCorrectOpt) { bg = "#f0fdf4"; border = "2px solid #10b981"; color = "#059669"; }
                    else if (isSelectedOpt) { bg = "#fef2f2"; border = "2px solid #ef4444"; color = "#dc2626"; }
                  }
                  return (
                    <button key={opt} onClick={() => handleSymbolSelect(opt)} disabled={selectedPhonetic !== null}
                      style={{ background: bg, border, borderRadius: 14, padding: "14px 8px", textAlign: "center", transition: "all 0.2s" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color }}>{opt}</div>
                      {selectedPhonetic !== null && isCorrectOpt && <div style={{ fontSize: 11, color: "#10b981", marginTop: 3 }}>✓ 正确</div>}
                      {selectedPhonetic !== null && isSelectedOpt && !isCorrectOpt && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>✗ 错误</div>}
                    </button>
                  );
                })}
              </div>

              {result === "correct" && (
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#059669", fontWeight: 700 }}>
                  <Check style={{ width: 18, height: 18 }} /> 正确！{streak > 1 && `连对 ${streak} 题 🔥`}
                </div>
              )}
              {result === "wrong" && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ color: "#dc2626", fontWeight: 700, marginBottom: 4 }}>正确答案：</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>{currentSymbol.symbol}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{currentSymbol.tip}</div>
                </div>
              )}

              {result !== null && (
                <div style={{ marginTop: 16 }}>
                  <button onClick={handleNext} style={{
                    width: "100%", background: gradientStyle, color: "#fff",
                    border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700,
                  }}>
                    {currentIndex + 1 >= symbolQuestions.length || (lives <= 0 && result === "wrong") ? "查看结果" : "下一题 →"}
                  </button>
                </div>
              )}
            </>
          ) : isPhonetic && currentWord ? (
            <>
              {/* Phonetic mode: show English word, ask for phonetic */}
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>
                {currentWord.english}
              </div>
              <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>
                {currentWord.chinese}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#64748b", marginBottom: 16 }}>
                请选择正确的音标：
              </div>

              {/* Phonetic options */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {phoneticOptions.map((opt) => {
                  const isCorrect = opt === currentWord.phonetic;
                  const isSelected = selectedPhonetic === opt;
                  let bg = "#f8fafc";
                  let border = "2px solid #e2e8f0";
                  let color = "#1a1a2e";

                  if (selectedPhonetic !== null) {
                    if (isCorrect) {
                      bg = "#f0fdf4";
                      border = "2px solid #10b981";
                      color = "#059669";
                    } else if (isSelected && !isCorrect) {
                      bg = "#fef2f2";
                      border = "2px solid #ef4444";
                      color = "#dc2626";
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handlePhoneticSelect(opt)}
                      disabled={selectedPhonetic !== null}
                      style={{
                        background: bg, border, borderRadius: 14,
                        padding: "14px 8px", textAlign: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontSize: 17, fontWeight: 700, color }}>{opt}</div>
                      {selectedPhonetic !== null && isCorrect && (
                        <div style={{ fontSize: 11, color: "#10b981", marginTop: 3 }}>✓ 正确</div>
                      )}
                      {selectedPhonetic !== null && isSelected && !isCorrect && (
                        <div style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>✗ 错误</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Result feedback for phonetic */}
              {result === "correct" && (
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#059669", fontWeight: 700 }}>
                  <Check style={{ width: 18, height: 18 }} /> 正确！{streak > 1 && `连对 ${streak} 题 🔥`}
                </div>
              )}
              {result === "wrong" && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ color: "#dc2626", fontWeight: 700, marginBottom: 4 }}>正确音标：</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>{currentWord.phonetic}</div>
                </div>
              )}

              {/* Next button for phonetic */}
              {result !== null && (
                <div style={{ marginTop: 16 }}>
                  <button onClick={handleNext} style={{
                    width: "100%", background: gradientStyle, color: "#fff",
                    border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700,
                  }}>
                    {currentIndex + 1 >= words.length || (lives <= 0 && result === "wrong") ? "查看结果" : "下一题 →"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Word spelling mode */}
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
                      flex: 2, background: gradientStyle, color: "#fff",
                      border: "none", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 700,
                      opacity: input.trim() ? 1 : 0.5,
                    }}>
                      确认
                    </button>
                  </>
                ) : (
                  <button onClick={handleNext} style={{
                    flex: 1, background: gradientStyle, color: "#fff",
                    border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700,
                  }}>
                    {currentIndex + 1 >= words.length || (lives <= 0 && result === "wrong") ? "查看结果" : "下一题 →"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
