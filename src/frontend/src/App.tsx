import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import BorrowScreen from "./screens/BorrowScreen";
import FoodScreen from "./screens/FoodScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RequestsScreen from "./screens/RequestsScreen";
import StudyScreen from "./screens/StudyScreen";

export type Tab = "home" | "borrow" | "food" | "study" | "profile" | "requests";

export interface BorrowItem {
  id: bigint;
  name: string;
  category: string;
  status: string;
  ownerName: string;
}

// Shared mock data — lives here so state persists across tab switches
const INITIAL_BORROW_ITEMS: BorrowItem[] = [
  {
    id: 1n,
    name: "Scientific Calculator",
    category: "Electronics",
    status: "Available",
    ownerName: "Rahul Sharma",
  },
  {
    id: 2n,
    name: "Umbrella",
    category: "Accessories",
    status: "Available",
    ownerName: "Priya Mehta",
  },
  {
    id: 3n,
    name: "Laptop Charger (Dell)",
    category: "Electronics",
    status: "Borrowed",
    ownerName: "Arjun Patel",
  },
  {
    id: 4n,
    name: "Lab Coat (M)",
    category: "Lab Equipment",
    status: "Available",
    ownerName: "Lab Coordinator",
  },
  {
    id: 5n,
    name: "HDMI Cable",
    category: "Electronics",
    status: "Available",
    ownerName: "IT Department",
  },
  {
    id: 6n,
    name: "Portable Speaker",
    category: "Electronics",
    status: "Borrowed",
    ownerName: "Sneha Rao",
  },
  {
    id: 7n,
    name: "Extension Cord",
    category: "Utilities",
    status: "Available",
    ownerName: "Hostel Warden",
  },
  {
    id: 8n,
    name: "Whiteboard Marker Set",
    category: "Stationery",
    status: "Available",
    ownerName: "Faculty Lounge",
  },
  {
    id: 9n,
    name: "Badminton Racket",
    category: "Sports",
    status: "Available",
    ownerName: "Sports Committee",
  },
  {
    id: 10n,
    name: "Power Bank (10000mAh)",
    category: "Electronics",
    status: "Available",
    ownerName: "Kavya Nair",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [greenPoints, setGreenPoints] = useState(320);
  const [borrowedCount, setBorrowedCount] = useState(45);
  const [foodClaimedCount, setFoodClaimedCount] = useState(23);
  const [returnCount, setReturnCount] = useState(2);

  // Shared borrow items state — lifted here so BorrowScreen + ProfileScreen share the same data
  const [borrowItems, setBorrowItems] =
    useState<BorrowItem[]>(INITIAL_BORROW_ITEMS);

  const addPoints = (pts: number) => setGreenPoints((prev) => prev + pts);
  const handleItemBorrowed = () => setBorrowedCount((prev) => prev + 1);
  const handleFoodClaimed = () => setFoodClaimedCount((prev) => prev + 1);

  const handleBorrowItem = (id: bigint) => {
    setBorrowItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Borrowed" } : item,
      ),
    );
    addPoints(10);
    handleItemBorrowed();
  };

  const handleReturnItem = (id: bigint) => {
    setBorrowItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Available" } : item,
      ),
    );
    setBorrowedCount((prev) => Math.max(0, prev - 1));
    setReturnCount((prev) => prev + 1);
  };

  return (
    <div className="page-bg min-h-screen w-full">
      <div className="app-shell">
        <main className="content-area min-h-dvh overflow-y-auto">
          {activeTab === "home" && (
            <HomeScreen
              greenPoints={greenPoints}
              onNavigate={setActiveTab}
              itemsBorrowedCount={borrowedCount}
              foodClaimedCount={foodClaimedCount}
            />
          )}
          {activeTab === "borrow" && (
            <BorrowScreen
              borrowItems={borrowItems}
              onBorrowItem={handleBorrowItem}
            />
          )}
          {activeTab === "food" && (
            <FoodScreen
              onPointsEarned={addPoints}
              onFoodClaimed={handleFoodClaimed}
            />
          )}
          {activeTab === "study" && <StudyScreen onPointsEarned={addPoints} />}
          {activeTab === "profile" && (
            <ProfileScreen
              greenPoints={greenPoints}
              borrowItems={borrowItems}
              onReturnItem={handleReturnItem}
              returnCount={returnCount}
              borrowedCount={borrowedCount}
              foodClaimedCount={foodClaimedCount}
            />
          )}
          {activeTab === "requests" && (
            <RequestsScreen onPointsEarned={addPoints} />
          )}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}
