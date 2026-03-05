import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BookOpen, Loader2, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface StudyScreenProps {
  onPointsEarned: (pts: number) => void;
}

interface StudyRoomLocal {
  id: bigint;
  roomNo: string;
  location: string;
  capacity: bigint;
  status: string;
}

const MOCK_ROOMS: StudyRoomLocal[] = [
  {
    id: 1n,
    roomNo: "Library Room 3",
    location: "NMIMS Main Library",
    capacity: 8n,
    status: "Available",
  },
  {
    id: 2n,
    roomNo: "Innovation Lab",
    location: "Entrepreneurship Block",
    capacity: 12n,
    status: "Available",
  },
  {
    id: 3n,
    roomNo: "Seminar Hall B",
    location: "Academic Block 2",
    capacity: 30n,
    status: "Busy",
  },
  {
    id: 4n,
    roomNo: "Discussion Pod 1",
    location: "Student Center",
    capacity: 4n,
    status: "Available",
  },
  {
    id: 5n,
    roomNo: "Computer Lab 5",
    location: "Technology Block",
    capacity: 20n,
    status: "Busy",
  },
];

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

export default function StudyScreen({ onPointsEarned }: StudyScreenProps) {
  const { actor, isFetching } = useActor();
  const [rooms, setRooms] = useState<StudyRoomLocal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [booking, setBooking] = useState<bigint | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        if (actor && !isFetching) {
          const data = await actor.getAllStudyRooms();
          setRooms(data.length > 0 ? data : MOCK_ROOMS);
        } else {
          setRooms(MOCK_ROOMS);
        }
      } catch {
        setRooms(MOCK_ROOMS);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [actor, isFetching]);

  const handleBook = async (room: StudyRoomLocal) => {
    if (room.status === "Busy") return;
    setBooking(room.id);
    try {
      if (actor) {
        await actor.bookStudyRoom(room.id);
      }
      setRooms((prev) =>
        prev.map((r) => (r.id === room.id ? { ...r, status: "Busy" } : r)),
      );
      onPointsEarned(5);
      toast.success(`${room.roomNo} booked! — +5 Green Points 📚`);
    } catch {
      toast.error("Booking failed. Please try again.");
    } finally {
      setBooking(null);
    }
  };

  const availableCount = rooms.filter((r) => r.status === "Available").length;

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
              value: rooms.length - availableCount,
              color: "text-red-500 bg-red-50",
            },
            {
              label: "Total",
              value: rooms.length,
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
        {isLoading ? (
          <>
            {(["s1", "s2", "s3", "s4"] as const).map((sk) => (
              <div
                key={sk}
                data-ocid="study.loading_state"
                className="bg-card rounded-2xl border border-border p-4 space-y-2"
              >
                <Skeleton className="h-4 w-2/3 skeleton-shimmer" />
                <Skeleton className="h-3 w-1/2 skeleton-shimmer" />
                <Skeleton className="h-8 w-24 skeleton-shimmer mt-2" />
              </div>
            ))}
          </>
        ) : loadError ? (
          <div
            data-ocid="study.error_state"
            className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center"
          >
            <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-700 font-medium">
              Failed to load study rooms
            </p>
          </div>
        ) : (
          rooms.map((room, index) => {
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
          })
        )}

        {!isLoading && rooms.length === 0 && (
          <div
            data-ocid="study.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No rooms listed</p>
            <p className="text-xs mt-1 opacity-70">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
