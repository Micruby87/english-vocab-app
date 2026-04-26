import { useState } from "react";
import { ArrowLeft, Volume2, ChevronUp } from "lucide-react";
import { phonetics, vowelCategories, consonantCategories } from "../data/phonetics";
import type { Phonetic } from "../data/phonetics";
import { speak } from "../utils/speak";

interface PhonicsPageProps {
  onBack: () => void;
}

type TabType = "vowel" | "consonant";

export default function PhonicsPage({ onBack }: PhonicsPageProps) {
  const [tab, setTab] = useState<TabType>("vowel");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = tab === "vowel" ? vowelCategories : consonantCategories;
  const filtered = phonetics.filter((p) => p.type === tab);

  const vowelCount = phonetics.filter((p) => p.type === "vowel").length;
  const consonantCount = phonetics.filter((p) => p.type === "consonant").length;

  return (
    <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
      {/* Header with gradient */}
      <div
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
          borderRadius: "0 0 28px 28px",
          padding: "16px 16px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: "#fff" }} />
          </button>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>48个音标</span>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => { setTab("vowel"); setActiveCategory(null); setExpandedId(null); }}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 14, fontSize: 15, fontWeight: 700,
              background: tab === "vowel" ? "#fff" : "rgba(255,255,255,0.2)",
              color: tab === "vowel" ? "#ef4444" : "rgba(255,255,255,0.9)",
              transition: "all 0.2s",
            }}
          >
            元音 ({vowelCount})
          </button>
          <button
            onClick={() => { setTab("consonant"); setActiveCategory(null); setExpandedId(null); }}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 14, fontSize: 15, fontWeight: 700,
              background: tab === "consonant" ? "#fff" : "rgba(255,255,255,0.2)",
              color: tab === "consonant" ? "#ef4444" : "rgba(255,255,255,0.9)",
              transition: "all 0.2s",
            }}
          >
            辅音 ({consonantCount})
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px 32px" }}>
        {/* Category filter pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 8 }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: "6px 16px", borderRadius: 50, fontSize: 12, fontWeight: 600,
              whiteSpace: "nowrap",
              background: activeCategory === null ? "#ef4444" : "#fff",
              color: activeCategory === null ? "#fff" : "#64748b",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              style={{
                padding: "6px 16px", borderRadius: 50, fontSize: 12, fontWeight: 600,
                whiteSpace: "nowrap",
                background: activeCategory === cat ? "#ef4444" : "#fff",
                color: activeCategory === cat ? "#fff" : "#64748b",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Phonetic Grid by Category */}
        {categories
          .filter((cat) => activeCategory === null || activeCategory === cat)
          .map((cat) => {
            const catItems = filtered.filter((p) => p.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingLeft: 4 }}>
                  <div style={{
                    width: 4, height: 16, borderRadius: 4,
                    background: tab === "vowel" ? "#ef4444" : "#f59e0b",
                  }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{cat}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>({catItems.length}个)</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {catItems.map((p) => (
                    <PhoneticCard
                      key={p.id}
                      phonetic={p}
                      isExpanded={expandedId === p.id}
                      onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
                      onSpeak={speak}
                      accentColor={tab === "vowel" ? "#ef4444" : "#f59e0b"}
                    />
                  ))}
                </div>

                {/* Expanded detail card */}
                {catItems.some((p) => p.id === expandedId) && (
                  <PhoneticDetail
                    phonetic={catItems.find((p) => p.id === expandedId)!}
                    onSpeak={speak}
                    accentColor={tab === "vowel" ? "#ef4444" : "#f59e0b"}
                    onClose={() => setExpandedId(null)}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function PhoneticCard({
  phonetic, isExpanded, onToggle, onSpeak, accentColor,
}: {
  phonetic: Phonetic; isExpanded: boolean; onToggle: () => void; onSpeak: (t: string) => void; accentColor: string;
}) {
  return (
    <button
      onClick={() => { onToggle(); onSpeak(phonetic.exampleWord); }}
      style={{
        background: isExpanded ? accentColor : "#fff",
        borderRadius: 14,
        padding: "14px 6px",
        textAlign: "center",
        boxShadow: isExpanded ? `0 4px 12px ${accentColor}40` : "0 1px 6px rgba(0,0,0,0.04)",
        transition: "all 0.2s",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800, color: isExpanded ? "#fff" : "#1a1a2e", lineHeight: 1.2 }}>
        {phonetic.symbol}
      </div>
      <div style={{ fontSize: 10, color: isExpanded ? "rgba(255,255,255,0.8)" : "#94a3b8", marginTop: 4, fontWeight: 500 }}>
        {phonetic.exampleWord}
      </div>
    </button>
  );
}

function PhoneticDetail({
  phonetic, onSpeak, accentColor, onClose,
}: {
  phonetic: Phonetic; onSpeak: (t: string) => void; accentColor: string; onClose: () => void;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "20px",
        marginTop: 10,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        border: `2px solid ${accentColor}20`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: accentColor,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{phonetic.symbol}</span>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{phonetic.category}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{phonetic.exampleWord}</div>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{
            width: 32, height: 32, borderRadius: "50%", background: "#f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <ChevronUp style={{ width: 16, height: 16, color: "#64748b" }} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 13, color: "#64748b" }}>{phonetic.exampleIPA}</span>
        <span style={{ fontSize: 13, color: "#94a3b8" }}>·</span>
        <span style={{ fontSize: 13, color: "#64748b" }}>{phonetic.exampleChinese}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onSpeak(phonetic.exampleWord); }}
          style={{
            marginLeft: "auto",
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "6px 14px", borderRadius: 50,
            background: `${accentColor}15`, color: accentColor,
            fontSize: 12, fontWeight: 600,
          }}
        >
          <Volume2 style={{ width: 14, height: 14 }} />
          发音
        </button>
      </div>

      <div
        style={{
          background: "#fefce8",
          borderRadius: 12,
          padding: "12px 14px",
          fontSize: 13,
          color: "#92400e",
          lineHeight: 1.6,
        }}
      >
        💡 {phonetic.tip}
      </div>
    </div>
  );
}
