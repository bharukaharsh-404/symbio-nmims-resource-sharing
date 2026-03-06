import { Button } from "@/components/ui/button";
import { Crown, Leaf, Loader2, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BorrowItem, InventoryItem } from "../App";

interface BorrowScreenProps {
  borrowItems: BorrowItem[];
  onBorrowItem: (id: bigint) => void;
  myInventory: InventoryItem[];
  onLenderBorrow: (id: bigint) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "bg-blue-50 text-blue-700 border-blue-100",
  Accessories: "bg-purple-50 text-purple-700 border-purple-100",
  "Lab Equipment": "bg-yellow-50 text-yellow-700 border-yellow-100",
  Utilities: "bg-gray-50 text-gray-700 border-gray-100",
  Stationery: "bg-pink-50 text-pink-700 border-pink-100",
  Sports: "bg-orange-50 text-orange-700 border-orange-100",
  Books: "bg-teal-50 text-teal-700 border-teal-100",
  Other: "bg-gray-50 text-gray-700 border-gray-100",
};

export default function BorrowScreen({
  borrowItems,
  onBorrowItem,
  myInventory,
  onLenderBorrow,
}: BorrowScreenProps) {
  const [borrowing, setBorrowing] = useState<bigint | null>(null);
  const [simulating, setSimulating] = useState<bigint | null>(null);

  const handleBorrow = async (item: BorrowItem) => {
    if (item.status === "Borrowed") return;
    setBorrowing(item.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onBorrowItem(item.id);
    setBorrowing(null);
    toast.success(`Borrowed "${item.name}" successfully!`);
  };

  const handleSimulateBorrow = async (item: InventoryItem) => {
    if (item.status === "Borrowed") return;
    setSimulating(item.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onLenderBorrow(item.id);
    setSimulating(null);
    toast.success("Item borrowed! +15 Green Points earned for lending. 🌱");
  };

  const availableCount = borrowItems.filter(
    (i) => i.status === "Available",
  ).length;

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
          {availableCount} community items available
        </p>
      </div>

      <div className="px-5 space-y-4">
        {/* ── My Listed Items (My Inventory) ── */}
        {myInventory.length > 0 && (
          <section
            data-ocid="borrow.myinventory.section"
            className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4"
          >
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-3">
              <Crown size={15} className="text-emerald-600" />
              <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-widest">
                My Listed Items
              </h2>
              <span className="ml-auto text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                YOU EARN +15 pts when borrowed
              </span>
            </div>

            <div className="space-y-3">
              {myInventory.map((item, index) => {
                const isAvailable = item.status === "Available";
                const isSimulating = simulating === item.id;
                const catColor =
                  CATEGORY_COLORS[item.category] ||
                  "bg-gray-50 text-gray-700 border-gray-100";

                return (
                  <div
                    key={item.id.toString()}
                    data-ocid={`borrow.myinventory.item.${index + 1}`}
                    className="bg-white rounded-xl border border-emerald-100 p-3.5 card-hover"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground mb-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
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
                        {item.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        data-ocid={`borrow.myinventory.simulate_button.${index + 1}`}
                        disabled={!isAvailable || isSimulating}
                        onClick={() => handleSimulateBorrow(item)}
                        className={`text-xs font-semibold shrink-0 rounded-xl ${
                          isAvailable
                            ? "green-gradient text-white border-0 hover:opacity-90"
                            : "bg-muted text-muted-foreground cursor-default"
                        }`}
                      >
                        {isSimulating ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : isAvailable ? (
                          "Simulate Borrow"
                        ) : (
                          "Being Borrowed"
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Community Items ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Leaf size={15} className="text-emerald-600" />
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Community Items
            </h2>
            <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
              {availableCount} available
            </span>
          </div>

          <div className="space-y-3">
            {borrowItems.map((item, index) => {
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
            })}

            {borrowItems.length > 0 && availableCount === 0 && (
              <div
                data-ocid="borrow.all_borrowed.empty_state"
                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center mt-2"
              >
                <Leaf size={36} className="mx-auto mb-3 text-emerald-400" />
                <p className="text-sm font-semibold text-emerald-800">
                  No community items available right now.
                </p>
                <p className="text-xs text-emerald-600 mt-1.5">
                  Check back later!
                </p>
              </div>
            )}

            {borrowItems.length === 0 && (
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
        </section>
      </div>
    </div>
  );
}
