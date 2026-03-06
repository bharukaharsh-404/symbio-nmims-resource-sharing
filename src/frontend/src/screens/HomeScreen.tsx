import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  BookOpen,
  Box,
  Leaf,
  Loader2,
  Package,
  Plus,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ActivityEvent, InventoryItem, Tab, UserProfile } from "../App";

interface HomeScreenProps {
  greenPoints: number;
  onNavigate: (tab: Tab) => void;
  itemsBorrowedCount: number;
  foodClaimedCount: number;
  userProfile?: UserProfile | null;
  onAddInventoryItem: (item: InventoryItem) => void;
  nextInventoryId: bigint;
  activityFeed?: ActivityEvent[];
  localName?: string;
}

const ITEM_CATEGORIES = [
  "Electronics",
  "Books",
  "Stationery",
  "Sports",
  "Lab Equipment",
  "Accessories",
  "Utilities",
  "Other",
];

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

const DEFAULT_FEED: ActivityEvent[] = [
  {
    id: "1",
    icon: "📦",
    text: "You listed a Mechanical Keyboard",
    time: "1h ago",
    color: "text-emerald-600",
  },
  {
    id: "2",
    icon: "🍱",
    text: "Food claimed from MBA Canteen",
    time: "3h ago",
    color: "text-amber-600",
  },
  {
    id: "3",
    icon: "📚",
    text: "Library Room 3 booked",
    time: "Yesterday",
    color: "text-blue-600",
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
  itemsBorrowedCount,
  foodClaimedCount,
  userProfile,
  onAddInventoryItem,
  nextInventoryId,
  activityFeed,
  localName,
}: HomeScreenProps) {
  const levelInfo = getLevel(greenPoints);
  const progressPct = Math.min(
    100,
    Math.round((greenPoints / levelInfo.next) * 100),
  );

  const [showListDialog, setShowListDialog] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayName = userProfile?.name || localName;

  const handleListItem = async () => {
    if (!itemName.trim() || !itemCategory) {
      toast.error("Please fill in item name and category.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newItem: InventoryItem = {
      id: nextInventoryId,
      name: itemName.trim(),
      category: itemCategory,
      description: itemDescription.trim(),
      status: "Available",
    };
    onAddInventoryItem(newItem);
    setItemName("");
    setItemCategory("");
    setItemDescription("");
    setIsSubmitting(false);
    setShowListDialog(false);
    toast.success("Item listed! Others can now borrow it. 📦");
  };

  const feedItems =
    activityFeed && activityFeed.length > 0 ? activityFeed : DEFAULT_FEED;

  return (
    <div className="min-h-screen pb-4">
      {/* Top Header */}
      <div className="px-5 pt-12 pb-2 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
            NMIMS Vile Parle Campus
          </p>
          <h1 className="text-2xl font-bold text-foreground font-display">
            {displayName
              ? `Good morning, ${displayName.split(" ")[0]}! 👋`
              : "Good morning! 👋"}
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
              <span
                key={greenPoints}
                className="text-5xl font-bold text-white font-display leading-none score-pop"
              >
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

      {/* Impact Stats Banner */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Campus Impact
        </h2>
        <div
          data-ocid="home.impact_banner.section"
          className="relative rounded-2xl p-4 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.15 155) 0%, oklch(0.48 0.13 148) 100%)",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -right-1 w-16 h-16 rounded-full bg-white/5" />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Items Shared */}
            <div
              data-ocid="home.impact_items_shared.card"
              className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-2 bg-white/10 rounded-xl px-4 py-3 sm:py-4"
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Box size={16} className="text-white" />
              </div>
              <div className="flex sm:flex-col items-center gap-2 sm:gap-0">
                <span className="text-2xl font-bold text-white font-display leading-none">
                  {itemsBorrowedCount}
                </span>
                <span className="text-white/70 text-xs sm:mt-1">
                  Items Lended
                </span>
              </div>
            </div>

            {/* Food Rescued */}
            <div
              data-ocid="home.impact_food_rescued.card"
              className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-2 bg-white/10 rounded-xl px-4 py-3 sm:py-4"
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Utensils size={16} className="text-white" />
              </div>
              <div className="flex sm:flex-col items-center gap-2 sm:gap-0">
                <span className="text-2xl font-bold text-white font-display leading-none">
                  {foodClaimedCount}
                </span>
                <span className="text-white/70 text-xs sm:mt-1">
                  Food Rescued
                </span>
              </div>
            </div>

            {/* CO2 Saved */}
            <div
              data-ocid="home.impact_co2_saved.card"
              className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-2 bg-white/10 rounded-xl px-4 py-3 sm:py-4"
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Leaf size={16} className="text-white" />
              </div>
              <div className="flex sm:flex-col items-center gap-2 sm:gap-0">
                <span className="text-2xl font-bold text-white font-display leading-none">
                  {(itemsBorrowedCount * 0.5 + foodClaimedCount * 0.3).toFixed(
                    1,
                  )}
                </span>
                <span className="text-white/70 text-xs sm:mt-1">
                  CO₂ Saved (kg)
                </span>
              </div>
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

      {/* Campus Activity Feed */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Campus Activity
        </h2>
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          {feedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 feed-item-slide"
            >
              <span className="text-xl mt-0.5">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${item.color}`}>
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
              Sharing one item saves ~2.3 kg of CO₂ equivalent. Lend to earn
              Green Points and make a difference!
            </p>
          </div>
        </div>
      </div>

      {/* FAB — List an Item */}
      <button
        type="button"
        data-ocid="home.list_item_button"
        onClick={() => setShowListDialog(true)}
        className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full green-gradient text-white shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all duration-150"
        aria-label="List an item for sharing"
      >
        <Plus size={22} />
      </button>

      {/* List Item Dialog */}
      <Dialog open={showListDialog} onOpenChange={setShowListDialog}>
        <DialogContent
          data-ocid="home.list_item.dialog"
          className="max-w-sm mx-auto"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <Package size={18} className="text-emerald-600" />
              List an Item
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="item-name" className="text-sm font-medium">
                Item Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item-name"
                data-ocid="home.list_item.name.input"
                placeholder="e.g. Scientific Calculator"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="rounded-xl"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={itemCategory} onValueChange={setItemCategory}>
                <SelectTrigger
                  data-ocid="home.list_item.category.select"
                  className="rounded-xl"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-desc" className="text-sm font-medium">
                Description{" "}
                <span className="text-muted-foreground text-[11px] font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="item-desc"
                placeholder="Brief description of the item…"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="rounded-xl text-sm resize-none min-h-[80px]"
              />
            </div>

            {/* Info hint */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
              <Leaf size={13} className="text-emerald-600 shrink-0" />
              <p className="text-[11px] text-emerald-700 font-medium">
                You earn <span className="font-bold">+15 Green Points</span>{" "}
                each time someone borrows your item!
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                data-ocid="home.list_item.cancel_button"
                onClick={() => setShowListDialog(false)}
                className="flex-1 rounded-xl border border-border py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="home.list_item.submit_button"
                onClick={handleListItem}
                disabled={!itemName.trim() || !itemCategory || isSubmitting}
                className="flex-1 rounded-xl green-gradient text-white text-sm font-semibold py-2 hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                {isSubmitting ? "Listing…" : "List Item"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
