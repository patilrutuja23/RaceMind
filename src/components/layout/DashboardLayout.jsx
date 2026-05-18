import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SettingsModal from "./SettingsModal";
import RaceDashboard from "../../pages/RaceDashboard";

export default function DashboardLayout() {
  const [activeSection, setActiveSection] = useState("overview");
  const [settingsOpen, setSettingsOpen]   = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar
        active={activeSection}
        onNavigate={setActiveSection}
        onSettings={() => setSettingsOpen(true)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onSettings={() => setSettingsOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <RaceDashboard onSectionVisible={setActiveSection} />
        </main>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
