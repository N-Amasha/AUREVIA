import { Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import HomePage from "../pages/public/HomePage";
import DiningPage from "../pages/public/DiningPage";
import MenuPage from "../pages/public/MenuPage";
import EventsPage from "../pages/public/EventsPage";
import AboutPage from "../pages/public/AboutPage";

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
    </Routes>
  );
}