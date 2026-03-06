import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bell, X } from "lucide-react";
import type { ActivityEvent } from "../App";

interface NotificationsSheetProps {
  open: boolean;
  onClose: () => void;
  feed: ActivityEvent[];
}

export default function NotificationsSheet({
  open,
  onClose,
  feed,
}: NotificationsSheetProps) {
  const unreadCount = Math.min(feed.length, 9);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        data-ocid="notifications.sheet"
        side="right"
        className="w-full max-w-[340px] p-0 flex flex-col"
      >
        <SheetHeader className="px-5 py-4 border-b border-border flex-row items-center gap-3">
          <div className="w-8 h-8 rounded-xl green-gradient flex items-center justify-center shrink-0">
            <Bell size={15} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <SheetTitle className="font-display text-base font-bold leading-none">
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount} new
              </p>
            )}
          </div>
          <button
            type="button"
            data-ocid="notifications.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors shrink-0"
            aria-label="Close notifications"
          >
            <X size={14} className="text-foreground/70" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {feed.length === 0 ? (
            <div
              data-ocid="notifications.empty_state"
              className="flex flex-col items-center justify-center h-full py-20 px-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Bell size={24} className="text-muted-foreground opacity-40" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                No activity yet
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Start borrowing items, rescuing food, or booking study rooms to
                see your campus activity here.
              </p>
            </div>
          ) : (
            <div className="py-2">
              {feed.map((item, index) => (
                <div
                  key={item.id}
                  data-ocid={`notifications.item.${index + 1}`}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors"
                >
                  {/* Emoji icon */}
                  <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 text-base">
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <p
                      className={`text-sm font-medium leading-snug ${item.color}`}
                    >
                      {item.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.time}
                    </p>
                  </div>

                  {/* Unread dot — show for recent items (first 3) */}
                  {index < 3 && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {feed.length > 0 && (
          <div className="px-5 py-3 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              Showing recent campus activity
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
