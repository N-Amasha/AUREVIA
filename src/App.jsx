import { Eye } from "lucide-react";

import DataTable from "./components/ui/DataTable";
import Badge from "./components/ui/Badge";
import Button from "./components/ui/Button";

function App() {
  const reservations = [
    {
      id: "RES-001",
      customer: "Amaya Perera",
      type: "Table",
      date: "24 Sep 2026",
      guests: 4,
      status: "Confirmed",
    },
    {
      id: "RES-002",
      customer: "Kasun Silva",
      type: "Event Venue",
      date: "26 Sep 2026",
      guests: 80,
      status: "Pending",
    },
    {
      id: "RES-003",
      customer: "Nimali Fernando",
      type: "Table",
      date: "28 Sep 2026",
      guests: 2,
      status: "Cancelled",
    },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "Confirmed":
        return "success";

      case "Pending":
        return "warning";

      case "Cancelled":
        return "danger";

      default:
        return "neutral";
    }
  };

  const columns = [
    {
      key: "id",
      label: "Reservation ID",
    },
    {
      key: "customer",
      label: "Customer",
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "guests",
      label: "Guests",
    },
    {
      key: "status",
      label: "Status",

      render: (value) => (
        <Badge variant={getStatusVariant(value)}>
          {value}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",

      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            console.log("View reservation:", row.id)
          }
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-500">
          Aurevia Management
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary-900">
              Reservations
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage table and event venue reservations.
            </p>
          </div>

          <Button>
            New Reservation
          </Button>
        </div>

        <div className="mt-10">
          <DataTable
            columns={columns}
            data={reservations}
            emptyMessage="No reservations available."
          />
        </div>

        <p className="mt-4 text-xs text-stone-400">
          Demo data for frontend component testing only.
        </p>
      </div>
    </div>
  );
}

export default App;