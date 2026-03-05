import { Button } from "@/components/ui/button";
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
import { HandHelping, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RequestItem {
  id: number;
  title: string;
  category: string;
  deadline: string;
  postedBy: string;
  fulfilled: boolean;
}

interface RequestsScreenProps {
  onPointsEarned: (pts: number) => void;
}

const MOCK_REQUESTS: RequestItem[] = [
  {
    id: 1,
    title: "Need Calculator for Exam",
    category: "Study Tools",
    deadline: "Today",
    postedBy: "Aditya Kumar",
    fulfilled: false,
  },
  {
    id: 2,
    title: "Need Projector for Presentation",
    category: "Electronics",
    deadline: "Tomorrow",
    postedBy: "Sneha Rao",
    fulfilled: false,
  },
  {
    id: 3,
    title: "Need Notes for Math 101",
    category: "Notes",
    deadline: "This Week",
    postedBy: "Rohan Verma",
    fulfilled: false,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Study Tools": "bg-violet-50 text-violet-700 border-violet-100",
  Electronics: "bg-blue-50 text-blue-700 border-blue-100",
  Food: "bg-orange-50 text-orange-700 border-orange-100",
  Notes: "bg-pink-50 text-pink-700 border-pink-100",
  Other: "bg-gray-50 text-gray-700 border-gray-100",
};

const DEADLINE_COLORS: Record<string, string> = {
  Today: "bg-red-50 text-red-600 border-red-100",
  Tomorrow: "bg-amber-50 text-amber-600 border-amber-100",
  "This Week": "bg-blue-50 text-blue-600 border-blue-100",
  "This Month": "bg-gray-50 text-gray-500 border-gray-100",
};

const CATEGORIES = ["Study Tools", "Electronics", "Food", "Notes", "Other"];
const DEADLINES = ["Today", "Tomorrow", "This Week", "This Month"];

export default function RequestsScreen({
  onPointsEarned,
}: RequestsScreenProps) {
  const [requests, setRequests] = useState<RequestItem[]>(MOCK_REQUESTS);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDeadline, setFormDeadline] = useState("");
  const [helping, setHelping] = useState<number | null>(null);

  const activeCount = requests.filter((r) => !r.fulfilled).length;

  const handlePostRequest = () => {
    if (!formTitle.trim() || !formCategory || !formDeadline) {
      toast.error("Please fill in all fields.");
      return;
    }
    const newRequest: RequestItem = {
      id: Date.now(),
      title: formTitle.trim(),
      category: formCategory,
      deadline: formDeadline,
      postedBy: "Demo User",
      fulfilled: false,
    };
    setRequests((prev) => [newRequest, ...prev]);
    setFormTitle("");
    setFormCategory("");
    setFormDeadline("");
    setShowForm(false);
    toast.success("Request posted!");
  };

  const handleHelp = async (req: RequestItem) => {
    if (req.fulfilled) return;
    setHelping(req.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, fulfilled: true } : r)),
    );
    onPointsEarned(15);
    setHelping(null);
    toast.success("Request fulfilled! +15 Green Points 🌱");
  };

  return (
    <div className="min-h-screen pb-24">
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
            <HandHelping size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Request Board
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          {activeCount} active request{activeCount !== 1 ? "s" : ""} on campus
        </p>
      </div>

      {/* Content */}
      <div className="px-5 pt-4 space-y-3">
        {requests.length === 0 ? (
          <div
            data-ocid="requests.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <HandHelping size={32} className="text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              No active requests right now.
            </p>
            <p className="text-xs text-muted-foreground">
              Be the first to post one!
            </p>
          </div>
        ) : (
          <div data-ocid="requests.list" className="space-y-3">
            {requests.map((req, index) => {
              const catColor =
                CATEGORY_COLORS[req.category] ||
                "bg-gray-50 text-gray-700 border-gray-100";
              const deadlineColor =
                DEADLINE_COLORS[req.deadline] ||
                "bg-gray-50 text-gray-500 border-gray-100";
              const isHelping = helping === req.id;

              return (
                <div
                  key={req.id}
                  data-ocid={`requests.item.${index + 1}`}
                  className="bg-card rounded-2xl border border-border p-4 card-hover"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3 className="text-sm font-semibold text-foreground">
                          {req.title}
                        </h3>
                        {req.fulfilled && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Fulfilled
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${catColor}`}
                        >
                          {req.category}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${deadlineColor}`}
                        >
                          {req.deadline}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Posted by:{" "}
                        <span className="font-medium text-foreground/80">
                          {req.postedBy}
                        </span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      data-ocid={`requests.help_button.${index + 1}`}
                      disabled={req.fulfilled || isHelping}
                      onClick={() => handleHelp(req)}
                      className={`text-xs font-semibold shrink-0 rounded-xl ${
                        req.fulfilled
                          ? "bg-muted text-muted-foreground"
                          : "green-gradient text-white border-0 hover:opacity-90"
                      }`}
                    >
                      {isHelping ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : req.fulfilled ? (
                        "Helped!"
                      ) : (
                        "I Can Help"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB Button */}
      <button
        type="button"
        data-ocid="requests.add_button"
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full green-gradient text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label="Post a new request"
      >
        <Plus size={22} />
      </button>

      {/* Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent data-ocid="requests.dialog" className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <HandHelping size={18} className="text-emerald-600" />
              Post a Request
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="req-title" className="text-sm font-medium">
                What do you need?
              </Label>
              <Input
                id="req-title"
                data-ocid="requests.title.input"
                placeholder="What do you need?"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Category</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger
                  data-ocid="requests.category.select"
                  className="rounded-xl"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                When do you need it?
              </Label>
              <Select value={formDeadline} onValueChange={setFormDeadline}>
                <SelectTrigger
                  data-ocid="requests.deadline.select"
                  className="rounded-xl"
                >
                  <SelectValue placeholder="Select a deadline" />
                </SelectTrigger>
                <SelectContent>
                  {DEADLINES.map((dl) => (
                    <SelectItem key={dl} value={dl}>
                      {dl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                data-ocid="requests.cancel_button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                data-ocid="requests.submit_button"
                onClick={handlePostRequest}
                className="flex-1 rounded-xl green-gradient text-white border-0 hover:opacity-90"
              >
                Post Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
