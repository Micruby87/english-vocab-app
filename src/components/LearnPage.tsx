import { useState } from "react";
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { vocabulary, gradeNames } from "../data/vocabulary";
import type { Word } from "../data/vocabulary";
import type { UserProgress } from "../utils/storage";
import { checkIn, saveProgress } from "../utils/storage";
import { speak } from "../utils/speak";

interface LearnPageProps {
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
  onBack: () => void;
}

export default function LearnPage({ progress, setProgress, onBack }: LearnPageProps) {
  const [selectedGrade, setSelectedGrade] = useState<number>(progress.currentGrade);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showChinese, setShowChinese] = useState(false);
  const [learnedThisSession, setLearnedThisSession] = useState<number[]>([]);

  const gradeWords = vocabulary.filter((w) => w.grade === selectedGrade);
  const currentWord: Word | undefined = gradeWords[currentIndex];

  const handleNext = () => {
    setShowChinese(false);
    if (currentIndex < gradeWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setShowChinese(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkLearned = () => {
    if (!currentWord) return;
    const wordId = currentWord.id;
    if (!learnedThisSession.includes(wordId)) {
      setLearnedThisSession([...learnedThisSession, wordId]);
    }
    const updated = checkIn(progress, [wordId]);
    updated.currentGrade = selectedGrade;
    setProgress(updated);
    saveProgress(updated);
    handleNext();
  };

  const isWordLearned = (wordId: number) =>
    progress.learnedWords.includes(wordId) || learnedThisSession.includes(wordId);

  const progressPct = gradeWords.length > 0 ? Math.round(((currentIndex + 1) / gradeWords.length) * 100) : 0;

  if (!currentWord) {
    return (
      <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
        <PageHeader onBack={onBack} title="学单词" />
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8", fontSize: 15 }}>
          该年级暂无单词
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
      <PageHeader onBack={onBack} title="学单词" />

      <div style={{ padding: "0 16px 32px" }}>
        {/* Grade Selector */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 12 }}>
          {Object.entries(gradeNames).map(([grade, name]) => {
            const active = selectedGrade === Number(grade);
            return (
              <button
                key={grade}
                onClick={() => { setSelectedGrade(Number(grade)); setCurrentIndex(0); setShowChinese(false); }}
                style={{
                  padding: "8px 18px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                  whiteSpace: "nowrap",
                  background: active ? "#6366f1" : "#fff",
                  color: active ? "#fff" : "#64748b",
                  boxShadow: active ? "0 2px 8px rgba(99,102,241,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)", borderRadius: 6, transition: "width 0.3s" }} />
          </div>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, minWidth: 50, textAlign: "right" }}>
            {currentIndex + 1}/{gradeWords.length}
          </span>
        </div>

        {/* Session Info */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: "#6366f1", background: "#eef2ff", padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>
            本次已学 {learnedThisSession.length} 个
          </span>
        </div>

        {/* Word Card */}
        <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", marginBottom: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          {/* English + Phonetic */}
          <div style={{ padding: "36px 24px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 38, fontWeight: 800, color: "#1a1a2e", marginBottom: 8, letterSpacing: "-0.5px" }}>
              {currentWord.english}
            </div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>
              {currentWord.phonetic}
            </div>
            <button
              onClick={() => speak(currentWord.english)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 24px", borderRadius: 50,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", fontSize: 14, fontWeight: 600,
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              }}
            >
              <Volume2 style={{ width: 18, height: 18 }} />
              播放发音
            </button>
          </div>

          {/* Chinese meaning - tap to reveal */}
          <div
            onClick={() => setShowChinese(true)}
            style={{
              borderTop: "1px solid #f1f5f9",
              padding: "24px",
              textAlign: "center",
              background: showChinese ? "#f0fdf4" : "#fafafa",
              minHeight: 80,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}
          >
            {showChinese ? (
              <>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
                  {currentWord.chinese}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", fontStyle: "italic" }}>
                  "{currentWord.example}"
                </div>
              </>
            ) : (
              <div style={{ fontSize: 14, color: "#94a3b8" }}>
                👆 点击查看中文释义
              </div>
            )}
          </div>

          {/* Learned badge */}
          {isWordLearned(currentWord.id) && (
            <div style={{ background: "#10b981", color: "#fff", textAlign: "center", padding: "8px 0", fontSize: 13, fontWeight: 600 }}>
              已学习 ✓
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              padding: "14px 0", borderRadius: 14, fontSize: 14, fontWeight: 600,
              background: "#fff", color: currentIndex === 0 ? "#cbd5e1" : "#64748b",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <ChevronLeft style={{ width: 18, height: 18 }} />
            上一个
          </button>

          <button
            onClick={handleMarkLearned}
            style={{
              flex: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "14px 0", borderRadius: 14, fontSize: 15, fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            }}
          >
            <Check style={{ width: 18, height: 18 }} />
            学会了
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === gradeWords.length - 1}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              padding: "14px 0", borderRadius: 14, fontSize: 14, fontWeight: 600,
              background: "#fff", color: currentIndex === gradeWords.length - 1 ? "#cbd5e1" : "#64748b",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            下一个
            <ChevronRight style={{ width: 18, height: 18 }} />
          </button>
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
