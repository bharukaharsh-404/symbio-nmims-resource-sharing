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
import { Leaf, Loader2 } from "lucide-react";
import { useState } from "react";

interface OnboardingScreenProps {
  onComplete: (name: string, dept: string) => void;
}

const DEPARTMENTS = [
  "MBA 1st Year",
  "MBA 2nd Year",
  "Engineering 1st Year",
  "Engineering 2nd Year",
  "Engineering 3rd Year",
  "Engineering 4th Year",
  "BBA 1st Year",
  "BBA 2nd Year",
  "BBA 3rd Year",
  "BComm",
  "Faculty",
  "Other",
];

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    onComplete(name.trim(), dept);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.55 0.15 155) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.12 65) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl green-gradient grain-overlay flex items-center justify-center mb-4 shadow-lg relative overflow-hidden">
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white/10" />
            <Leaf size={28} className="text-white relative z-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">
            Welcome to Symbio
          </h1>
          <p className="text-muted-foreground text-sm mt-2 text-center">
            NMIMS Smart Resource Sharing
          </p>
        </div>

        {/* Onboarding Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-foreground font-display">
              Tell us about yourself
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Personalize your Symbio experience
            </p>
          </div>

          {/* Name Input */}
          <div className="space-y-1.5">
            <Label htmlFor="onboarding-name" className="text-sm font-medium">
              Your full name
            </Label>
            <Input
              id="onboarding-name"
              data-ocid="onboarding.name.input"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="rounded-xl"
              autoFocus
            />
          </div>

          {/* Department Select */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Department</Label>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger
                data-ocid="onboarding.dept.select"
                className="rounded-xl"
              >
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Get Started */}
          <Button
            data-ocid="onboarding.submit_button"
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className="w-full rounded-xl green-gradient text-white border-0 hover:opacity-90 font-semibold"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : null}
            {isSubmitting ? "Getting ready…" : "Get Started 🌱"}
          </Button>

          {/* Skip */}
          <button
            type="button"
            data-ocid="onboarding.skip_button"
            onClick={() => onComplete("", "")}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Skip for now
          </button>
        </div>

        {/* Eco message */}
        <div className="mt-4 flex items-center gap-2 justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="text-[11px] text-muted-foreground">
            Share items · Rescue food · Book spaces
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      </div>
    </div>
  );
}
