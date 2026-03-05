import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import BorrowScreen from "./screens/BorrowScreen";
import FoodScreen from "./screens/FoodScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import StudyScreen from "./screens/StudyScreen";

export type Tab = "home" | "borrow" | "food" | "study" | "profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [greenPoints, setGreenPoints] = useState(320);

  const addPoints = (pts: number) => setGreenPoints((prev) => prev + pts);

  return (
    <div className="app-shell">
      <main className="content-area min-h-dvh overflow-y-auto">
        {activeTab === "home" && (
          <HomeScreen greenPoints={greenPoints} onNavigate={setActiveTab} />
        )}
        {activeTab === "borrow" && <BorrowScreen onPointsEarned={addPoints} />}
        {activeTab === "food" && <FoodScreen onPointsEarned={addPoints} />}
        {activeTab === "study" && <StudyScreen onPointsEarned={addPoints} />}
        {activeTab === "profile" && <ProfileScreen greenPoints={greenPoints} />}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <Toaster position="top-center" richColors />
    </div>
  );
}
