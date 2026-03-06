import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Loader2, Plus, Utensils, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FoodAlert } from "../App";

interface FoodScreenProps {
  foodAlerts: FoodAlert[];
  onClaimFood: (id: bigint) => void;
  onAddFoodAlert: (alert: FoodAlert) => void;
  nextFoodId: bigint;
}

const SOURCE_EMOJIS: Record<string, string> = {
  "Cafeteria Block A": "🏢",
  "Faculty Lounge": "👨‍🏫",
  "MBA Canteen": "🎓",
  "Engineering Block Pantry": "⚙️",
  "Guest House Kitchen": "🏨",
  Event: "🎉",
  Other: "🍽️",
};

const EXPIRY_OPTIONS = [
  "15 mins left",
  "30 mins left",
  "45 mins left",
  "1 hour left",
  "2 hours left",
  "3 hours left",
];

const SOURCE_OPTIONS = [
  "Cafeteria Block A",
  "Faculty Lounge",
  "MBA Canteen",
  "Engineering Block Pantry",
  "Guest House Kitchen",
  "Event",
  "Other",
];

function getUrgencyBg(timeLeft: string, claimed: boolean): string {
  if (claimed) return "bg-gray-50 border-gray-100";
  if (timeLeft.includes("15 mins") || timeLeft.includes("20 mins"))
    return "bg-red-50 border-red-100";
  if (
    timeLeft.includes("30 mins") ||
    timeLeft.includes("45 mins") ||
    timeLeft.includes("1 hour")
  )
    return "bg-amber-50 border-amber-100";
  return "bg-blue-50 border-blue-100";
}

function getTimeBadge(timeLeft: string): string {
  if (timeLeft.includes("15 mins") || timeLeft.includes("20 mins"))
    return "bg-red-100 text-red-700 border-red-200";
  if (
    timeLeft.includes("30 mins") ||
    timeLeft.includes("45 mins") ||
    timeLeft.includes("1 hour")
  )
    return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

export default function FoodScreen({
  foodAlerts,
  onClaimFood,
  onAddFoodAlert,
  nextFoodId,
}: FoodScreenProps) {
  const [claiming, setClaiming] = useState<bigint | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Form state
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [source, setSource] = useState("");

  const handleClaim = async (alert: FoodAlert) => {
    if (alert.claimed) return;
    setClaiming(alert.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onClaimFood(alert.id);
    setClaiming(null);
    toast.success(
      "Food claimed! +15 Green Points earned for reducing waste. 🌿",
    );
  };

  const handlePostFoodRescue = async () => {
    if (!foodName.trim() || !quantity || !expiryTime || !source) {
      toast.error("Please fill in all fields.");
      return;
    }
    const qty = Number.parseInt(quantity, 10);
    if (Number.isNaN(qty) || qty < 1) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    setIsPosting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newAlert: FoodAlert = {
      id: nextFoodId,
      foodName: foodName.trim(),
      source,
      quantity: BigInt(qty),
      timeLeft: expiryTime,
      claimed: false,
    };

    onAddFoodAlert(newAlert);
    setIsPosting(false);
    setShowForm(false);
    setFoodName("");
    setQuantity("");
    setExpiryTime("");
    setSource("");

    toast.success(
      `"${newAlert.foodName}" posted for rescue! +5 Green Points 🌱`,
    );
  };

  const activeCount = foodAlerts.filter((a) => !a.claimed).length;
  const hasUrgent = foodAlerts.some(
    (a) =>
      !a.claimed &&
      (a.timeLeft.includes("15 mins") || a.timeLeft.includes("20 mins")),
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.98 0.012 65) 0%, oklch(0.97 0.008 145) 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl amber-gradient flex items-center justify-center">
            <Utensils size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Food Rescue
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          {activeCount} alerts active · Reduce waste, feed a friend
        </p>
      </div>

      {/* Urgency Banner */}
      {hasUrgent && (
        <div className="mx-5 mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-base">⚡</span>
          <p className="text-xs font-semibold text-red-700">
            Some alerts expire very soon — claim now!
          </p>
        </div>
      )}

      {/* Post Food Rescue CTA Banner */}
      {!showForm && (
        <div className="mx-5 mb-4">
          <button
            type="button"
            data-ocid="food.post_rescue.open_modal_button"
            onClick={() => setShowForm(true)}
            className="w-full flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl px-4 py-4 shadow-md hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Plus size={20} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold">Post Food Rescue</p>
              <p className="text-xs text-white/80">
                List surplus food · Earn +5 Green Points
              </p>
            </div>
            <span className="text-xl">🍽️</span>
          </button>
        </div>
      )}

      {/* Post Food Rescue Form */}
      {showForm && (
        <div
          data-ocid="food.post_rescue.modal"
          className="mx-5 mb-4 bg-white border border-emerald-100 rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍽️</span>
              <p className="text-sm font-bold text-white">Post Food Rescue</p>
            </div>
            <button
              type="button"
              data-ocid="food.post_rescue.close_button"
              onClick={() => setShowForm(false)}
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Food Name */}
            <div className="space-y-1">
              <Label
                htmlFor="food-name"
                className="text-xs font-semibold text-foreground"
              >
                Food Name *
              </Label>
              <Input
                id="food-name"
                data-ocid="food.post_rescue.food_name.input"
                placeholder="e.g. Vada Pav, Pizza Slices, Biryani"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="text-sm rounded-xl"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <Label
                htmlFor="food-qty"
                className="text-xs font-semibold text-foreground"
              >
                Quantity (portions) *
              </Label>
              <Input
                id="food-qty"
                data-ocid="food.post_rescue.quantity.input"
                type="number"
                placeholder="e.g. 10"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="text-sm rounded-xl"
              />
            </div>

            {/* Expiry Time */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">
                Expiry Time *
              </Label>
              <Select onValueChange={setExpiryTime} value={expiryTime}>
                <SelectTrigger
                  data-ocid="food.post_rescue.expiry.select"
                  className="text-sm rounded-xl"
                >
                  <SelectValue placeholder="How long is it available?" />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Source */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">
                Source *
              </Label>
              <Select onValueChange={setSource} value={source}>
                <SelectTrigger
                  data-ocid="food.post_rescue.source.select"
                  className="text-sm rounded-xl"
                >
                  <SelectValue placeholder="Cafeteria / Event location" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Button
              data-ocid="food.post_rescue.submit_button"
              onClick={handlePostFoodRescue}
              disabled={isPosting}
              className="w-full amber-gradient text-white border-0 rounded-xl font-semibold text-sm hover:opacity-90"
            >
              {isPosting ? (
                <Loader2 size={14} className="animate-spin mr-2" />
              ) : (
                <Plus size={14} className="mr-2" />
              )}
              {isPosting ? "Posting..." : "Post Food Rescue · +5 pts"}
            </Button>
          </div>
        </div>
      )}

      {/* Food Alert List */}
      <div className="px-5 space-y-3">
        {foodAlerts.map((alert, index) => {
          const isClaiming = claiming === alert.id;
          const emoji = SOURCE_EMOJIS[alert.source] ?? "🍽️";
          const urgencyBg = getUrgencyBg(alert.timeLeft, alert.claimed);
          const timeBadge = getTimeBadge(alert.timeLeft);

          return (
            <div
              key={alert.id.toString()}
              data-ocid={`food.item.${index + 1}`}
              className={`rounded-2xl border p-4 card-hover ${urgencyBg}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="text-sm font-bold text-foreground">
                      {alert.foodName}
                    </h3>
                    {alert.claimed && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border status-claimed">
                        Claimed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {alert.source}
                  </p>
                  <p className="text-sm text-foreground/80 font-medium">
                    {alert.quantity.toString()} portions available
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Clock size={11} className="text-muted-foreground" />
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${timeBadge}`}
                    >
                      {alert.timeLeft}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  data-ocid={`food.claim_button.${index + 1}`}
                  disabled={alert.claimed || isClaiming}
                  onClick={() => handleClaim(alert)}
                  className={`text-xs font-semibold shrink-0 rounded-xl ${
                    alert.claimed
                      ? "bg-muted text-muted-foreground"
                      : "amber-gradient text-white border-0 hover:opacity-90"
                  }`}
                >
                  {isClaiming ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : alert.claimed ? (
                    "Claimed"
                  ) : (
                    "Claim"
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        {foodAlerts.length === 0 && (
          <div
            data-ocid="food.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <Utensils size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No food alerts right now</p>
            <p className="text-xs mt-1 opacity-70">
              Be the first to post one above!
            </p>
          </div>
        )}

        {foodAlerts.length > 0 && activeCount === 0 && (
          <div
            data-ocid="food.all_claimed.empty_state"
            className="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center mt-2"
          >
            <Utensils size={36} className="mx-auto mb-3 text-amber-400" />
            <p className="text-sm font-semibold text-amber-800">
              All food rescued for now!
            </p>
            <p className="text-xs text-amber-600 mt-1.5">
              Post a new alert above if you have surplus food.
            </p>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mx-5 mt-5 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-3 items-start">
        <span className="text-base">♻️</span>
        <p className="text-xs text-emerald-700">
          Each food rescue prevents ~350g of waste. Claim to eat, post to share!
        </p>
      </div>
    </div>
  );
}
