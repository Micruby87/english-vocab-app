import { useState, useEffect } from "react";
import type { UserProgress } from "./utils/storage";
import { getProgress } from "./utils/storage";
import HomePage from "./components/HomePage";
import LearnPage from "./components/LearnPage";
import QuizPage from "./components/QuizPage";
import ReviewPage from "./components/ReviewPage";
import StatsPage from "./components/StatsPage";
import PhonicsPage from "./components/PhonicsPage";
import MatchGame from "./components/MatchGame";
import SpellingGame from "./components/SpellingGame";
import EmojiGame from "./components/EmojiGame";
import BattleGame from "./components/BattleGame";
import DressUpGame from "./components/DressUpGame";

function App() {
  const [page, setPage] = useState("home");
  const [progress, setProgress] = useState<UserProgress>(getProgress());

  useEffect(() => {
    const saved = getProgress();
    setProgress(saved);
  }, []);

  const goHome = () => setPage("home");

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {page === "home" && (
        <HomePage progress={progress} onNavigate={setPage} />
      )}
      {page === "learn" && (
        <LearnPage progress={progress} setProgress={setProgress} onBack={goHome} />
      )}
      {page === "quiz" && (
        <QuizPage progress={progress} setProgress={setProgress} onBack={goHome} />
      )}
      {page === "review" && (
        <ReviewPage progress={progress} onBack={goHome} />
      )}
      {page === "stats" && (
        <StatsPage progress={progress} onBack={goHome} />
      )}
      {page === "phonics" && (
        <PhonicsPage onBack={goHome} />
      )}
      {page === "matchGame" && (
        <MatchGame onBack={goHome} />
      )}
      {page === "spellingGame" && (
        <SpellingGame onBack={goHome} />
      )}
      {page === "emojiGame" && (
        <EmojiGame onBack={goHome} />
      )}
      {page === "battleGame" && (
        <BattleGame onBack={goHome} />
      )}
      {page === "dressUpGame" && (
        <DressUpGame onBack={goHome} />
      )}
    </div>
  );
}

export default App;
