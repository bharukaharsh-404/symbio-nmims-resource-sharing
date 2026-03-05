import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Leaf, Package, Trophy, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";

interface ProfileScreenProps {
  greenPoints: number;
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

export default function ProfileScreen({ greenPoints }: ProfileScreenProps) {
  const { actor, isFetching } = useActor();
  const [profileName, setProfileName] = useState("Priya Mehta");
  const [profileDept, setProfileDept] = useState("BBA 3rd Year");
  const [profileInitials, setProfileInitials] = useState("PM");
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoadingProfile(true);
      setIsLoadingLeaderboard(true);
      try {
        if (actor && !isFetching) {
          const [prof, lb] = await Promise.all([
            actor.getCallerUserProfile().catch(() => null),
            actor.getLeaderboard().catch(() => []),
          ]);
          if (prof) {
            setProfileName(prof.name);
            setProfileDept(prof.department);
            setProfileInitials(prof.avatarInitials);
          }
          if (lb.length > 0) {
            setLeaderboard(
              lb.slice(0, 3).map((u) => ({
                name: u.name,
                department: u.department,
                points: Number(u.greenPoints),
                initials: u.avatarInitials,
              })),
            );
          }
        }
      } catch {
        // use defaults
      } finally {
        setIsLoadingProfile(false);
        setIsLoadingLeaderboard(false);
      }
    };
    load();
  }, [actor, isFetching]);

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

      {/* Profile Card */}
      {isLoadingProfile ? (
        <div className="mx-5 bg-card rounded-2xl border border-border p-5 space-y-3">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full skeleton-shimmer" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 skeleton-shimmer" />
              <Skeleton className="h-3 w-24 skeleton-shimmer" />
            </div>
          </div>
        </div>
      ) : (
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
      )}

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
          {isLoadingLeaderboard
            ? (["lb1", "lb2", "lb3"] as const).map((sk) => (
                <div
                  key={sk}
                  data-ocid="profile.loading_state"
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3"
                >
                  <Skeleton className="w-8 h-8 rounded-full skeleton-shimmer" />
                  <Skeleton className="h-4 w-32 skeleton-shimmer" />
                  <Skeleton className="h-4 w-16 skeleton-shimmer ml-auto" />
                </div>
              ))
            : leaderboard.map((user, index) => {
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
