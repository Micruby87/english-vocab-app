import { useEffect } from "react";
import { BookOpen, Trophy, PenTool, BarChart3, Flame, ChevronRight, Mic } from "lucide-react";
import type { UserProgress } from "../utils/storage";
import { isCheckedInToday } from "../utils/storage";
import { vocabulary } from "../data/vocabulary";

interface HomePageProps {
  progress: UserProgress;
  onNavigate: (page: string) => void;
}

export default function HomePage({ progress, onNavigate }: HomePageProps) {
  const checkedIn = isCheckedInToday(progress);
  const totalWords = vocabulary.length;
  const learnedCount = progress.learnedWords.length;
  const masteredCount = progress.masteredWords.length;
  const learnPercent = Math.round((learnedCount / totalWords) * 100);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div className="min-h-[100dvh]" style={{ background: "#f0f2f5" }}>
      {/* Top Header Area */}
      <div
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          borderRadius: "0 0 28px 28px",
          padding: "48px 20px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
              单词打卡
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
              小学英语词汇学习
            </div>
          </div>
          <div
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Flame style={{ width: 22, height: 22, color: "#fbbf24" }} />
          </div>
        </div>

        {/* Check-in Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 20,
            padding: "20px 20px",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: checkedIn ? "#4ade80" : "rgba(255,255,255,0.4)",
                    boxShadow: checkedIn ? "0 0 8px rgba(74,222,128,0.6)" : "none",
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                  {checkedIn ? "今日已打卡" : "今日未打卡"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                  {progress.consecutiveDays}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.65)" }}>
                  天连续
                </span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
                累计打卡 {progress.totalDaysCheckedIn} 天
              </div>
            </div>
            {!checkedIn && (
              <button
                onClick={() => onNavigate("learn")}
                style={{
                  background: "#fff",
                  color: "#6366f1",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "10px 24px",
                  borderRadius: 50,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                去打卡
              </button>
            )}
            {checkedIn && (
              <div style={{ fontSize: 40, lineHeight: 1 }}>🎉</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "20px 16px 32px" }}>
        {/* Progress Section */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "20px",
            marginBottom: 16,
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>学习进度</span>
            <span
              style={{
                fontSize: 12, fontWeight: 700, color: "#6366f1",
                background: "#eef2ff", padding: "4px 12px", borderRadius: 20,
              }}
            >
              {learnPercent}%
            </span>
          </div>

          <div
            style={{
              height: 10, background: "#f1f5f9", borderRadius: 10,
              overflow: "hidden", marginBottom: 18,
            }}
          >
            <div
              style={{
                height: "100%", borderRadius: 10,
                width: `${Math.max(learnPercent, 3)}%`,
                background: "linear-gradient(90deg, #6366f1, #a855f7)",
                transition: "width 0.8s ease",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <StatBadge value={totalWords} label="总词汇" color="#6366f1" bg="#eef2ff" />
            <StatBadge value={learnedCount} label="已学习" color="#10b981" bg="#ecfdf5" />
            <StatBadge value={masteredCount} label="已掌握" color="#8b5cf6" bg="#f5f3ff" />
          </div>
        </div>

        {/* Feature Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FeatureCard
            icon={<BookOpen style={{ width: 26, height: 26, color: "#fff" }} />}
            gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
            title="学单词"
            desc="学习新词汇"
            onClick={() => onNavigate("learn")}
          />
          <FeatureCard
            icon={<Mic style={{ width: 26, height: 26, color: "#fff" }} />}
            gradient="linear-gradient(135deg, #f59e0b, #ef4444)"
            title="学音标"
            desc="48个国际音标"
            onClick={() => onNavigate("phonics")}
          />
          <FeatureCard
            icon={<PenTool style={{ width: 26, height: 26, color: "#fff" }} />}
            gradient="linear-gradient(135deg, #f472b6, #ec4899)"
            title="单词测验"
            desc="检验学习成果"
            onClick={() => onNavigate("quiz")}
          />
          <FeatureCard
            icon={<Trophy style={{ width: 26, height: 26, color: "#fff" }} />}
            gradient="linear-gradient(135deg, #38bdf8, #0ea5e9)"
            title="复习"
            desc="巩固已学单词"
            onClick={() => onNavigate("review")}
          />
          <FeatureCard
            icon={<BarChart3 style={{ width: 26, height: 26, color: "#fff" }} />}
            gradient="linear-gradient(135deg, #34d399, #10b981)"
            title="统计"
            desc="查看学习数据"
            onClick={() => onNavigate("stats")}
          />
        </div>

        {/* Fun Games Section */}
        <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", marginTop: 20, marginBottom: 10 }}>
          🎮 趣味学习
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <button onClick={() => onNavigate("matchGame")} style={{
            background: "#fff", border: "none", borderRadius: 16, padding: "16px 8px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)", textAlign: "center",
          }}>
            <div style={{ fontSize: 30, marginBottom: 6 }}>🧩</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>消消乐</div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>配对挑战</div>
          </button>
          <button onClick={() => onNavigate("spellingGame")} style={{
            background: "#fff", border: "none", borderRadius: 16, padding: "16px 8px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)", textAlign: "center",
          }}>
            <div style={{ fontSize: 30, marginBottom: 6 }}>✏️</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>拼写挑战</div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>听音拼词</div>
          </button>
          <button onClick={() => onNavigate("emojiGame")} style={{
            background: "#fff", border: "none", borderRadius: 16, padding: "16px 8px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)", textAlign: "center",
          }}>
            <div style={{ fontSize: 30, marginBottom: 6 }}>😄</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>猜单词</div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>Emoji挑战</div>
          </button>
        </div>

        {/* Quick Start Banner */}
        <button
          onClick={() => onNavigate("learn")}
          style={{
            width: "100%",
            marginTop: 16,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            borderRadius: 16,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
              开始今天的学习
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
              每天学10个单词，轻松掌握词汇
            </div>
          </div>
          <ChevronRight style={{ width: 22, height: 22, color: "rgba(255,255,255,0.8)" }} />
        </button>
      </div>

      {/* 访客统计 */}
      <div style={{ textAlign: "center", padding: "20px 0 32px", fontSize: 12, color: "#b0b8c8" }}>
        <span>本站总访问 <span id="busuanzi_value_site_pv" style={{ color: "#6366f1", fontWeight: 600 }}>--</span> 次</span>
        <span style={{ margin: "0 10px" }}>|</span>
        <span>访客 <span id="busuanzi_value_site_uv" style={{ color: "#6366f1", fontWeight: 600 }}>--</span> 人</span>
      </div>
    </div>
  );
}

function StatBadge({ value, label, color, bg }: { value: number; label: string; color: string; bg: string }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 14,
        padding: "12px 8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function FeatureCard({
  icon, gradient, title, desc, onClick,
}: {
  icon: React.ReactNode; gradient: string; title: string; desc: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: "20px 16px",
        textAlign: "left",
        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        style={{
          width: 48, height: 48, borderRadius: 14,
          background: gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 14,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{title}</div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{desc}</div>
    </button>
  );
}
