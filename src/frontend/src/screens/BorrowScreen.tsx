import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface BorrowScreenProps {
  onPointsEarned: (pts: number) => void;
}

interface BorrowItemLocal {
  id: bigint;
  name: string;
  category: string;
  status: string;
  ownerName: string;
}

const MOCK_ITEMS: BorrowItemLocal[] = [
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
    status: "Borrowed",
    ownerName: "Kavya Nair",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "bg-blue-50 text-blue-700 border-blue-100",
  Accessories: "bg-purple-50 text-purple-700 border-purple-100",
  "Lab Equipment": "bg-yellow-50 text-yellow-700 border-yellow-100",
  Utilities: "bg-gray-50 text-gray-700 border-gray-100",
  Stationery: "bg-pink-50 text-pink-700 border-pink-100",
  Sports: "bg-orange-50 text-orange-700 border-orange-100",
};

export default function BorrowScreen({ onPointsEarned }: BorrowScreenProps) {
  const { actor, isFetching } = useActor();
  const [items, setItems] = useState<BorrowItemLocal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [borrowing, setBorrowing] = useState<bigint | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        if (actor && !isFetching) {
          const data = await actor.getAllBorrowItems();
          setItems(data.length > 0 ? data : MOCK_ITEMS);
        } else {
          setItems(MOCK_ITEMS);
        }
      } catch {
        setItems(MOCK_ITEMS);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [actor, isFetching]);

  const handleBorrow = async (item: BorrowItemLocal) => {
    if (item.status === "Borrowed") return;
    setBorrowing(item.id);
    try {
      if (actor) {
        await actor.claimBorrowItem(item.id);
      }
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: "Borrowed" } : it,
        ),
      );
      onPointsEarned(10);
      toast.success(`Borrowed "${item.name}" — +10 Green Points! 🌱`);
    } catch {
      toast.error("Failed to borrow item. Please try again.");
    } finally {
      setBorrowing(null);
    }
  };

  const availableCount = items.filter((i) => i.status === "Available").length;

  return (
    <div className="min-h-screen pb-4">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.012 155) 0%, oklch(0.97 0.008 145) 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl green-gradient flex items-center justify-center">
            <Package size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Smart Borrow
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          {availableCount} items available on campus
        </p>
      </div>

      {/* Content */}
      <div className="px-5 space-y-3">
        {isLoading ? (
          <>
            {(["s1", "s2", "s3", "s4", "s5"] as const).map((sk) => (
              <div
                key={sk}
                data-ocid="borrow.loading_state"
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
            data-ocid="borrow.error_state"
            className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center"
          >
            <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-700 font-medium">
              Failed to load items
            </p>
            <p className="text-xs text-red-500 mt-1">Using cached data</p>
          </div>
        ) : (
          items.map((item, index) => {
            const isAvailable = item.status === "Available";
            const isBorrowing = borrowing === item.id;
            const catColor =
              CATEGORY_COLORS[item.category] ||
              "bg-gray-50 text-gray-700 border-gray-100";

            return (
              <div
                key={item.id.toString()}
                data-ocid={`borrow.item.${index + 1}`}
                className="bg-card rounded-2xl border border-border p-4 card-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${catColor}`}
                      >
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isAvailable ? "status-available" : "status-borrowed"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Owner:{" "}
                      <span className="font-medium text-foreground/80">
                        {item.ownerName}
                      </span>
                    </p>
                  </div>
                  <Button
                    size="sm"
                    data-ocid={`borrow.button.${index + 1}`}
                    disabled={!isAvailable || isBorrowing}
                    onClick={() => handleBorrow(item)}
                    className={`text-xs font-semibold shrink-0 rounded-xl ${
                      isAvailable
                        ? "green-gradient text-white border-0 hover:opacity-90"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isBorrowing ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : isAvailable ? (
                      "Borrow"
                    ) : (
                      "Unavailable"
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        )}

        {!isLoading && items.length === 0 && (
          <div
            data-ocid="borrow.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No items listed yet</p>
            <p className="text-xs mt-1 opacity-70">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
