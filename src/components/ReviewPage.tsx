import { useState } from "react";
import { ArrowLeft, Volume2, Search } from "lucide-react";
import { vocabulary, gradeNames } from "../data/vocabulary";
import type { UserProgress } from "../utils/storage";
import { speak } from "../utils/speak";

interface ReviewPageProps {
  progress: UserProgress;
  onBack: () => void;
}

export default function ReviewPage({ progress, onBack }: ReviewPageProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const learnedWords = vocabulary.filter((w) =>
    progress.learnedWords.includes(w.id)
  );

  let filteredWords = selectedGrade
    ? learnedWords.filter((w) => w.grade === selectedGrade)
    : learnedWords;

  if (searchText.trim()) {
    const query = searchText.toLowerCase().trim();
    filteredWords = filteredWords.filter(
      (w) =>
        w.english.toLowerCase().includes(query) ||
        w.chinese.includes(query)
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
      <PageHeader onBack={onBack} title="复习单词" />

      <div style={{ padding: "0 16px 32px" }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <Search style={{ width: 16, height: 16, position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="搜索单词..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px 12px 40px", borderRadius: 14,
              background: "#fff", fontSize: 14, color: "#1a1a2e",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          />
        </div>

        {/* Grade Filter */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 12 }}>
          {[{ key: null, label: "全部" }, ...Object.entries(gradeNames).map(([k, v]) => ({ key: Number(k), label: v }))].map((item) => {
            const active = selectedGrade === item.key;
            return (
              <button
                key={String(item.key)}
                onClick={() => setSelectedGrade(item.key)}
                style={{
                  padding: "8px 18px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                  whiteSpace: "nowrap",
                  background: active ? "#6366f1" : "#fff",
                  color: active ? "#fff" : "#64748b",
                  boxShadow: active ? "0 2px 8px rgba(99,102,241,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
          共 {filteredWords.length} 个已学单词
        </div>

        {filteredWords.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 4 }}>暂无已学单词</div>
            <div style={{ fontSize: 13, color: "#cbd5e1" }}>去学习页面开始学习吧！</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredWords.map((word) => {
              const isMastered = progress.masteredWords.includes(word.id);
              const isExpanded = expandedId === word.id;
              return (
                <div
                  key={word.id}
                  onClick={() => setExpandedId(isExpanded ? null : word.id)}
                  style={{
                    background: "#fff", borderRadius: 16, padding: "14px 16px",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{word.english}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{word.phonetic}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {isMastered && (
                        <span style={{ fontSize: 11, fontWeight: 600, background: "#ecfdf5", color: "#10b981", padding: "3px 10px", borderRadius: 20 }}>
                          已掌握
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); speak(word.english); }}
                        style={{
                          width: 34, height: 34, borderRadius: "50%", background: "#eef2ff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <Volume2 style={{ width: 16, height: 16, color: "#6366f1" }} />
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ fontSize: 18, fontWeight: 600, color: "#1a1a2e", marginBottom: 6 }}>{word.chinese}</div>
                      <div style={{ fontSize: 13, color: "#64748b", fontStyle: "italic" }}>"{word.example}"</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
                        {gradeNames[word.grade]} · 第{word.unit}单元
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
