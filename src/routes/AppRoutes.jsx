import { Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import HomePage from "../pages/public/HomePage";
import DiningPage from "../pages/public/DiningPage";
import MenuPage from "../pages/public/MenuPage";
import EventsPage from "../pages/public/EventsPage";
import AboutPage from "../pages/public/AboutPage";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import CustomerLayout from "../layouts/CustomerLayout";
import CustomerDashboardPage from "../pages/customer/CustomerDashboardPage";
import ReservationsPage from "../pages/customer/ReservationsPage";
import NewTableReservationPage from "../pages/reservation/NewTableReservationPage";
import NewVenueBookingPage from "../pages/reservation/NewVenueBookingPage";
import ReservationHistoryPage from "../pages/reservation/ReservationHistoryPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />

        <Route
          path="dining"
          element={<DiningPage />}
        />

        <Route
          path="menu"
          element={<MenuPage />}
        />

        <Route
          path="events"
          element={<EventsPage />}
        />

        <Route
          path="about"
          element={<AboutPage />}
        />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Customer Routes */}
    <Route path="customer" element={<CustomerLayout />}>
      <Route index element={<CustomerDashboardPage />} />
    </Route>
    <Route path="customer" element={<CustomerLayout />}>
      <Route index element={<CustomerDashboardPage />} />
      <Route path="reservations" element={<ReservationsPage />} />
    </Route>
    <Route path="customer" element={<CustomerLayout />}>
    <Route index element={<CustomerDashboardPage />} />

      <Route path="reservations" element={<ReservationsPage />} />

      <Route
        path="reservations/table/new"
        element={<NewTableReservationPage />}
      />
    </Route>

    <Route path="customer" element={<CustomerLayout />}>
  <Route index element={<CustomerDashboardPage />} />
  <Route path="reservations" element={<ReservationsPage />} />

  <Route
      path="reservations/table/new"
      element={<NewTableReservationPage />}
    />

    <Route
      path="reservations/venue/new"
      element={<NewVenueBookingPage />}
    />

    <Route
      path="reservations/history"
      element={<ReservationHistoryPage />}
    />
  </Route>
    

    </Routes>
  );
}