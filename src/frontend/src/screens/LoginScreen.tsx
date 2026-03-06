import { Leaf, Loader2, LogIn, Recycle, Share2, TreePine } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
  isInitializing: boolean;
  isLoggingIn: boolean;
}

const FEATURES = [
  {
    icon: Recycle,
    title: "Smart Borrow",
    desc: "Share & borrow campus items",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Share2,
    title: "Food Rescue",
    desc: "Reduce waste, feed friends",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: TreePine,
    title: "Green Points",
    desc: "Earn rewards for every action",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
];

export default function LoginScreen({
  onLogin,
  isInitializing,
  isLoggingIn,
}: LoginScreenProps) {
  const isLoading = isInitializing || isLoggingIn;

  if (isInitializing) {
    return (
      <div
        data-ocid="login.loading_state"
        className="min-h-dvh flex flex-col items-center justify-center bg-background"
      >
        <div className="w-16 h-16 rounded-2xl green-gradient flex items-center justify-center mb-4 shadow-lg">
          <Leaf size={28} className="text-white" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Loading Symbio…
        </p>
        <Loader2 size={16} className="animate-spin text-primary mt-3" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background overflow-hidden">
      {/* Top decorative band */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Background circles */}
        <div
          className="absolute -top-24 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.55 0.15 155 / 0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.12 65 / 0.10) 0%, transparent 70%)",
          }}
        />

        {/* Floating decorative leaves */}
        <div
          className="absolute top-20 left-8 text-2xl pointer-events-none select-none leaf-float-1"
          aria-hidden="true"
        >
          🌿
        </div>
        <div
          className="absolute top-32 right-10 text-xl pointer-events-none select-none leaf-float-2"
          aria-hidden="true"
        >
          🍃
        </div>
        <div
          className="absolute top-52 left-16 text-lg pointer-events-none select-none leaf-float-3"
          aria-hidden="true"
        >
          🌱
        </div>

        {/* Logo area */}
        <div className="relative z-10 flex flex-col items-center mb-10">
          <div className="score-card-gradient grain-overlay w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl mb-5">
            <Leaf size={36} className="text-white" />
          </div>

          <h1 className="text-4xl font-bold font-display text-foreground tracking-tight mb-1">
            Symbio
          </h1>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-10 bg-border" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              NMIMS University
            </p>
            <div className="h-px w-10 bg-border" />
          </div>
          <p className="text-center text-sm text-muted-foreground max-w-xs leading-relaxed">
            Smart resource-sharing for a{" "}
            <span className="font-semibold text-emerald-600">
              sustainable campus
            </span>
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 w-full max-w-xs space-y-2.5 mb-10">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="flex items-center gap-3.5 bg-card rounded-2xl border border-border px-4 py-3"
            >
              <div
                className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}
              >
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Login CTA */}
        <div className="relative z-10 w-full max-w-xs space-y-3">
          <button
            type="button"
            data-ocid="login.primary_button"
            onClick={onLogin}
            disabled={isLoading}
            className="w-full green-gradient text-white font-bold text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <LogIn size={18} />
                Login with Internet Identity
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-muted-foreground px-2">
            Secure, passwordless login — no email or password needed.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
