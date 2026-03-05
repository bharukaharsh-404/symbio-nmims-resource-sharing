import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Clock, Loader2, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface FoodScreenProps {
  onPointsEarned: (pts: number) => void;
}

interface FoodAlertLocal {
  id: bigint;
  source: string;
  quantity: bigint;
  timeLeft: string;
  claimed: boolean;
}

const MOCK_FOOD_ALERTS: FoodAlertLocal[] = [
  {
    id: 1n,
    source: "Cafeteria Block A",
    quantity: 12n,
    timeLeft: "45 mins left",
    claimed: false,
  },
  {
    id: 2n,
    source: "Faculty Lounge",
    quantity: 6n,
    timeLeft: "20 mins left",
    claimed: false,
  },
  {
    id: 3n,
    source: "MBA Canteen",
    quantity: 8n,
    timeLeft: "1 hour left",
    claimed: false,
  },
  {
    id: 4n,
    source: "Engineering Block Pantry",
    quantity: 4n,
    timeLeft: "15 mins left",
    claimed: false,
  },
  {
    id: 5n,
    source: "Guest House Kitchen",
    quantity: 10n,
    timeLeft: "2 hours left",
    claimed: false,
  },
];

const SOURCE_EMOJIS: Record<string, string> = {
  "Cafeteria Block A": "🏢",
  "Faculty Lounge": "👨‍🏫",
  "MBA Canteen": "🎓",
  "Engineering Block Pantry": "⚙️",
  "Guest House Kitchen": "🏨",
};

function getUrgencyBg(timeLeft: string, claimed: boolean): string {
  if (claimed) return "bg-gray-50 border-gray-100";
  if (timeLeft.includes("15 mins") || timeLeft.includes("20 mins"))
    return "bg-red-50 border-red-100";
  if (timeLeft.includes("45 mins") || timeLeft.includes("1 hour"))
    return "bg-amber-50 border-amber-100";
  return "bg-blue-50 border-blue-100";
}

function getTimeBadge(timeLeft: string): string {
  if (timeLeft.includes("15 mins") || timeLeft.includes("20 mins"))
    return "bg-red-100 text-red-700 border-red-200";
  if (timeLeft.includes("45 mins") || timeLeft.includes("1 hour"))
    return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

export default function FoodScreen({ onPointsEarned }: FoodScreenProps) {
  const { actor, isFetching } = useActor();
  const [alerts, setAlerts] = useState<FoodAlertLocal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [claiming, setClaiming] = useState<bigint | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        if (actor && !isFetching) {
          const data = await actor.getAllFoodAlerts();
          setAlerts(data.length > 0 ? data : MOCK_FOOD_ALERTS);
        } else {
          setAlerts(MOCK_FOOD_ALERTS);
        }
      } catch {
        setAlerts(MOCK_FOOD_ALERTS);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [actor, isFetching]);

  const handleClaim = async (alert: FoodAlertLocal) => {
    if (alert.claimed) return;
    setClaiming(alert.id);
    try {
      if (actor) {
        await actor.claimFoodAlert(alert.id);
      }
      setAlerts((prev) =>
        prev.map((a) => (a.id === alert.id ? { ...a, claimed: true } : a)),
      );
      onPointsEarned(15);
      toast.success(`Food claimed from ${alert.source} — +15 Green Points! 🌿`);
    } catch {
      toast.error("Failed to claim. Please try again.");
    } finally {
      setClaiming(null);
    }
  };

  const activeCount = alerts.filter((a) => !a.claimed).length;
  const hasUrgent = alerts.some(
    (a) => !a.claimed && a.timeLeft.includes("15 mins"),
  );

  return (
    <div className="min-h-screen pb-4">
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
      {!isLoading && hasUrgent && (
        <div className="mx-5 mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-base">⚡</span>
          <p className="text-xs font-semibold text-red-700">
            Some alerts expire very soon — claim now!
          </p>
        </div>
      )}

      {/* Content */}
      <div className="px-5 space-y-3">
        {isLoading ? (
          <>
            {(["s1", "s2", "s3", "s4"] as const).map((sk) => (
              <div
                key={sk}
                data-ocid="food.loading_state"
                className="bg-card rounded-2xl border border-border p-4 space-y-2"
              >
                <Skeleton className="h-4 w-2/3 skeleton-shimmer" />
                <Skeleton className="h-3 w-1/3 skeleton-shimmer" />
                <Skeleton className="h-8 w-24 skeleton-shimmer mt-2" />
              </div>
            ))}
          </>
        ) : loadError ? (
          <div
            data-ocid="food.error_state"
            className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center"
          >
            <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-700 font-medium">
              Failed to load food alerts
            </p>
          </div>
        ) : (
          alerts.map((alert, index) => {
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
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {alert.source}
                      </h3>
                      {alert.claimed && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border status-claimed">
                          Claimed
                        </span>
                      )}
                    </div>
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
          })
        )}

        {!isLoading && alerts.length === 0 && (
          <div
            data-ocid="food.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <Utensils size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No food alerts right now</p>
            <p className="text-xs mt-1 opacity-70">Check back at meal times!</p>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mx-5 mt-5 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-3 items-start">
        <span className="text-base">♻️</span>
        <p className="text-xs text-emerald-700">
          Each food claim prevents ~350g of food waste. You're making a
          difference!
        </p>
      </div>
    </div>
  );
}
