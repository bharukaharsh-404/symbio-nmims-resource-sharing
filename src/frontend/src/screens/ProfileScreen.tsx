import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  HandHelping,
  Leaf,
  Loader2,
  Lock,
  LogOut,
  Package,
  RefreshCw,
  RotateCcw,
  Shield,
  TrendingUp,
  Trophy,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BorrowItem, InventoryItem, UserProfile } from "../App";

interface ProfileScreenProps {
  greenPoints: number;
  borrowItems: BorrowItem[];
  onReturnItem: (id: bigint) => void;
  returnCount: number;
  itemsLendedCount: number;
  foodClaimedCount: number;
  myInventory: InventoryItem[];
  userProfile: UserProfile | null;
  leaderboard: UserProfile[];
  onLogout: () => void;
  onResetDemo?: () => void;
  onOpenAdmin?: () => void;
  localName?: string;
  localDept?: string;
  requestsFulfilled?: number;
  studyRoomsBooked?: number;
}

const MOCK_LEADERBOARD_FALLBACK = [
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

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "bg-blue-50 text-blue-700 border-blue-100",
  Accessories: "bg-purple-50 text-purple-700 border-purple-100",
  Books: "bg-teal-50 text-teal-700 border-teal-100",
  Stationery: "bg-pink-50 text-pink-700 border-pink-100",
  Sports: "bg-orange-50 text-orange-700 border-orange-100",
  "Lab Equipment": "bg-yellow-50 text-yellow-700 border-yellow-100",
  Utilities: "bg-gray-50 text-gray-700 border-gray-100",
  Other: "bg-gray-50 text-gray-700 border-gray-100",
};

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
  itemsLendedCount,
  foodClaimedCount,
  myInventory,
  userProfile,
  leaderboard,
  onLogout,
  onResetDemo,
  onOpenAdmin,
  localName,
  localDept,
  requestsFulfilled = 0,
  studyRoomsBooked = 0,
}: ProfileScreenProps) {
  const profileName = userProfile?.name || localName || "You";
  const profileDept = userProfile?.department || localDept || "NMIMS Student";
  const profileInitials =
    userProfile?.avatarInitials ??
    (profileName !== "You" ? profileName.slice(0, 2).toUpperCase() : "YO");

  // Normalise leaderboard to a renderable shape (backend UserProfile or mock fallback)
  const leaderboardEntries =
    leaderboard.length > 0
      ? leaderboard.map((u) => ({
          name: u.name,
          department: u.department,
          points: Number(u.greenPoints),
          initials: u.avatarInitials,
        }))
      : MOCK_LEADERBOARD_FALLBACK;

  const [returning, setReturning] = useState<bigint | null>(null);

  const handleShareImpact = () => {
    const co2 = (itemsLendedCount * 0.5 + foodClaimedCount * 0.3).toFixed(1);
    const foodSavedKg = (foodClaimedCount * 0.35).toFixed(1);
    const text = `I've saved ${co2} kg CO2 on Symbio! 🌱 Green Score: ${greenPoints} pts | Items Lended: ${itemsLendedCount} | Food Saved: ${foodSavedKg} kg (${foodClaimedCount} meals) | Items Returned: ${returnCount} — #Symbio #NMIMS`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Impact card copied to clipboard!");
      })
      .catch(() => {
        toast.error("Could not copy to clipboard.");
      });
  };

  // Only community borrowItems (not myInventory) appear in "My Borrowed Items"
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
      <div className="px-5 pt-12 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Your sustainability journey
          </p>
        </div>
        <button
          type="button"
          data-ocid="profile.logout_button"
          onClick={onLogout}
          className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
          title="Logout"
        >
          <LogOut size={14} />
          Logout
        </button>
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
          <div className="relative z-10 grid grid-cols-2 gap-2.5 mb-3">
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

            {/* Items Lended — primary earning metric */}
            <div
              data-ocid="profile.impact_card.items_lended"
              className="bg-emerald-400/20 border border-white/10 rounded-xl p-3 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5">
                <Package size={14} className="text-yellow-200" />
                <span className="text-[10px] text-white/70 font-medium uppercase tracking-wide">
                  Items Lended
                </span>
              </div>
              <p className="text-2xl font-bold text-white font-display leading-none">
                {itemsLendedCount}
              </p>
              <p className="text-[10px] text-white/60">total lends</p>
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

          {/* Thin divider */}
          <div className="relative z-10 border-t border-white/15 mb-3" />

          {/* CO2 Summary Line */}
          <div className="relative z-10 bg-white/10 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
            <Leaf size={13} className="text-emerald-200 shrink-0" />
            <p className="text-xs text-white/90 font-medium">
              CO₂ Saved:{" "}
              <span className="font-bold text-white">
                {(itemsLendedCount * 0.5 + foodClaimedCount * 0.3).toFixed(1)}{" "}
                kg
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

      {/* ── My Inventory (items I've listed for others) ── */}
      <div className="px-5 mt-5">
        <div
          data-ocid="profile.myinventory.section"
          className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-emerald-600" />
            <h2 className="text-sm font-semibold text-emerald-800 uppercase tracking-widest">
              My Inventory
            </h2>
            <span className="ml-auto text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
              LENDER
            </span>
          </div>

          {myInventory.length === 0 ? (
            <div
              data-ocid="profile.myinventory.empty_state"
              className="text-center py-6"
            >
              <Package size={28} className="mx-auto mb-2 text-emerald-300" />
              <p className="text-sm text-emerald-700 font-medium">
                No items listed yet.
              </p>
              <p className="text-xs text-emerald-600 mt-1 opacity-70">
                Use the + button on Home to list your first item!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {myInventory.map((item, index) => {
                const isAvailable = item.status === "Available";
                const catColor =
                  CATEGORY_COLORS[item.category] ||
                  "bg-gray-50 text-gray-700 border-gray-100";

                return (
                  <div
                    key={item.id.toString()}
                    data-ocid={`profile.myinventory.item.${index + 1}`}
                    className="bg-white rounded-xl border border-emerald-100 p-3 card-hover"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <Package size={14} className="text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${catColor}`}
                          >
                            {item.category}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              isAvailable
                                ? "status-available"
                                : "bg-amber-100 text-amber-700 border-amber-200"
                            }`}
                          >
                            {isAvailable ? "Available" : "Being Borrowed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── My Borrowed Items (from community) ── */}
      <div className="px-5 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <RotateCcw size={16} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            My Borrowed Items
          </h2>
          {borrowedItems.length > 0 && (
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
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
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <Package size={16} className="text-amber-600" />
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
          {/* Lending */}
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <Leaf size={18} className="text-emerald-600 mx-auto mb-1.5" />
            <p className="text-sm font-bold text-emerald-600 font-display">
              +15 pts
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
              For Lending
            </p>
          </div>

          {/* Borrowing */}
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Package size={18} className="text-gray-400 mx-auto mb-1.5" />
            <p className="text-sm font-bold text-gray-400 font-display">
              +0 pts
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
              For Borrowing
            </p>
          </div>

          {/* Helping */}
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <HandHelping
              size={18}
              className="text-emerald-600 mx-auto mb-1.5"
            />
            <p className="text-sm font-bold text-emerald-600 font-display">
              +15 pts
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
              For Helping
            </p>
          </div>
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
          {leaderboardEntries.map((user, index) => {
            const medal = MEDAL_CONFIGS[index] ?? MEDAL_CONFIGS[2];
            const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
            const isCurrentUser = userProfile
              ? user.name === userProfile.name
              : user.name === "Priya Mehta";

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

      {/* Analytics — Weekly Impact */}
      <div className="px-5 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-emerald-600" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Your Week
          </h2>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          {/* Bar chart */}
          {(() => {
            const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const seedData = [15, 30, 0, 45, 15, 30, greenPoints % 50];
            const maxVal = Math.max(...seedData, 1);
            return (
              <div className="flex items-end gap-1.5 h-20 mb-2">
                {seedData.map((val, i) => (
                  <div
                    key={dayLabels[i]}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="relative w-full flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-md bg-emerald-100"
                        style={{ height: "100%" }}
                      />
                      <div
                        className={`absolute bottom-0 w-full rounded-t-md analytics-bar ${
                          i === 6 ? "bg-emerald-500" : "bg-emerald-300"
                        }`}
                        style={{
                          height: `${Math.round((val / maxVal) * 100)}%`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
          <div className="flex gap-1.5">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="flex-1 text-center">
                <span className="text-[9px] text-muted-foreground font-medium">
                  {d}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Simulated weekly Green Points activity
          </p>
        </div>
      </div>

      {/* Campus Totals */}
      <div className="px-5 mt-4">
        <div
          data-ocid="profile.campus_totals.card"
          className="bg-card border border-border rounded-2xl p-4"
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Campus Totals
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs text-emerald-600 font-medium mb-1">
                Total CO₂ Saved
              </p>
              <p className="text-xl font-bold font-display text-emerald-700">
                {(
                  2847 +
                  itemsLendedCount * 0.5 +
                  foodClaimedCount * 0.3
                ).toFixed(0)}
                <span className="text-sm font-normal ml-0.5">kg</span>
              </p>
              <p className="text-[10px] text-emerald-600 mt-0.5">campus-wide</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-600 font-medium mb-1">
                Items Shared
              </p>
              <p className="text-xl font-bold font-display text-blue-700">
                {312 +
                  borrowItems.filter((b) => b.status === "Borrowed").length}
              </p>
              <p className="text-[10px] text-blue-600 mt-0.5">
                You contributed{" "}
                {Math.max(
                  0.1,
                  (itemsLendedCount /
                    Math.max(
                      312 +
                        borrowItems.filter((b) => b.status === "Borrowed")
                          .length,
                      1,
                    )) *
                    100,
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Achievement Badges */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Achievements
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              emoji: "🌱",
              label: "First Lend",
              earned: itemsLendedCount >= 1,
              hint: itemsLendedCount >= 1 ? "Earned!" : "Lend 1 item",
            },
            {
              emoji: "🍱",
              label: "Food Rescuer",
              earned: foodClaimedCount >= 1,
              hint: foodClaimedCount >= 1 ? "Earned!" : "Claim 1 food",
            },
            {
              emoji: "📚",
              label: "Study Buddy",
              earned: studyRoomsBooked >= 1,
              hint: studyRoomsBooked >= 1 ? "Earned!" : "Book a room",
            },
            {
              emoji: "⚡",
              label: "Power Lender",
              earned: itemsLendedCount >= 3,
              hint: `${itemsLendedCount}/3 lends`,
            },
            {
              emoji: "🌍",
              label: "Eco Hero",
              earned: greenPoints >= 500,
              hint: `${greenPoints}/500 pts`,
            },
            {
              emoji: "🤝",
              label: "Request Hero",
              earned: requestsFulfilled >= 1,
              hint: requestsFulfilled >= 1 ? "Earned!" : "Fulfill 1 request",
            },
          ].map(({ emoji, label, earned, hint }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl border text-center ${
                earned
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <span
                className={`text-2xl ${earned ? "" : "grayscale opacity-40"}`}
              >
                {emoji}
              </span>
              <span
                className={`text-[10px] font-semibold leading-tight ${
                  earned ? "text-emerald-700" : "text-gray-400"
                }`}
              >
                {label}
              </span>
              <span
                className={`text-[9px] leading-tight ${
                  earned ? "text-emerald-500" : "text-gray-400"
                }`}
              >
                {earned ? "✓ Earned" : hint}
              </span>
              {!earned && <Lock size={10} className="text-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Admin Panel Link */}
      {onOpenAdmin && (
        <div className="px-5 mt-6">
          <button
            type="button"
            data-ocid="profile.admin_panel.button"
            onClick={onOpenAdmin}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground border border-border rounded-xl py-2.5 px-4 hover:bg-slate-50 hover:text-foreground transition-colors"
          >
            <Shield size={13} className="text-slate-400" />
            Faculty Admin Panel
            <Lock size={11} className="text-slate-300 ml-1" />
          </button>
        </div>
      )}

      {/* Reset Demo Button */}
      {onResetDemo && (
        <div className="px-5 mt-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                data-ocid="profile.reset_demo_button"
                className="w-full flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground border border-border rounded-xl py-2.5 px-4 hover:bg-muted/50 transition-colors"
              >
                <RefreshCw size={13} />
                Reset Demo
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent
              data-ocid="profile.reset_demo.dialog"
              className="max-w-sm mx-auto"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display">
                  Reset all demo data?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will restore all items to their original state. Your
                  login will remain active.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  data-ocid="profile.reset_demo.cancel_button"
                  className="rounded-xl"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="profile.reset_demo.confirm_button"
                  onClick={onResetDemo}
                  className="rounded-xl bg-destructive text-white hover:bg-destructive/90"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Footer Attribution */}
      <div className="px-5 mt-6 pb-2 text-center">
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
