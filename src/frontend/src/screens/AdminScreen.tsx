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
import {
  BookOpen,
  Building2,
  ChevronRight,
  Loader2,
  Package,
  Shield,
  ToggleLeft,
  ToggleRight,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BorrowItem, FoodAlert, RequestItem, StudyRoom } from "../App";

interface AdminScreenProps {
  borrowItems: BorrowItem[];
  foodAlerts: FoodAlert[];
  studyRooms: StudyRoom[];
  requests: RequestItem[];
  onAddBorrowItem: (item: BorrowItem) => void;
  onAddFoodAlert: (alert: FoodAlert) => void;
  onToggleRoom: (id: bigint) => void;
  nextBorrowId: bigint;
  nextFoodId: bigint;
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

const SOURCE_OPTIONS = [
  "Cafeteria Block A",
  "Faculty Lounge",
  "MBA Canteen",
  "Engineering Block Pantry",
  "Guest House Kitchen",
  "Event",
  "Other",
];

const EXPIRY_OPTIONS = [
  "15 mins left",
  "30 mins left",
  "45 mins left",
  "1 hour left",
  "2 hours left",
  "3 hours left",
];

export default function AdminScreen({
  borrowItems,
  foodAlerts,
  studyRooms,
  requests,
  onAddBorrowItem,
  onAddFoodAlert,
  onToggleRoom,
  nextBorrowId,
  nextFoodId,
}: AdminScreenProps) {
  // Item form state
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [ownerName, setOwnerName] = useState("Admin");
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Food form state
  const [foodName, setFoodName] = useState("");
  const [foodQty, setFoodQty] = useState("");
  const [foodSource, setFoodSource] = useState("");
  const [foodExpiry, setFoodExpiry] = useState("");
  const [isAddingFood, setIsAddingFood] = useState(false);

  // Stats
  const totalItems = borrowItems.length;
  const foodAlertsActive = foodAlerts.filter((f) => !f.claimed).length;
  const roomsAvailable = studyRooms.filter(
    (r) => r.status === "Available",
  ).length;
  const requestsPending = requests.filter((r) => !r.fulfilled).length;

  const handleAddItem = async () => {
    if (!itemName.trim() || !itemCategory) {
      toast.error("Please fill in item name and category.");
      return;
    }
    setIsAddingItem(true);
    await new Promise((r) => setTimeout(r, 400));

    const newItem: BorrowItem = {
      id: nextBorrowId,
      name: itemName.trim(),
      category: itemCategory,
      status: "Available",
      ownerName: ownerName.trim() || "Admin",
    };

    onAddBorrowItem(newItem);
    setItemName("");
    setItemCategory("");
    setOwnerName("Admin");
    setIsAddingItem(false);
    toast.success("+1 item added to campus pool.");
  };

  const handleAddFood = async () => {
    if (!foodName.trim() || !foodQty || !foodSource || !foodExpiry) {
      toast.error("Please fill in all food fields.");
      return;
    }
    const qty = Number.parseInt(foodQty, 10);
    if (Number.isNaN(qty) || qty < 1) {
      toast.error("Invalid quantity.");
      return;
    }
    setIsAddingFood(true);
    await new Promise((r) => setTimeout(r, 400));

    const newAlert: FoodAlert = {
      id: nextFoodId,
      foodName: foodName.trim(),
      source: foodSource,
      quantity: BigInt(qty),
      timeLeft: foodExpiry,
      claimed: false,
    };

    onAddFoodAlert(newAlert);
    setFoodName("");
    setFoodQty("");
    setFoodSource("");
    setFoodExpiry("");
    setIsAddingFood(false);
    toast.success("Food alert posted!");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Admin Header — dark slate to visually differentiate */}
      <div
        className="px-5 pt-12 pb-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.04 250) 0%, oklch(0.16 0.05 240) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-4 w-20 h-20 rounded-full bg-white/3 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full">
              FACULTY / ADMIN
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mt-2">
            Admin Dashboard
          </h1>
          <p className="text-white/50 text-sm mt-0.5">
            Manage campus resources and alerts
          </p>
        </div>
      </div>

      {/* Campus Overview Stats */}
      <div className="px-5 mt-5">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Campus Overview
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <div
            data-ocid="admin.stats.items.card"
            className="bg-card border border-border rounded-2xl p-4 card-hover"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Package size={14} className="text-emerald-600" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Total Items
              </span>
            </div>
            <p className="text-3xl font-bold font-display text-foreground">
              {totalItems}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              in community pool
            </p>
          </div>

          <div
            data-ocid="admin.stats.food.card"
            className="bg-card border border-border rounded-2xl p-4 card-hover"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                <Utensils size={14} className="text-amber-600" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Food Active
              </span>
            </div>
            <p className="text-3xl font-bold font-display text-foreground">
              {foodAlertsActive}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              alerts unclaimed
            </p>
          </div>

          <div
            data-ocid="admin.stats.rooms.card"
            className="bg-card border border-border rounded-2xl p-4 card-hover"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen size={14} className="text-blue-600" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Rooms Free
              </span>
            </div>
            <p className="text-3xl font-bold font-display text-foreground">
              {roomsAvailable}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              available now
            </p>
          </div>

          <div
            data-ocid="admin.stats.requests.card"
            className="bg-card border border-border rounded-2xl p-4 card-hover"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                <Building2 size={14} className="text-violet-600" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Requests
              </span>
            </div>
            <p className="text-3xl font-bold font-display text-foreground">
              {requestsPending}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">pending help</p>
          </div>
        </div>
      </div>

      {/* Add Community Item */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Package size={15} className="text-emerald-600" />
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Add Community Item
          </h2>
        </div>

        <div
          data-ocid="admin.add_item.panel"
          className="bg-card border border-border rounded-2xl p-4 space-y-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor="admin-item-name" className="text-xs font-semibold">
              Item Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="admin-item-name"
              data-ocid="admin.add_item.name.input"
              placeholder="e.g. Projector"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={itemCategory} onValueChange={setItemCategory}>
                <SelectTrigger
                  data-ocid="admin.add_item.category.select"
                  className="rounded-xl text-sm"
                >
                  <SelectValue placeholder="Category" />
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
              <Label htmlFor="admin-owner" className="text-xs font-semibold">
                Owner Name
              </Label>
              <Input
                id="admin-owner"
                data-ocid="admin.add_item.owner.input"
                placeholder="Admin"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
          </div>

          <Button
            data-ocid="admin.add_item.submit_button"
            onClick={handleAddItem}
            disabled={!itemName.trim() || !itemCategory || isAddingItem}
            className="w-full green-gradient text-white border-0 rounded-xl font-semibold text-sm hover:opacity-90"
          >
            {isAddingItem ? (
              <Loader2 size={14} className="animate-spin mr-2" />
            ) : (
              <Package size={14} className="mr-2" />
            )}
            {isAddingItem ? "Adding…" : "Add to Campus Pool"}
          </Button>
        </div>
      </div>

      {/* Post Food Alert */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Utensils size={15} className="text-amber-500" />
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Post Food Alert
          </h2>
        </div>

        <div
          data-ocid="admin.add_food.panel"
          className="bg-card border border-border rounded-2xl p-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-food-name"
                className="text-xs font-semibold"
              >
                Food Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="admin-food-name"
                data-ocid="admin.add_food.name.input"
                placeholder="e.g. Biryani"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-food-qty" className="text-xs font-semibold">
                Qty (portions) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="admin-food-qty"
                data-ocid="admin.add_food.quantity.input"
                type="number"
                placeholder="e.g. 20"
                min="1"
                value={foodQty}
                onChange={(e) => setFoodQty(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Source <span className="text-destructive">*</span>
              </Label>
              <Select value={foodSource} onValueChange={setFoodSource}>
                <SelectTrigger
                  data-ocid="admin.add_food.source.select"
                  className="rounded-xl text-sm"
                >
                  <SelectValue placeholder="Source" />
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

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Expiry <span className="text-destructive">*</span>
              </Label>
              <Select value={foodExpiry} onValueChange={setFoodExpiry}>
                <SelectTrigger
                  data-ocid="admin.add_food.expiry.select"
                  className="rounded-xl text-sm"
                >
                  <SelectValue placeholder="How long?" />
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
          </div>

          <Button
            data-ocid="admin.add_food.submit_button"
            onClick={handleAddFood}
            disabled={
              !foodName.trim() ||
              !foodQty ||
              !foodSource ||
              !foodExpiry ||
              isAddingFood
            }
            className="w-full amber-gradient text-white border-0 rounded-xl font-semibold text-sm hover:opacity-90"
          >
            {isAddingFood ? (
              <Loader2 size={14} className="animate-spin mr-2" />
            ) : (
              <Utensils size={14} className="mr-2" />
            )}
            {isAddingFood ? "Posting…" : "Post Food Alert"}
          </Button>
        </div>
      </div>

      {/* Study Room Manager */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={15} className="text-blue-500" />
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Study Room Manager
          </h2>
        </div>

        <div className="space-y-2.5">
          {studyRooms.map((room, index) => {
            const isAvailable = room.status === "Available";
            return (
              <div
                key={room.id.toString()}
                data-ocid={`admin.room.item.${index + 1}`}
                className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 card-hover"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isAvailable ? "bg-emerald-100" : "bg-red-100"
                  }`}
                >
                  <BookOpen
                    size={14}
                    className={
                      isAvailable ? "text-emerald-600" : "text-red-500"
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {room.roomNo}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {room.location} · Cap: {room.capacity.toString()}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`admin.room.toggle.${index + 1}`}
                  onClick={() => {
                    onToggleRoom(room.id);
                    toast.success(
                      `${room.roomNo} set to ${isAvailable ? "Busy" : "Available"}`,
                    );
                  }}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                    isAvailable
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                  title={`Toggle to ${isAvailable ? "Busy" : "Available"}`}
                >
                  {isAvailable ? (
                    <ToggleRight size={14} />
                  ) : (
                    <ToggleLeft size={14} />
                  )}
                  {isAvailable ? "Available" : "Busy"}
                  <ChevronRight size={12} className="opacity-60" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="mx-5 mt-6 mb-2 bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-2 items-start">
        <Shield size={13} className="text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500">
          Admin panel — accessible to faculty and campus coordinators. Changes
          reflect immediately for all users.
        </p>
      </div>
    </div>
  );
}
