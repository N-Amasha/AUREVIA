import { useState } from "react";
import { CalendarDays } from "lucide-react";

import Button from "./components/ui/Button";
import Card from "./components/ui/Card";
import Badge from "./components/ui/Badge";
import Modal from "./components/ui/Modal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-500">
          Aurevia Design System
        </p>

        <h1 className="mt-3 text-4xl font-bold text-primary-900">
          Modal Component
        </h1>

        <Card className="mt-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">
                Upcoming Reservation
              </p>

              <h2 className="mt-1 text-xl font-semibold text-stone-900">
                Evening Table Reservation
              </h2>
            </div>

            <Badge variant="success">
              Confirmed
            </Badge>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-stone-600">
            <CalendarDays className="h-4 w-4 text-primary-700" />
            <span>24 September 2026 · 7:00 PM</span>
          </div>

          <div className="mt-6">
            <Button
              variant="danger"
              onClick={() => setIsModalOpen(true)}
            >
              Cancel Reservation
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cancel Reservation?"
        description="Please confirm before continuing."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Keep Reservation
            </Button>

            <Button
              variant="danger"
              onClick={() => setIsModalOpen(false)}
            >
              Yes, Cancel
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-stone-600">
          Are you sure you want to cancel this reservation? This
          demonstration only shows the frontend confirmation flow.
        </p>
      </Modal>
    </div>
  );
}

export default App;