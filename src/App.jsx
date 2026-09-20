import { useState } from "react";

import Tabs from "./components/ui/Tabs";
import Card from "./components/ui/Card";

function App() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    {
      label: "All Reservations",
      value: "all",
      count: 12,
    },
    {
      label: "Pending",
      value: "pending",
      count: 4,
    },
    {
      label: "Confirmed",
      value: "confirmed",
      count: 6,
    },
    {
      label: "Cancelled",
      value: "cancelled",
      count: 2,
    },
  ];

  const content = {
    all: "Showing all reservations.",
    pending: "Showing reservations waiting for confirmation.",
    confirmed: "Showing confirmed reservations.",
    cancelled: "Showing cancelled reservations.",
  };

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-500">
          Aurevia Management
        </p>

        <h1 className="mt-3 text-4xl font-bold text-primary-900">
          Reservation Management
        </h1>

        <p className="mt-2 text-stone-500">
          Filter reservations according to their current status.
        </p>

        <Card className="mt-10" padding="none">
          <div className="px-6 pt-4">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          <div className="p-6">
            <p className="text-sm text-stone-600">
              {content[activeTab]}
            </p>
          </div>
        </Card>

        <p className="mt-4 text-xs text-stone-400">
          Active tab: {activeTab}
        </p>
      </div>
    </div>
  );
}

export default App;