import { Progress } from "@/components/ui/progress";
import {
  Bell,
  BookOpen,
  Leaf,
  Package,
  TrendingUp,
  Utensils,
} from "lucide-react";
import type { Tab } from "../App";

interface HomeScreenProps {
  greenPoints: number;
  onNavigate: (tab: Tab) => void;
}

const QUICK_CARDS = [
  {
    id: "borrow",
    label: "Smart Borrow",
    description: "Share & borrow items",
    Icon: Package,
    tab: "borrow" as Tab,
    ocid: "home.borrow.card",
    colorClass: "green-gradient",
    emoji: "📦",
  },
  {
    id: "food",
    label: "Food Rescue",
    description: "Claim surplus food",
    Icon: Utensils,
    tab: "food" as Tab,
    ocid: "home.food.card",
    colorClass: "amber-gradient",
    emoji: "🍱",
  },
  {
    id: "study",
    label: "Study Space",
    description: "Find a quiet room",
    Icon: BookOpen,
    tab: "study" as Tab,
    ocid: "home.study.card",
    colorClass: "blue-gradient",
    emoji: "📚",
  },
  {
    id: "score",
    label: "Green Score",
    description: "Track your impact",
    Icon: TrendingUp,
    tab: "profile" as Tab,
    ocid: "home.score.card",
    colorClass: "green-gradient",
    emoji: "🌱",
  },
];

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

export default function HomeScreen({
  greenPoints,
  onNavigate,
}: HomeScreenProps) {
  const levelInfo = getLevel(greenPoints);
  const progressPct = Math.min(
    100,
    Math.round((greenPoints / levelInfo.next) * 100),
  );

  return (
    <div className="min-h-screen pb-4">
      {/* Top Header */}
      <div className="px-5 pt-12 pb-2 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
            NMIMS Vile Parle Campus
          </p>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Good morning, Priya! 👋
          </h1>
        </div>
        <button
          type="button"
          className="mt-1 w-9 h-9 rounded-full bg-accent flex items-center justify-center"
        >
          <Bell size={18} className="text-foreground/70" />
        </button>
      </div>

      {/* Green Score Widget */}
      <div className="px-5 mt-4">
        <div className="score-card-gradient grain-overlay relative rounded-2xl p-5 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -right-2 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Leaf size={16} className="text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium">
                  Your Green Score
                </span>
              </div>
              <span className="text-xs text-white/60 bg-white/10 px-2.5 py-1 rounded-full font-medium">
                Lv. {levelInfo.level}
              </span>
            </div>

            <div className="flex items-end gap-2 mb-1">
              <span className="text-5xl font-bold text-white font-display leading-none">
                {greenPoints}
              </span>
              <span className="text-white/70 text-base pb-1">pts</span>
            </div>

            <p className="text-white/80 text-sm font-semibold mb-3">
              {levelInfo.name}
            </p>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-white/60">
                <span>Progress to next level</span>
                <span>
                  {greenPoints} / {levelInfo.next}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-white/50">
                {levelInfo.next - greenPoints} pts to reach Level{" "}
                {levelInfo.level + 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_CARDS.map(
            ({
              id,
              label,
              description,
              Icon,
              tab,
              ocid,
              colorClass,
              emoji,
            }) => (
              <button
                type="button"
                key={id}
                data-ocid={ocid}
                onClick={() => onNavigate(tab)}
                className={`${colorClass} grain-overlay relative rounded-2xl p-4 text-left overflow-hidden card-hover active:scale-[0.97] transition-transform duration-100`}
              >
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-white" />
                  </div>
                  <p className="text-white font-bold text-sm leading-tight font-display">
                    {label}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">{description}</p>
                  <span className="absolute top-3 right-3 text-lg">
                    {emoji}
                  </span>
                </div>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Today's Activity */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Today's Activity
        </h2>
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          {[
            {
              icon: "📦",
              text: "You borrowed a Laptop Charger",
              time: "2h ago",
              color: "text-emerald-600",
            },
            {
              icon: "🍱",
              text: "Food claimed from MBA Canteen",
              time: "5h ago",
              color: "text-amber-600",
            },
            {
              icon: "📚",
              text: "Library Room 3 booked",
              time: "Yesterday",
              color: "text-blue-600",
            },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">
                  {item.text}
                </p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability Tip */}
      <div className="px-5 mt-4 mb-2">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-3 items-start">
          <span className="text-lg mt-0.5">💡</span>
          <div>
            <p className="text-xs font-semibold text-emerald-800">
              Eco Tip of the Day
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Sharing one item saves ~2.3 kg of CO₂ equivalent. Your borrowing
              habit matters!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
