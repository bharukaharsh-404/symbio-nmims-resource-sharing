import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Leaf,
  Loader2,
  Package,
  RotateCcw,
  Trophy,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BorrowItem } from "../App";

interface ProfileScreenProps {
  greenPoints: number;
  borrowItems: BorrowItem[];
  onReturnItem: (id: bigint) => void;
  returnCount: number;
  borrowedCount: number;
  foodClaimedCount: number;
}

interface LeaderboardEntry {
  name: string;
  department: string;
  points: number;
  initials: string;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    name: "Arjun Patel",
    department: "MBA 2nd Year",
    points: 520,
    initials: "AP",
  },
  {
    name: "Sneha Rao",
    department: "Engineering 4th Year",
    points: 480,
    initials: "SR",
  },
  {
    name: "Priya Mehta",
    department: "BBA 3rd Year",
    points: 320,
    initials: "PM",
  },
];

const MEDAL_CONFIGS = [
  {
    emoji: "🥇",
    bgClass: "bg-yellow-50 border-yellow-100",
    pointColor: "#d4a017",
  },
  {
    emoji: "🥈",
    bgClass: "bg-gray-50 border-gray-100",
    pointColor: "#9e9e9e",
  },
  {
    emoji: "🥉",
    bgClass: "bg-amber-50 border-amber-100",
    pointColor: "#cd7f32",
  },
];

const AVATAR_COLORS = ["green-gradient", "blue-gradient", "amber-gradient"];

function getLevel(points: number): {
  level: number;
  name: string;
  next: number;
} {
  if (points < 100) return { level: 1, name: "Seedling", next: 100 };
  if (points < 250) return { level: 2, name: "Sprout", next: 250 };
  if (points < 500) return { level: 3, name: "Eco Warrior", next: 500 };
  if (points < 800) return { level: 4, name: "Green Champion", next: 800 };
  return { level: 5, name: "Sustainability Hero", next: 1000 };
}

export default function ProfileScreen({
  greenPoints,
  borrowItems,
  onReturnItem,
  returnCount,
  borrowedCount,
  foodClaimedCount,
}: ProfileScreenProps) {
  const profileName = "Priya Mehta";
  const profileDept = "BBA 3rd Year";
  const profileInitials = "PM";
  const leaderboard = MOCK_LEADERBOARD;

  const [returning, setReturning] = useState<bigint | null>(null);

  const handleShareImpact = () => {
    const co2 = (borrowedCount * 0.5 + foodClaimedCount * 0.3).toFixed(1);
    const foodSavedKg = (foodClaimedCount * 0.35).toFixed(1);
    const text = `I've saved ${co2} kg CO2 on Symbio! 🌱 Green Score: ${greenPoints} pts | Items Borrowed: ${borrowedCount} | Food Saved: ${foodSavedKg} kg (${foodClaimedCount} meals) | Items Returned: ${returnCount} — #Symbio #NMIMS`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Impact card copied to clipboard!");
      })
      .catch(() => {
        toast.error("Could not copy to clipboard.");
      });
  };

  const borrowedItems = borrowItems.filter(
    (item) => item.status === "Borrowed",
  );

  const handleReturn = async (item: BorrowItem) => {
    setReturning(item.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onReturnItem(item.id);
    setReturning(null);
    toast.success(`"${item.name}" returned successfully! ♻️`);
  };

  const displayPoints = greenPoints;
  const levelInfo = getLevel(displayPoints);
  const progressPct = Math.min(
    100,
    Math.round((displayPoints / levelInfo.next) * 100),
  );

  return (
    <div className="min-h-screen pb-4">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold font-display text-foreground">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Your sustainability journey
        </p>
      </div>

      {/* Impact Card */}
      <div className="mx-5 mb-5" data-ocid="profile.impact_card.card">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 p-5 shadow-lg">
          {/* Decorative background circles */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-1/2 right-12 w-12 h-12 rounded-full bg-white/5 pointer-events-none" />

          {/* Card Header */}
          <div className="relative z-10 flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Leaf size={14} className="text-white" />
            </div>
            <h2 className="text-white font-bold text-base font-display tracking-wide">
              My Impact
            </h2>
            <span className="ml-auto text-[10px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              Badge
            </span>
          </div>

          {/* Stats Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-2.5 mb-4">
            {/* Green Score */}
            <div
              data-ocid="profile.impact_card.green_score"
              className="bg-white/15 rounded-xl p-3 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5">
                <Leaf size={14} className="text-emerald-200" />
                <span className="text-[10px] text-white/70 font-medium uppercase tracking-wide">
                  Green Score
                </span>
              </div>
              <p className="text-2xl font-bold text-white font-display leading-none">
                {greenPoints}
              </p>
              <p className="text-[10px] text-white/60">pts earned</p>
            </div>

            {/* Items Borrowed */}
            <div
              data-ocid="profile.impact_card.items_borrowed"
              className="bg-white/15 rounded-xl p-3 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5">
                <Package size={14} className="text-blue-200" />
                <span className="text-[10px] text-white/70 font-medium uppercase tracking-wide">
                  Items Borrowed
                </span>
              </div>
              <p className="text-2xl font-bold text-white font-display leading-none">
                {borrowedCount}
              </p>
              <p className="text-[10px] text-white/60">total borrows</p>
            </div>

            {/* Food Saved */}
            <div
              data-ocid="profile.impact_card.food_claimed"
              className="bg-white/15 rounded-xl p-3 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5">
                <Utensils size={14} className="text-amber-200" />
                <span className="text-[10px] text-white/70 font-medium uppercase tracking-wide">
                  Food Saved
                </span>
              </div>
              <p className="text-2xl font-bold text-white font-display leading-none">
                {(foodClaimedCount * 0.35).toFixed(1)}
                <span className="text-sm font-medium ml-0.5">kg</span>
              </p>
              <p className="text-[10px] text-white/60">
                {foodClaimedCount} meals rescued
              </p>
            </div>

            {/* Items Returned */}
            <div
              data-ocid="profile.impact_card.items_returned"
              className="bg-white/15 rounded-xl p-3 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5">
                <RotateCcw size={14} className="text-purple-200" />
                <span className="text-[10px] text-white/70 font-medium uppercase tracking-wide">
                  Items Returned
                </span>
              </div>
              <p className="text-2xl font-bold text-white font-display leading-none">
                {returnCount}
              </p>
              <p className="text-[10px] text-white/60">returned safely</p>
            </div>
          </div>

          {/* CO2 Summary Line */}
          <div className="relative z-10 bg-white/10 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
            <Leaf size={13} className="text-emerald-200 shrink-0" />
            <p className="text-xs text-white/90 font-medium">
              CO₂ Saved:{" "}
              <span className="font-bold text-white">
                {(borrowedCount * 0.5 + foodClaimedCount * 0.3).toFixed(1)} kg
              </span>
              <span className="text-white/60">
                {" "}
                — great work for the planet! 🌍
              </span>
            </p>
          </div>

          {/* Share Button */}
          <button
            type="button"
            data-ocid="profile.impact_card.share_button"
            onClick={handleShareImpact}
            className="relative z-10 w-full bg-white/20 hover:bg-white/30 active:bg-white/10 transition-all duration-150 rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-white font-semibold text-sm backdrop-blur-sm border border-white/20"
          >
            <Leaf size={14} className="text-emerald-200" />
            Share My Impact
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="mx-5">
        <div className="score-card-gradient grain-overlay relative rounded-2xl p-5 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 right-8 w-16 h-16 rounded-full bg-white/5" />

          <div className="relative z-10 flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-white font-display">
                {profileInitials}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white font-display leading-tight">
                {profileName}
              </h2>
              <p className="text-white/70 text-sm">{profileDept}</p>
              <p className="text-white/50 text-xs mt-0.5">
                NMIMS Vile Parle · Joined Jan 2024
              </p>

              <div className="flex items-center gap-2 mt-3">
                <Leaf size={14} className="text-white/70" />
                <span className="text-white font-bold text-lg font-display">
                  {displayPoints}
                </span>
                <span className="text-white/60 text-sm">Green Points</span>
                <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                  Lv. {levelInfo.level}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/80 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-xs text-white/50">
                  {levelInfo.name} · {levelInfo.next - displayPoints} pts to
                  Level {levelInfo.level + 1}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Borrowed Items */}
      <div className="px-5 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <Package size={16} className="text-emerald-600" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            My Borrowed Items
          </h2>
          {borrowedItems.length > 0 && (
            <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
              {borrowedItems.length}
            </span>
          )}
        </div>

        {borrowedItems.length === 0 ? (
          <div
            data-ocid="profile.borrowed.empty_state"
            className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center"
          >
            <RotateCcw size={28} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-muted-foreground font-medium">
              No items borrowed yet.
            </p>
            <p className="text-xs text-muted-foreground mt-1 opacity-70">
              Go to the Borrow tab to borrow items!
            </p>
          </div>
        ) : (
          <div data-ocid="profile.borrowed.list" className="space-y-2">
            {borrowedItems.map((item, index) => {
              const isReturning = returning === item.id;
              return (
                <div
                  key={item.id.toString()}
                  data-ocid={`profile.borrowed.item.${index + 1}`}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 card-hover"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Package size={16} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.category} · from {item.ownerName}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    data-ocid={`profile.return_button.${index + 1}`}
                    disabled={isReturning}
                    onClick={() => handleReturn(item)}
                    className="text-xs font-semibold shrink-0 rounded-xl bg-amber-500 hover:bg-amber-600 text-white border-0"
                  >
                    {isReturning ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <>
                        <RotateCcw size={11} className="mr-1" />
                        Return
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Points Breakdown */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Points Breakdown
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              icon: Package,
              label: "Items Borrowed",
              pts: "+10 pts",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              icon: Utensils,
              label: "Food Rescued",
              pts: "+15 pts",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              icon: BookOpen,
              label: "Rooms Booked",
              pts: "+5 pts",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
          ].map(({ icon: Icon, label, pts, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
              <Icon size={18} className={`${color} mx-auto mb-1.5`} />
              <p className={`text-sm font-bold ${color} font-display`}>{pts}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-5 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={16} className="text-yellow-500" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Campus Leaderboard
          </h2>
        </div>

        <div className="space-y-2">
          {leaderboard.map((user, index) => {
            const medal = MEDAL_CONFIGS[index];
            const avatarColor = AVATAR_COLORS[index];
            const isCurrentUser = user.name === "Priya Mehta";

            return (
              <div
                key={user.name}
                data-ocid={`profile.leaderboard.item.${index + 1}`}
                className={`rounded-2xl border p-4 flex items-center gap-3 card-hover ${
                  isCurrentUser
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-card border-border"
                }`}
              >
                {/* Rank */}
                <div
                  className={`w-8 h-8 rounded-full ${medal.bgClass} border flex items-center justify-center shrink-0`}
                >
                  <span className="text-sm">{medal.emoji}</span>
                </div>

                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl ${avatarColor} flex items-center justify-center shrink-0`}
                >
                  <span className="text-xs font-bold text-white">
                    {user.initials}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user.name}
                    </p>
                    {isCurrentUser && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.department}
                  </p>
                </div>

                {/* Points */}
                <div className="text-right shrink-0">
                  <p
                    className="text-sm font-bold font-display"
                    style={{ color: medal.pointColor }}
                  >
                    {user.points}
                  </p>
                  <p className="text-[10px] text-muted-foreground">pts</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Achievements
        </h2>
        <div className="flex gap-2 flex-wrap">
          {[
            { emoji: "🌱", label: "First Borrow", earned: true },
            { emoji: "🍱", label: "Food Rescuer", earned: true },
            { emoji: "📚", label: "Study Buddy", earned: true },
            { emoji: "⚡", label: "Power Saver", earned: false },
            { emoji: "🌍", label: "Eco Hero", earned: false },
          ].map(({ emoji, label, earned }) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
                earned
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                  : "bg-gray-50 border-gray-100 text-gray-400"
              }`}
            >
              <span className={earned ? "" : "grayscale opacity-50"}>
                {emoji}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Attribution */}
      <div className="px-5 mt-8 pb-2 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
