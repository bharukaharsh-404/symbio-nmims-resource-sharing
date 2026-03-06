import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { UserProfile as BackendUserProfile } from "./backend";
import BottomNav from "./components/BottomNav";
import NotificationsSheet from "./components/NotificationsSheet";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AdminScreen from "./screens/AdminScreen";
import BorrowScreen from "./screens/BorrowScreen";
import FoodScreen from "./screens/FoodScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RequestsScreen from "./screens/RequestsScreen";
import StudyScreen from "./screens/StudyScreen";

export type Tab =
  | "home"
  | "borrow"
  | "food"
  | "study"
  | "profile"
  | "requests"
  | "admin";

export interface BorrowItem {
  id: bigint;
  name: string;
  category: string;
  status: string;
  ownerName: string;
}

export interface InventoryItem {
  id: bigint;
  name: string;
  category: string;
  description: string;
  status: "Available" | "Borrowed";
}

export interface FoodAlert {
  id: bigint;
  foodName: string;
  source: string;
  quantity: bigint;
  timeLeft: string;
  claimed: boolean;
}

export interface StudyRoom {
  id: bigint;
  roomNo: string;
  location: string;
  capacity: bigint;
  status: string;
}

export interface RequestItem {
  id: bigint;
  title: string;
  category: string;
  deadline: string;
  postedBy: string;
  fulfilled: boolean;
}

export type UserProfile = BackendUserProfile;

export interface ActivityEvent {
  id: string;
  icon: string;
  text: string;
  time: string;
  color: string;
}

// ── Shared mock data as fallback ────────────────────────────────────────────

const INITIAL_BORROW_ITEMS: BorrowItem[] = [
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
    status: "Available",
    ownerName: "Kavya Nair",
  },
];

// ── My Inventory mock data (items owned by the current user) ─────────────────
const INITIAL_MY_INVENTORY: InventoryItem[] = [
  {
    id: 101n,
    name: "Mechanical Keyboard",
    category: "Electronics",
    description: "Cherry MX Blue switches, great for studying",
    status: "Available",
  },
  {
    id: 102n,
    name: "Graphic Novel Collection",
    category: "Books",
    description: "10 volumes, perfect for a creative break",
    status: "Available",
  },
  {
    id: 103n,
    name: "Noise-Cancelling Headphones",
    category: "Electronics",
    description: "Sony WH-1000XM4, perfect for deep focus sessions",
    status: "Borrowed",
  },
];

const INITIAL_FOOD_ALERTS: FoodAlert[] = [
  {
    id: 1n,
    foodName: "Vada Pav & Samosa",
    source: "Cafeteria Block A",
    quantity: 12n,
    timeLeft: "45 mins left",
    claimed: false,
  },
  {
    id: 2n,
    foodName: "Sandwich Platter",
    source: "Faculty Lounge",
    quantity: 6n,
    timeLeft: "20 mins left",
    claimed: false,
  },
];

const INITIAL_STUDY_ROOMS: StudyRoom[] = [
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

const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: 1n,
    title: "Need Calculator for Exam",
    category: "Study Tools",
    deadline: "Today",
    postedBy: "Aditya Kumar",
    fulfilled: false,
  },
  {
    id: 2n,
    title: "Need Projector for Presentation",
    category: "Electronics",
    deadline: "Tomorrow",
    postedBy: "Sneha Rao",
    fulfilled: false,
  },
  {
    id: 3n,
    title: "Need Notes for Math 101",
    category: "Notes",
    deadline: "This Week",
    postedBy: "Rohan Verma",
    fulfilled: false,
  },
];

const INITIAL_ACTIVITY_FEED: ActivityEvent[] = [
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

export default function App() {
  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const { actor, isFetching: isActorFetching } = useActor();

  const [activeTab, setActiveTab] = useState<Tab>("home");

  // ── Admin panel state ────────────────────────────────────────────────────────
  const [showAdminTab, setShowAdminTab] = useState(false);

  // ── Notifications state ──────────────────────────────────────────────────────
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // ── Study rooms booked counter ───────────────────────────────────────────────
  const [studyRoomsBooked, setStudyRoomsBooked] = useState(0);

  // ── Requests fulfilled counter ───────────────────────────────────────────────
  const [requestsFulfilledCount, setRequestsFulfilledCount] = useState(0);

  // ── Onboarding state ─────────────────────────────────────────────────────────
  const [onboardingDone, setOnboardingDone] = useState(() => {
    return !!localStorage.getItem("symbio_profile");
  });
  const [localName, setLocalName] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("symbio_profile") || "{}").name || ""
      );
    } catch {
      return "";
    }
  });
  const [localDept, setLocalDept] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("symbio_profile") || "{}").dept || ""
      );
    } catch {
      return "";
    }
  });

  const handleOnboardingComplete = (name: string, dept: string) => {
    if (name || dept) {
      localStorage.setItem("symbio_profile", JSON.stringify({ name, dept }));
      setLocalName(name);
      setLocalDept(dept);
    }
    setOnboardingDone(true);
  };

  // ── Activity Feed ────────────────────────────────────────────────────────────
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>(
    INITIAL_ACTIVITY_FEED,
  );

  const addActivity = (event: Omit<ActivityEvent, "id" | "time">) => {
    setActivityFeed((prev) => [
      { ...event, id: Date.now().toString(), time: "Just now" },
      ...prev.slice(0, 4),
    ]);
  };

  // ── Green Points & counters ──────────────────────────────────────────────────
  const [greenPoints, setGreenPoints] = useState(320);
  // itemsLendedCount: how many times someone borrowed from My Inventory (lender earned pts)
  const [itemsLendedCount, setItemsLendedCount] = useState(1); // 1 pre-loaded borrowed item
  const [foodClaimedCount, setFoodClaimedCount] = useState(23);
  const [returnCount, setReturnCount] = useState(2);

  // ── Centralised data state ───────────────────────────────────────────────────
  const [borrowItems, setBorrowItems] =
    useState<BorrowItem[]>(INITIAL_BORROW_ITEMS);
  const [myInventory, setMyInventory] =
    useState<InventoryItem[]>(INITIAL_MY_INVENTORY);
  const [foodAlerts, setFoodAlerts] =
    useState<FoodAlert[]>(INITIAL_FOOD_ALERTS);
  const [studyRooms, setStudyRooms] =
    useState<StudyRoom[]>(INITIAL_STUDY_ROOMS);
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_REQUESTS);
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // ── Load initial data from backend when actor is ready ─────────────────────
  useEffect(() => {
    if (!actor || isActorFetching) return;

    let cancelled = false;
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const [items, food, rooms, reqs, lb] = await Promise.all([
          actor.getAllBorrowItems().catch(() => null),
          actor.getAllFoodAlerts().catch(() => null),
          actor.getAllStudyRooms().catch(() => null),
          actor.getAllRequests().catch(() => null),
          actor.getLeaderboard().catch(() => null),
        ]);

        if (cancelled) return;

        if (items) setBorrowItems(items);
        if (food)
          setFoodAlerts(
            food.map((f) => ({
              ...f,
              foodName: (f as { foodName?: string }).foodName ?? f.source,
            })),
          );
        if (rooms) setStudyRooms(rooms);
        if (reqs) setRequests(reqs);
        if (lb) setLeaderboard(lb);
      } catch {
        // Keep mock data on error — no crash
      } finally {
        if (!cancelled) setIsLoadingData(false);
      }
    };

    void loadData();
    return () => {
      cancelled = true;
    };
  }, [actor, isActorFetching]);

  // ── Load user profile when identity present ─────────────────────────────────
  useEffect(() => {
    if (!actor || isActorFetching || !identity) return;

    let cancelled = false;
    const loadProfile = async () => {
      try {
        const profile = await actor.getCallerUserProfile();
        if (cancelled) return;
        if (profile) {
          setUserProfile(profile);
          setGreenPoints(Number(profile.greenPoints));
        }
      } catch {
        // Keep default state if profile fetch fails
      }
    };

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [actor, isActorFetching, identity]);

  // ── Helper to refresh user profile ──────────────────────────────────────────
  const refreshProfile = async () => {
    if (!actor) return;
    try {
      const profile = await actor.getCallerUserProfile();
      if (profile) {
        setUserProfile(profile);
        setGreenPoints(Number(profile.greenPoints));
      }
    } catch {
      // Silent failure
    }
  };

  // ── Action handlers ──────────────────────────────────────────────────────────
  const addPoints = (pts: number) => setGreenPoints((prev) => prev + pts);

  // Borrowing a community item gives the borrower 0 pts (utility only)
  const handleBorrowItem = async (id: bigint) => {
    const itemName = borrowItems.find((i) => i.id === id)?.name ?? "an item";
    setBorrowItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Borrowed" } : item,
      ),
    );
    // No points awarded to borrower
    addActivity({
      icon: "📦",
      text: `Borrowed "${itemName}"`,
      color: "text-emerald-600",
    });

    if (actor) {
      actor.claimBorrowItem(id).catch(() => null);
    }
  };

  // Simulating another user borrowing from My Inventory — lender gets +15 pts
  const handleLenderBorrow = async (id: bigint) => {
    setMyInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Borrowed" } : item,
      ),
    );
    addPoints(15);
    setItemsLendedCount((prev) => prev + 1);
    addActivity({
      icon: "🤝",
      text: "Your item is being borrowed! +15 pts",
      color: "text-emerald-600",
    });

    if (actor) {
      actor
        .awardGreenPoints(15n)
        .then(() => refreshProfile())
        .catch(() => null);
    }
  };

  // Add a new item to My Inventory via FAB
  const handleAddInventoryItem = (item: InventoryItem) => {
    setMyInventory((prev) => [item, ...prev]);
    addActivity({
      icon: "✅",
      text: `Listed "${item.name}" for sharing`,
      color: "text-emerald-600",
    });
  };

  const handleReturnItem = async (id: bigint) => {
    // Optimistic update
    setBorrowItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Available" } : item,
      ),
    );
    setReturnCount((prev) => prev + 1);

    if (actor) {
      actor.returnBorrowItem(id).catch(() => null);
    }
  };

  const handleClaimFood = async (id: bigint) => {
    // Optimistic update
    setFoodAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, claimed: true } : a)),
    );
    addPoints(15);
    setFoodClaimedCount((prev) => prev + 1);
    addActivity({
      icon: "🍱",
      text: "Food rescued! +15 Green Points",
      color: "text-amber-600",
    });

    if (actor) {
      actor.claimFoodAlert(id).catch(() => null);
      actor
        .awardGreenPoints(15n)
        .then(() => refreshProfile())
        .catch(() => null);
    }
  };

  const handleBookRoom = async (id: bigint) => {
    const roomNo = studyRooms.find((r) => r.id === id)?.roomNo ?? "Room";
    // Optimistic update — no points for booking
    setStudyRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Busy" } : r)),
    );
    setStudyRoomsBooked((prev) => prev + 1);
    addActivity({
      icon: "📚",
      text: `${roomNo} booked`,
      color: "text-blue-600",
    });

    if (actor) {
      actor.bookStudyRoom(id).catch(() => null);
    }
  };

  const handleFulfillRequest = async (id: bigint) => {
    // Optimistic update
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, fulfilled: true } : r)),
    );
    addPoints(15);
    setRequestsFulfilledCount((prev) => prev + 1);
    addActivity({
      icon: "🙌",
      text: "Request fulfilled! +15 Green Points",
      color: "text-violet-600",
    });

    if (actor) {
      actor.fulfillRequest(id).catch(() => null);
      actor
        .awardGreenPoints(15n)
        .then(() => refreshProfile())
        .catch(() => null);
    }
  };

  const handleAddFoodAlert = (alert: FoodAlert) => {
    setFoodAlerts((prev) => [alert, ...prev]);
    addPoints(5);
    addActivity({
      icon: "🍽️",
      text: `Posted "${alert.foodName}" for rescue! +5 pts`,
      color: "text-amber-600",
    });

    if (actor) {
      actor
        .awardGreenPoints(5n)
        .then(() => refreshProfile())
        .catch(() => null);
    }
  };

  const handleAddRequest = async (req: RequestItem) => {
    // Optimistic update
    setRequests((prev) => [req, ...prev]);

    if (actor) {
      actor
        .addRequest(req.title, req.category, req.deadline, req.postedBy)
        .catch(() => null);
    }
  };

  // ── Admin handlers ────────────────────────────────────────────────────────────
  const handleAddBorrowItemAdmin = (item: BorrowItem) => {
    setBorrowItems((prev) => [item, ...prev]);
    addActivity({
      icon: "🏫",
      text: `Admin added "${item.name}" to campus pool`,
      color: "text-slate-600",
    });
  };

  const handleToggleRoomAdmin = (id: bigint) => {
    setStudyRooms((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Available" ? "Busy" : "Available" }
          : r,
      ),
    );
  };

  const handleOpenAdmin = () => {
    setShowAdminTab(true);
    setActiveTab("admin");
    toast.success("Faculty Admin Panel unlocked 🔑");
  };

  const handleResetDemo = () => {
    setGreenPoints(320);
    setItemsLendedCount(1);
    setFoodClaimedCount(23);
    setReturnCount(2);
    setStudyRoomsBooked(0);
    setRequestsFulfilledCount(0);
    setBorrowItems(INITIAL_BORROW_ITEMS);
    setMyInventory(INITIAL_MY_INVENTORY);
    setFoodAlerts(INITIAL_FOOD_ALERTS);
    setStudyRooms(INITIAL_STUDY_ROOMS);
    setRequests(INITIAL_REQUESTS);
    setActivityFeed(INITIAL_ACTIVITY_FEED);
    setShowAdminTab(false);
  };

  const handleLogout = () => {
    clear();
    // Reset to defaults on logout
    setUserProfile(null);
    setGreenPoints(320);
    setItemsLendedCount(1);
    setFoodClaimedCount(23);
    setReturnCount(2);
    setStudyRoomsBooked(0);
    setRequestsFulfilledCount(0);
    setBorrowItems(INITIAL_BORROW_ITEMS);
    setMyInventory(INITIAL_MY_INVENTORY);
    setFoodAlerts(INITIAL_FOOD_ALERTS);
    setStudyRooms(INITIAL_STUDY_ROOMS);
    setRequests(INITIAL_REQUESTS);
    setLeaderboard([]);
    setActivityFeed(INITIAL_ACTIVITY_FEED);
    setShowAdminTab(false);
    // Reset onboarding so the user can re-enter their name on next login
    localStorage.removeItem("symbio_profile");
    setOnboardingDone(false);
    setLocalName("");
    setLocalDept("");
  };

  // ── Show login screen when not authenticated ─────────────────────────────────
  if (!identity) {
    return (
      <>
        <div className="page-bg min-h-screen w-full">
          <div className="app-shell">
            <LoginScreen
              onLogin={login}
              isInitializing={isInitializing}
              isLoggingIn={isLoggingIn}
            />
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // ── Show onboarding if not done yet ──────────────────────────────────────────
  if (!onboardingDone) {
    return (
      <>
        <div className="page-bg min-h-screen w-full">
          <div className="app-shell">
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </>
    );
  }

  const pendingRequests = requests.filter((r) => !r.fulfilled).length;

  return (
    <div className="page-bg min-h-screen w-full">
      <div className="app-shell">
        <main
          key={activeTab}
          className="content-area min-h-dvh overflow-y-auto"
        >
          {/* Loading overlay for initial data fetch */}
          {isLoadingData && (
            <div
              data-ocid="app.loading_state"
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-2xl green-gradient flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl">🌱</span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Loading Symbio…
              </p>
              <p className="text-xs text-muted-foreground">
                Fetching campus data
              </p>
            </div>
          )}

          {activeTab === "home" && (
            <HomeScreen
              greenPoints={greenPoints}
              onNavigate={setActiveTab}
              itemsBorrowedCount={itemsLendedCount}
              foodClaimedCount={foodClaimedCount}
              userProfile={userProfile}
              onAddInventoryItem={handleAddInventoryItem}
              nextInventoryId={BigInt(200 + myInventory.length)}
              activityFeed={activityFeed}
              localName={localName}
              onOpenNotifications={() => setNotificationsOpen(true)}
              notificationsCount={activityFeed.length}
            />
          )}
          {activeTab === "borrow" && (
            <BorrowScreen
              borrowItems={borrowItems}
              onBorrowItem={handleBorrowItem}
              myInventory={myInventory}
              onLenderBorrow={handleLenderBorrow}
            />
          )}
          {activeTab === "food" && (
            <FoodScreen
              foodAlerts={foodAlerts}
              onClaimFood={handleClaimFood}
              onAddFoodAlert={handleAddFoodAlert}
              nextFoodId={BigInt(100 + foodAlerts.length)}
            />
          )}
          {activeTab === "study" && (
            <StudyScreen studyRooms={studyRooms} onBookRoom={handleBookRoom} />
          )}
          {activeTab === "profile" && (
            <ProfileScreen
              greenPoints={greenPoints}
              borrowItems={borrowItems}
              onReturnItem={handleReturnItem}
              returnCount={returnCount}
              itemsLendedCount={itemsLendedCount}
              foodClaimedCount={foodClaimedCount}
              myInventory={myInventory}
              userProfile={userProfile}
              leaderboard={leaderboard}
              onLogout={handleLogout}
              onResetDemo={handleResetDemo}
              onOpenAdmin={handleOpenAdmin}
              localName={localName}
              localDept={localDept}
              requestsFulfilled={requestsFulfilledCount}
              studyRoomsBooked={studyRoomsBooked}
            />
          )}
          {activeTab === "requests" && (
            <RequestsScreen
              requests={requests}
              onFulfillRequest={handleFulfillRequest}
              onAddRequest={handleAddRequest}
              userProfile={userProfile}
            />
          )}
          {activeTab === "admin" && (
            <AdminScreen
              borrowItems={borrowItems}
              foodAlerts={foodAlerts}
              studyRooms={studyRooms}
              requests={requests}
              onAddBorrowItem={handleAddBorrowItemAdmin}
              onAddFoodAlert={handleAddFoodAlert}
              onToggleRoom={handleToggleRoomAdmin}
              nextBorrowId={BigInt(500 + borrowItems.length)}
              nextFoodId={BigInt(100 + foodAlerts.length)}
            />
          )}
        </main>
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          requestsNewCount={pendingRequests}
          showAdminTab={showAdminTab}
        />
        <NotificationsSheet
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          feed={activityFeed}
        />
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}
