import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { StudyRoom } from "../App";

interface StudyScreenProps {
  studyRooms: StudyRoom[];
  onBookRoom: (id: bigint) => void;
}

const ROOM_ICONS: Record<string, string> = {
  "Library Room 3": "📖",
  "Innovation Lab": "💡",
  "Seminar Hall B": "🎤",
  "Discussion Pod 1": "💬",
  "Computer Lab 5": "💻",
};

function getCapacityLabel(cap: bigint): string {
  const n = Number(cap);
  if (n <= 4) return "Intimate";
  if (n <= 12) return "Small";
  if (n <= 20) return "Medium";
  return "Large";
}

export default function StudyScreen({
  studyRooms,
  onBookRoom,
}: StudyScreenProps) {
  const [booking, setBooking] = useState<bigint | null>(null);

  const handleBook = async (room: StudyRoom) => {
    if (room.status === "Busy") return;
    setBooking(room.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onBookRoom(room.id);
    setBooking(null);
    toast.success(`${room.roomNo} booked successfully! 📚`);
  };

  const availableCount = studyRooms.filter(
    (r) => r.status === "Available",
  ).length;

  return (
    <div className="min-h-screen pb-4">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.015 230) 0%, oklch(0.97 0.008 145) 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl blue-gradient flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Study Spaces
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          {availableCount} rooms open · Vile Parle Campus
        </p>
      </div>

      {/* Stats Row */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              label: "Available",
              value: availableCount,
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "Occupied",
              value: studyRooms.length - availableCount,
              color: "text-red-500 bg-red-50",
            },
            {
              label: "Total",
              value: studyRooms.length,
              color: "text-blue-600 bg-blue-50",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`${color} rounded-xl px-3 py-2.5 text-center`}
            >
              <p className="text-lg font-bold font-display">{value}</p>
              <p className="text-[10px] font-medium uppercase tracking-wide opacity-70">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 space-y-3">
        {studyRooms.length === 0 && (
          <div
            data-ocid="study.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No rooms listed</p>
            <p className="text-xs mt-1 opacity-70">Check back soon!</p>
          </div>
        )}

        {studyRooms.map((room, index) => {
          const isAvailable = room.status === "Available";
          const isBooking = booking === room.id;
          const icon = ROOM_ICONS[room.roomNo] ?? "🏫";
          const capLabel = getCapacityLabel(room.capacity);

          return (
            <div
              key={room.id.toString()}
              data-ocid={`study.item.${index + 1}`}
              className={`rounded-2xl border p-4 card-hover ${
                isAvailable
                  ? "bg-card border-border"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {room.roomNo}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isAvailable ? "status-available" : "status-busy"
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <MapPin size={11} className="text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {room.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Users size={11} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Capacity: {room.capacity.toString()}
                      </p>
                    </div>
                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                      {capLabel}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  data-ocid={`study.book_button.${index + 1}`}
                  disabled={!isAvailable || isBooking}
                  onClick={() => handleBook(room)}
                  className={`text-xs font-semibold shrink-0 rounded-xl ${
                    isAvailable
                      ? "blue-gradient text-white border-0 hover:opacity-90"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isBooking ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : isAvailable ? (
                    "Book Now"
                  ) : (
                    "Occupied"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
