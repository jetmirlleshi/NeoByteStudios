import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <CommandPalette />
      <OnboardingWizard />
      <OnboardingChecklist />
    </div>
  );
}
