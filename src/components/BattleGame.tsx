import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Heart, Zap, Shield, Swords } from "lucide-react";
import { vocabulary, gradeNames } from "../data/vocabulary";
import { speak } from "../utils/speak";

interface BattleGameProps {
  onBack: () => void;
}

interface Monster {
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  attack: number;
  isBoss: boolean;
}

interface Question {
  prompt: string;
  correctAnswer: string;
  options: string[];
  type: "en2cn" | "cn2en";
  word: typeof vocabulary[0];
}

const monsterPool = [
  { name: "小蘑菇", emoji: "🍄", hpBase: 10, atk: 8 },
  { name: "史莱姆", emoji: "🟢", hpBase: 12, atk: 8 },
  { name: "小蝙蝠", emoji: "🦇", hpBase: 14, atk: 10 },
  { name: "毒蘑菇", emoji: "🍄", hpBase: 16, atk: 10 },
  { name: "幽灵", emoji: "👻", hpBase: 18, atk: 12 },
  { name: "骷髅兵", emoji: "💀", hpBase: 20, atk: 14 },
  { name: "石头人", emoji: "🗿", hpBase: 22, atk: 14 },
  { name: "暗影刺客", emoji: "🥷", hpBase: 24, atk: 16 },
];

const bossPool = [
  { name: "毒蛇王", emoji: "🐍", hpBase: 35, atk: 15 },
  { name: "灰狼首领", emoji: "🐺", hpBase: 50, atk: 18 },
  { name: "火焰龙", emoji: "🐉", hpBase: 70, atk: 22 },
  { name: "暗黑魔王", emoji: "👹", hpBase: 90, atk: 25 },
];

function getMonster(level: number): Monster {
  const isBoss = level % 5 === 0;
  const scale = 1 + (level - 1) * 0.08;
  if (isBoss) {
    const bossIdx = Math.min(Math.floor((level / 5) - 1), bossPool.length - 1);
    const b = bossPool[bossIdx];
    const hp = Math.round(b.hpBase * scale);
    return { name: b.name, emoji: b.emoji, hp, maxHp: hp, attack: Math.round(b.atk * scale), isBoss: true };
  }
  const idx = (level - 1) % monsterPool.length;
  const m = monsterPool[idx];
  const hp = Math.round(m.hpBase * scale);
  return { name: m.name, emoji: m.emoji, hp, maxHp: hp, attack: Math.round(m.atk * scale), isBoss: false };
}

function generateQuestion(gradeWords: typeof vocabulary): Question {
  const type = Math.random() > 0.5 ? "en2cn" : "cn2en";
  const shuffled = [...gradeWords].sort(() => Math.random() - 0.5);
  const word = shuffled[0];

  if (type === "en2cn") {
    const distractors = shuffled
      .filter((w) => w.id !== word.id)
      .slice(0, 3)
      .map((w) => w.chinese);
    const options = [...distractors, word.chinese].sort(() => Math.random() - 0.5);
    return { prompt: word.english, correctAnswer: word.chinese, options, type, word };
  } else {
    const distractors = shuffled
      .filter((w) => w.id !== word.id)
      .slice(0, 3)
      .map((w) => w.english);
    const options = [...distractors, word.english].sort(() => Math.random() - 0.5);
    return { prompt: word.chinese, correctAnswer: word.english, options, type, word };
  }
}

export default function BattleGame({ onBack }: BattleGameProps) {
  const [grade, setGrade] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [playerHp, setPlayerHp] = useState(100);
  const [maxPlayerHp] = useState(100);
  const [monster, setMonster] = useState<Monster | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bestLevel, setBestLevel] = useState(0);
  const [shakeMonster, setShakeMonster] = useState(false);
  const [shakePlayer, setShakePlayer] = useState(false);
  const [gold, setGold] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [gradeWords, setGradeWords] = useState<typeof vocabulary>([]);

  const startGame = useCallback((g: number) => {
    const words = vocabulary.filter((w) => w.grade === g);
    setGradeWords(words);
    setGrade(g);
    setLevel(1);
    setPlayerHp(100);
    setStreak(0);
    setGameOver(false);
    setGold(0);
    setSelected(null);
    setResult(null);
    setShowLevelUp(false);
    const m = getMonster(1);
    setMonster(m);
    setQuestion(generateQuestion(words));
    const saved = localStorage.getItem(`battleGame_best_${g}`);
    if (saved) setBestLevel(parseInt(saved));
    else setBestLevel(0);
  }, []);

  useEffect(() => {
    if (question && result === null) {
      speak(question.word.english);
    }
  }, [question, result]);

  const handleSelect = (opt: string) => {
    if (selected !== null || !monster || !question) return;
    setSelected(opt);
    const isCorrect = opt === question.correctAnswer;

    if (isCorrect) {
      setResult("correct");
      const newStreak = streak + 1;
      setStreak(newStreak);
      const baseDmg = 10;
      const streakBonus = Math.min(newStreak - 1, 5) * 3;
      const damage = baseDmg + streakBonus;
      const newHp = Math.max(0, monster.hp - damage);
      setMonster({ ...monster, hp: newHp });
      setShakeMonster(true);
      setTimeout(() => setShakeMonster(false), 400);
      setGold((g) => g + 5 + (monster.isBoss ? 10 : 0));
      // Heal on streak of 3
      if (newStreak > 0 && newStreak % 3 === 0) {
        setPlayerHp((hp) => Math.min(maxPlayerHp, hp + 10));
      }
    } else {
      setResult("wrong");
      setStreak(0);
      const dmg = monster.attack;
      setPlayerHp((hp) => Math.max(0, hp - dmg));
      setShakePlayer(true);
      setTimeout(() => setShakePlayer(false), 400);
    }
  };

  const handleNext = () => {
    if (!monster || !grade) return;

    // Check player dead
    if (playerHp <= 0) {
      setGameOver(true);
      if (level > bestLevel) {
        localStorage.setItem(`battleGame_best_${grade}`, level.toString());
        setBestLevel(level);
      }
      return;
    }

    // Check monster dead → next level
    if (monster.hp <= 0) {
      const newLevel = level + 1;
      setLevel(newLevel);
      const newMonster = getMonster(newLevel);
      setMonster(newMonster);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 1200);
      if (newLevel > bestLevel) {
        localStorage.setItem(`battleGame_best_${grade}`, newLevel.toString());
        setBestLevel(newLevel);
      }
    }

    // Next question
    setQuestion(generateQuestion(gradeWords));
    setSelected(null);
    setResult(null);
  };

  // Grade selection
  if (grade === null) {
    return (
      <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
        <div style={{
          background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          borderRadius: "0 0 28px 28px",
          padding: "48px 20px 28px",
        }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 12px", marginBottom: 16 }}>
            <ArrowLeft style={{ width: 20, height: 20, color: "#fff" }} />
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>⚔️ 单词大冒险</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6 }}>用单词的力量打败怪物，闯关冒险！</p>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(gradeNames).map(([g, name]) => (
            <button key={g} onClick={() => startGame(Number(g))} style={{
              background: "#fff", border: "none", borderRadius: 16, padding: "18px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "left",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
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

  // Game Over
  if (gameOver) {
    return (
      <div style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: "#fff", borderRadius: 24, padding: "40px 28px",
          textAlign: "center", margin: 20, width: "100%", maxWidth: 360,
        }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>💀</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>勇士倒下了...</h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 24px" }}>你在第 {level} 关倒下了</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#dc2626" }}>{level}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>到达关卡</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b" }}>{gold}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>获得金币</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#6366f1" }}>{bestLevel}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>最高纪录</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => startGame(grade)} style={{
              flex: 1, background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff",
              border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700,
            }}>
              <Swords style={{ width: 16, height: 16, display: "inline", verticalAlign: -3, marginRight: 4 }} /> 再战一次
            </button>
            <button onClick={() => { setGrade(null); }} style={{
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

  if (!monster || !question) return null;

  const monsterHpPct = (monster.hp / monster.maxHp) * 100;
  const playerHpPct = (playerHp / maxPlayerHp) * 100;
  const playerHpColor = playerHpPct > 50 ? "#10b981" : playerHpPct > 25 ? "#f59e0b" : "#ef4444";
  const monsterHpColor = monsterHpPct > 50 ? "#ef4444" : monsterHpPct > 25 ? "#f59e0b" : "#10b981";

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
      {/* Top bar */}
      <div style={{ padding: "44px 16px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "6px 10px" }}>
          <ArrowLeft style={{ width: 18, height: 18, color: "#fff" }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "4px 10px",
            fontSize: 13, fontWeight: 700, color: "#fbbf24", display: "flex", alignItems: "center", gap: 4,
          }}>
            ⚔️ 第 {level} 关
          </div>
          <div style={{
            background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "4px 10px",
            fontSize: 13, fontWeight: 700, color: "#fbbf24", display: "flex", alignItems: "center", gap: 4,
          }}>
            🪙 {gold}
          </div>
        </div>
      </div>

      {/* Level Up animation */}
      {showLevelUp && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, animation: "fadeIn 0.3s",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)", borderRadius: 20,
            padding: "32px 40px", textAlign: "center",
          }}>
            <div style={{ fontSize: 48 }}>⚔️</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 8 }}>关卡 {level}！</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
              {monster.isBoss ? "⚠️ BOSS 出现了！" : "新的敌人出现了！"}
            </div>
          </div>
        </div>
      )}

      {/* Battle scene */}
      <div style={{ padding: "12px 16px" }}>
        {/* Monster area */}
        <div style={{
          background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "20px",
          marginBottom: 12, border: monster.isBoss ? "2px solid #fbbf24" : "1px solid rgba(255,255,255,0.08)",
        }}>
          {monster.isBoss && (
            <div style={{
              textAlign: "center", fontSize: 11, fontWeight: 700, color: "#fbbf24",
              marginBottom: 8, letterSpacing: 2,
            }}>
              ⭐ BOSS ⭐
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              fontSize: monster.isBoss ? 56 : 44,
              transform: shakeMonster ? "translateX(-8px)" : "none",
              transition: "transform 0.1s",
              animation: shakeMonster ? "shake 0.4s" : "none",
              filter: monster.hp <= 0 ? "grayscale(1) opacity(0.4)" : "none",
            }}>
              {monster.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{monster.name}</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  <Heart style={{ width: 12, height: 12, display: "inline", verticalAlign: -2, marginRight: 2 }} />
                  {monster.hp}/{monster.maxHp}
                </span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, height: 10, overflow: "hidden" }}>
                <div style={{
                  background: monsterHpColor, height: "100%", borderRadius: 6,
                  width: `${monsterHpPct}%`, transition: "width 0.4s, background 0.4s",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, display: "flex", gap: 12 }}>
                <span><Swords style={{ width: 11, height: 11, display: "inline", verticalAlign: -2 }} /> 攻击 {monster.attack}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Player status */}
        <div style={{
          background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "12px 16px",
          marginBottom: 16, border: "1px solid rgba(255,255,255,0.08)",
          transform: shakePlayer ? "translateX(8px)" : "none",
          animation: shakePlayer ? "shake 0.4s" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 28 }}>🧙</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>勇者</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  <Heart style={{ width: 12, height: 12, display: "inline", verticalAlign: -2, marginRight: 2 }} />
                  {playerHp}/{maxPlayerHp}
                </span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, height: 8, overflow: "hidden" }}>
                <div style={{
                  background: playerHpColor, height: "100%", borderRadius: 6,
                  width: `${playerHpPct}%`, transition: "width 0.4s, background 0.4s",
                }} />
              </div>
            </div>
            {streak >= 2 && (
              <div style={{
                background: "rgba(251,191,36,0.15)", borderRadius: 8, padding: "2px 8px",
                fontSize: 12, fontWeight: 700, color: "#fbbf24",
              }}>
                <Zap style={{ width: 12, height: 12, display: "inline", verticalAlign: -2 }} /> {streak}连击
              </div>
            )}
          </div>
        </div>

        {/* Question card */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "24px 18px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span style={{
              display: "inline-block", background: question.type === "en2cn" ? "#eff6ff" : "#fef3c7",
              borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 600,
              color: question.type === "en2cn" ? "#3b82f6" : "#d97706",
            }}>
              {question.type === "en2cn" ? "英 → 中" : "中 → 英"}
            </span>
          </div>

          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <button onClick={() => speak(question.word.english)} style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>
                {question.prompt}
              </div>
            </button>
          </div>
          {question.type === "en2cn" && (
            <div style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginBottom: 14 }}>
              {question.word.phonetic}
            </div>
          )}
          {question.type === "cn2en" && <div style={{ height: 14 }} />}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {question.options.map((opt) => {
              const isCorrect = opt === question.correctAnswer;
              const isSelected = selected === opt;
              let bg = "#f8fafc";
              let border = "2px solid #e2e8f0";
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

          {/* Feedback */}
          {result === "correct" && (
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <div style={{ color: "#059669", fontWeight: 700, fontSize: 14 }}>
                <Swords style={{ width: 16, height: 16, display: "inline", verticalAlign: -3 }} /> 攻击命中！造成 {10 + Math.min(streak - 1, 5) * 3} 点伤害
                {streak > 0 && streak % 3 === 0 && <span style={{ color: "#10b981" }}> 💚 恢复 10 HP</span>}
              </div>
              {monster.hp <= 0 && (
                <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: 14, marginTop: 4 }}>
                  🎉 怪物被消灭了！
                </div>
              )}
            </div>
          )}
          {result === "wrong" && (
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <div style={{ color: "#dc2626", fontWeight: 700, fontSize: 14 }}>
                <Shield style={{ width: 16, height: 16, display: "inline", verticalAlign: -3 }} /> {monster.name}反击！你受到 {monster.attack} 点伤害
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                正确答案：<strong>{question.correctAnswer}</strong>
              </div>
            </div>
          )}

          {/* Next button */}
          {result !== null && (
            <button onClick={handleNext} style={{
              width: "100%", marginTop: 14,
              background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff",
              border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700,
            }}>
              {playerHp <= 0 ? "查看战绩" : monster.hp <= 0 ? "⚔️ 进入下一关" : "继续战斗 →"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
