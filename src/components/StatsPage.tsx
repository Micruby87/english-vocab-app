import { ArrowLeft, Calendar, BookOpen, Trophy, Flame } from "lucide-react";
import { vocabulary, gradeNames } from "../data/vocabulary";
import type { UserProgress } from "../utils/storage";

interface StatsPageProps {
  progress: UserProgress;
  onBack: () => void;
}

export default function StatsPage({ progress, onBack }: StatsPageProps) {
  const totalWords = vocabulary.length;
  const learnedCount = progress.learnedWords.length;
  const masteredCount = progress.masteredWords.length;
  const totalPct = Math.round((learnedCount / totalWords) * 100);

  const gradeStats = Object.entries(gradeNames).map(([grade, name]) => {
    const gradeNum = Number(grade);
    const gradeWords = vocabulary.filter((w) => w.grade === gradeNum);
    const learned = gradeWords.filter((w) => progress.learnedWords.includes(w.id)).length;
    const mastered = gradeWords.filter((w) => progress.masteredWords.includes(w.id)).length;
    return { grade: gradeNum, name, total: gradeWords.length, learned, mastered };
  });

  const recent7Days = getRecent7Days(progress);

  return (
    <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
      <PageHeader onBack={onBack} title="学习统计" />

      <div style={{ padding: "0 16px 32px" }}>
        {/* Overview Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <OverviewCard icon={<Flame style={{ width: 20, height: 20, color: "#f97316" }} />} value={progress.consecutiveDays} label="连续打卡" unit="天" bg="#fff7ed" />
          <OverviewCard icon={<Calendar style={{ width: 20, height: 20, color: "#6366f1" }} />} value={progress.totalDaysCheckedIn} label="累计打卡" unit="天" bg="#eef2ff" />
          <OverviewCard icon={<BookOpen style={{ width: 20, height: 20, color: "#10b981" }} />} value={learnedCount} label="已学单词" unit="个" bg="#ecfdf5" />
          <OverviewCard icon={<Trophy style={{ width: 20, height: 20, color: "#8b5cf6" }} />} value={masteredCount} label="已掌握" unit="个" bg="#f5f3ff" />
        </div>

        {/* Weekly check-in calendar */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 }}>最近7天打卡</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {recent7Days.map((day, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{day.label}</div>
                <div
                  style={{
                    width: 38, height: 38, borderRadius: "50%", margin: "0 auto",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 600,
                    background: day.checkedIn ? "#10b981" : day.isToday ? "#eef2ff" : "#f1f5f9",
                    color: day.checkedIn ? "#fff" : day.isToday ? "#6366f1" : "#94a3b8",
                    border: day.isToday && !day.checkedIn ? "2px solid #6366f1" : "none",
                  }}
                >
                  {day.date}
                </div>
                {day.wordsCount > 0 && (
                  <div style={{ fontSize: 10, color: "#10b981", marginTop: 4, fontWeight: 600 }}>{day.wordsCount}词</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Per-grade Progress */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 }}>各年级进度</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {gradeStats.map((stat) => {
              const learnPct = stat.total > 0 ? Math.round((stat.learned / stat.total) * 100) : 0;
              const masterPct = stat.total > 0 ? Math.round((stat.mastered / stat.total) * 100) : 0;
              return (
                <div key={stat.grade}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{stat.name}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      {stat.learned}/{stat.total} 已学 · {stat.mastered} 掌握
                    </span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 8, overflow: "hidden", display: "flex" }}>
                    <div style={{ height: "100%", width: `${masterPct}%`, background: "#10b981", transition: "width 0.5s" }} />
                    <div style={{ height: "100%", width: `${Math.max(learnPct - masterPct, 0)}%`, background: "#6366f1", transition: "width 0.5s" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>已掌握</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#6366f1" }} />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>已学习</span>
            </div>
          </div>
        </div>

        {/* Total progress */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 12 }}>总体完成度</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: "#6366f1", lineHeight: 1 }}>{totalPct}%</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>{learnedCount} / {totalWords} 个单词</div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ icon, value, label, unit, bg }: { icon: React.ReactNode; value: number; label: string; unit: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: "16px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {icon}
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</span>
      </div>
      <div>
        <span style={{ fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>{value}</span>
        <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  );
}

function getRecent7Days(progress: UserProgress) {
  const days = [];
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const record = progress.checkInRecords.find((r) => r.date === dateStr);
    days.push({
      label: weekDays[d.getDay()],
      date: d.getDate(),
      checkedIn: !!record,
      isToday: i === 0,
      wordsCount: record?.wordsLearned?.length || 0,
    });
  }
  return days;
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
