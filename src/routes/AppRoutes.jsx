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
import CustomerMenuPage from "../pages/menu/CustomerMenuPage";
import CustomerBrowseMenuPage from "../pages/menu/CustomerBrowseMenuPage";
import CustomizeCateringMenuPage from "../pages/menu/CustomizeCateringMenuPage";
import FoodRecommendationsPage from "../pages/menu/FoodRecommendationsPage";
import SavedPackagesPage from "../pages/menu/SavedPackagesPage";

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

    <Route path="menu" element={<CustomerMenuPage />} />
    <Route
      path="menu/browse"
      element={<CustomerBrowseMenuPage />}
    />

    <Route
      path="menu/customize"
      element={<CustomizeCateringMenuPage />}
    />

    <Route
      path="menu/recommendations"
      element={<FoodRecommendationsPage />}
    />

    <Route
      path="menu/saved"
      element={<SavedPackagesPage />}
    />

  </Route>


    

    </Routes>
  );
}