import { useState, useEffect } from "react";
import type { UserProgress } from "./utils/storage";
import { getProgress } from "./utils/storage";
import HomePage from "./components/HomePage";
import LearnPage from "./components/LearnPage";
import QuizPage from "./components/QuizPage";
import ReviewPage from "./components/ReviewPage";
import StatsPage from "./components/StatsPage";
import PhonicsPage from "./components/PhonicsPage";

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
    </div>
  );
}

export default App;
