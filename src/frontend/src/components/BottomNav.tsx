import {
  BookOpen,
  HandHelping,
  Home,
  Package,
  Shield,
  User,
  Utensils,
} from "lucide-react";
import type React from "react";
import type { Tab } from "../App";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  requestsNewCount?: number;
  showAdminTab?: boolean;
}

const BASE_NAV_ITEMS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "borrow", label: "Borrow", Icon: Package },
  { id: "food", label: "Food", Icon: Utensils },
  { id: "study", label: "Study", Icon: BookOpen },
  { id: "profile", label: "Profile", Icon: User },
  { id: "requests", label: "Requests", Icon: HandHelping },
];

const ADMIN_NAV_ITEM: { id: Tab; label: string; Icon: React.ElementType } = {
  id: "admin",
  label: "Admin",
  Icon: Shield,
};

export default function BottomNav({
  activeTab,
  onTabChange,
  requestsNewCount = 0,
  showAdminTab = false,
}: BottomNavProps) {
  const navItems = showAdminTab
    ? [...BASE_NAV_ITEMS, ADMIN_NAV_ITEM]
    : BASE_NAV_ITEMS;

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card border-t border-border z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          const showBadge = id === "requests" && requestsNewCount > 0;
          const isAdmin = id === "admin";

          return (
            <button
              type="button"
              key={id}
              data-ocid={`nav.${id}.tab`}
              onClick={() => onTabChange(id)}
              className={`nav-item relative ${isActive ? "active" : ""} ${isAdmin ? "opacity-70" : ""}`}
            >
              <div className="relative">
                <Icon
                  size={isActive ? 21 : 19}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-all duration-200"
                />
                {showBadge && (
                  <span data-ocid="nav.requests.badge" className="notif-dot" />
                )}
                {isAdmin && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {label}
              </span>
              {isActive && (
                <span
                  className="absolute inset-x-1 top-1 bottom-1 rounded-full -z-10"
                  style={{ background: "oklch(var(--primary) / 0.13)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
