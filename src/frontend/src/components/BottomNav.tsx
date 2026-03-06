import {
  BookOpen,
  HandHelping,
  Home,
  Package,
  User,
  Utensils,
} from "lucide-react";
import type React from "react";
import type { Tab } from "../App";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "borrow", label: "Borrow", Icon: Package },
  { id: "food", label: "Food", Icon: Utensils },
  { id: "study", label: "Study", Icon: BookOpen },
  { id: "profile", label: "Profile", Icon: User },
  { id: "requests", label: "Requests", Icon: HandHelping },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card border-t border-border z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              type="button"
              key={id}
              data-ocid={`nav.${id}.tab`}
              onClick={() => onTabChange(id)}
              className={`nav-item relative ${isActive ? "active" : ""}`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                className="transition-transform duration-200"
                style={{ transform: isActive ? "scale(1.1)" : "scale(1)" }}
              />
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
                  style={{ background: "oklch(var(--primary) / 0.1)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
