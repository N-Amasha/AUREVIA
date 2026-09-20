import { useState } from "react";
import { CalendarDays } from "lucide-react";

import Button from "./components/ui/Button";
import Loading from "./components/ui/Loading";
import EmptyState from "./components/ui/EmptyState";

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-500">
          Aurevia Design System
        </p>

        <h1 className="mt-3 text-4xl font-bold text-primary-900">
          Data States
        </h1>

        <p className="mt-2 text-stone-500">
          Reusable loading and empty states for Aurevia modules.
        </p>

        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">
            Loading State
          </h2>

          {loading ? (
            <Loading message="Loading reservations..." />
          ) : (
            <div className="py-8 text-center">
              <p className="mb-4 text-sm text-stone-500">
                Click below to preview the loading state.
              </p>

              <Button onClick={() => setLoading(true)}>
                Show Loading
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <EmptyState
            icon={CalendarDays}
            title="No Reservations Yet"
            message="There are currently no table or venue reservations to display."
            action={
              <Button>
                Create Reservation
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default App;