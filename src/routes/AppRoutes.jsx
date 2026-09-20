import { Route, Routes } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import EventCoordinatorLayout from "../layouts/EventCoordinatorLayout";
import CashierLayout from "../layouts/CashierLayout";
import InventoryManagerLayout from "../layouts/InventoryManagerLayout";
import HRManagerLayout from "../layouts/HRManagerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public Pages
import HomePage from "../pages/public/HomePage";
import DiningPage from "../pages/public/DiningPage";
import MenuPage from "../pages/public/MenuPage";
import EventsPage from "../pages/public/EventsPage";
import AboutPage from "../pages/public/AboutPage";

// Authentication
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Customer
import CustomerDashboardPage from "../pages/customer/CustomerDashboardPage";
import ReservationsPage from "../pages/customer/ReservationsPage";

// Customer Reservations
import NewTableReservationPage from "../pages/reservation/NewTableReservationPage";
import NewVenueBookingPage from "../pages/reservation/NewVenueBookingPage";
import ReservationHistoryPage from "../pages/reservation/ReservationHistoryPage";

// Customer Menu
import CustomerMenuPage from "../pages/menu/CustomerMenuPage";
import CustomerBrowseMenuPage from "../pages/menu/CustomerBrowseMenuPage";
import CustomizeCateringMenuPage from "../pages/menu/CustomizeCateringMenuPage";
import FoodRecommendationsPage from "../pages/menu/FoodRecommendationsPage";
import SavedPackagesPage from "../pages/menu/SavedPackagesPage";

// Customer Events
import CustomerEventsPage from "../pages/events/CustomerEventsPage";
import EventDetailsPage from "../pages/events/EventDetailsPage";
import EventFeedbackPage from "../pages/events/EventFeedbackPage";

// Customer Billing
import CustomerBillingPage from "../pages/billing/CustomerBillingPage";
import CustomerInvoicesPage from "../pages/billing/CustomerInvoicesPage";
import CustomerInvoiceDetailsPage from "../pages/billing/CustomerInvoiceDetailsPage";
import PaymentSlipUploadPage from "../pages/billing/PaymentSlipUploadPage";
import CustomerPaymentHistoryPage from "../pages/billing/CustomerPaymentHistoryPage";

// Event Coordinator
import EventCoordinatorDashboardPage from "../pages/events/EventCoordinatorDashboardPage";
import ManageEventsPage from "../pages/events/ManageEventsPage";
import CoordinatorEventDetailsPage from "../pages/events/CoordinatorEventDetailsPage";
import EventTimelinesPage from "../pages/events/EventTimelinesPage";
import VendorManagementPage from "../pages/events/VendorManagementPage";
import FeedbackInsightsPage from "../pages/events/FeedbackInsightsPage";

// Cashier
import CashierDashboardPage from "../pages/billing/CashierDashboardPage";
import CashierInvoicesPage from "../pages/billing/CashierInvoicesPage";
import PaymentVerificationQueuePage from "../pages/billing/PaymentVerificationQueuePage";
import PaymentVerificationDetailsPage from "../pages/billing/PaymentVerificationDetailsPage";
import CashierPaymentHistoryPage from "../pages/billing/CashierPaymentHistoryPage";

// Inventory
import InventoryDashboardPage from "../pages/inventory/InventoryDashboardPage";
import InventoryItemsPage from "../pages/inventory/InventoryItemsPage";
import InventoryItemDetailsPage from "../pages/inventory/InventoryItemDetailsPage";
import StockTransactionsPage from "../pages/inventory/StockTransactionsPage";
import LowStockPage from "../pages/inventory/LowStockPage";
import WasteRecordsPage from "../pages/inventory/WasteRecordsPage";
import ReorderRecommendationsPage from "../pages/inventory/ReorderRecommendationsPage";

// Staff / HR
import HRDashboardPage from "../pages/staff/HRDashboardPage";
import StaffManagementPage from "../pages/staff/StaffManagementPage";
import StaffDetailsPage from "../pages/staff/StaffDetailsPage";
import ShiftManagementPage from "../pages/staff/ShiftManagementPage";
import StaffAssignmentsPage from "../pages/staff/StaffAssignmentsPage";
import AttendanceManagementPage from "../pages/staff/AttendanceManagementPage";
import LeaveRequestsPage from "../pages/staff/LeaveRequestsPage";
import StaffAllocationPage from "../pages/staff/StaffAllocationPage";

// Admin
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import RolesAccessPage from "../pages/admin/RolesAccessPage";
import AdminReportsPage from "../pages/admin/AdminReportsPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";

// Restaurant Manager
import RestaurantManagerLayout from "../layouts/RestaurantManagerLayout";
import RestaurantManagerDashboardPage from "../pages/reservation/RestaurantManagerDashboardPage";
import ManageReservationsPage from "../pages/reservation/ManageReservationsPage";
import TableManagementPage from "../pages/reservation/TableManagementPage";
import VenueManagementPage from "../pages/reservation/VenueManagementPage";
import PricingRulesPage from "../pages/reservation/PricingRulesPage";

// Chef
import ChefLayout from "../layouts/ChefLayout";
import ChefDashboardPage from "../pages/menu/ChefDashboardPage";
import MenuItemManagementPage from "../pages/menu/MenuItemManagementPage";
import MenuCategoriesPage from "../pages/menu/MenuCategoriesPage";
import DietaryAllergenPage from "../pages/menu/DietaryAllergenPage";


export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="dining" element={<DiningPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* ================= CUSTOMER ================= */}
      <Route path="customer" element={<CustomerLayout />}>
        <Route index element={<CustomerDashboardPage />} />

        {/* Reservations */}
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

        {/* Menu */}
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

        {/* Events */}
        <Route path="events" element={<CustomerEventsPage />} />
        <Route
          path="events/:eventId"
          element={<EventDetailsPage />}
        />
        <Route
          path="events/:eventId/feedback"
          element={<EventFeedbackPage />}
        />

        {/* Billing */}
        <Route path="billing" element={<CustomerBillingPage />} />
        <Route
          path="billing/invoices"
          element={<CustomerInvoicesPage />}
        />
        <Route
          path="billing/invoices/:invoiceId"
          element={<CustomerInvoiceDetailsPage />}
        />
        <Route
          path="billing/payment-slip"
          element={<PaymentSlipUploadPage />}
        />
        <Route
          path="billing/history"
          element={<CustomerPaymentHistoryPage />}
        />
      </Route>


      {/* ================= RESTAURANT MANAGER ================= */}
      <Route
        path="restaurant-manager"
        element={<RestaurantManagerLayout />}
      >
        <Route
          index
          element={<RestaurantManagerDashboardPage />}
        />

        <Route
          path="reservations"
          element={<ManageReservationsPage />}
        />

        <Route
          path="tables"
          element={<TableManagementPage />}
        />

        <Route
          path="venues"
          element={<VenueManagementPage />}
        />

         <Route
          path="pricing"
          element={<PricingRulesPage />}
        />
      </Route>

      {/* ================= CHEF ================= */}
      <Route path="chef" element={<ChefLayout />}>
        <Route index element={<ChefDashboardPage />} />

        <Route
          path="menu-items"
          element={<MenuItemManagementPage />}
        />

        <Route
          path="categories"
          element={<MenuCategoriesPage />}
        />

        <Route
          path="dietary"
          element={<DietaryAllergenPage />}
        />
      </Route>

      {/* ================= EVENT COORDINATOR ================= */}
      <Route
        path="event-coordinator"
        element={<EventCoordinatorLayout />}
      >
        <Route index element={<EventCoordinatorDashboardPage />} />
        <Route path="events" element={<ManageEventsPage />} />
        <Route
          path="events/:eventId"
          element={<CoordinatorEventDetailsPage />}
        />
        <Route path="timelines" element={<EventTimelinesPage />} />
        <Route path="vendors" element={<VendorManagementPage />} />
        <Route path="feedback" element={<FeedbackInsightsPage />} />
      </Route>

      {/* ================= CASHIER ================= */}
      <Route path="cashier" element={<CashierLayout />}>
        <Route index element={<CashierDashboardPage />} />
        <Route path="invoices" element={<CashierInvoicesPage />} />
        <Route
          path="payments"
          element={<PaymentVerificationQueuePage />}
        />
        <Route
          path="payments/:paymentId"
          element={<PaymentVerificationDetailsPage />}
        />
        <Route
          path="history"
          element={<CashierPaymentHistoryPage />}
        />
      </Route>

      {/* ================= INVENTORY ================= */}
      <Route
        path="inventory"
        element={<InventoryManagerLayout />}
      >
        <Route index element={<InventoryDashboardPage />} />
        <Route path="items" element={<InventoryItemsPage />} />
        <Route
          path="items/:itemId"
          element={<InventoryItemDetailsPage />}
        />
        <Route
          path="stock"
          element={<StockTransactionsPage />}
        />
        <Route path="low-stock" element={<LowStockPage />} />
        <Route path="waste" element={<WasteRecordsPage />} />
        <Route
          path="recommendations"
          element={<ReorderRecommendationsPage />}
        />
      </Route>

      {/* ================= HR ================= */}
      <Route path="hr" element={<HRManagerLayout />}>
        <Route index element={<HRDashboardPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route
          path="staff/:staffId"
          element={<StaffDetailsPage />}
        />
        <Route path="shifts" element={<ShiftManagementPage />} />
        <Route
          path="assignments"
          element={<StaffAssignmentsPage />}
        />
        <Route
          path="attendance"
          element={<AttendanceManagementPage />}
        />
        <Route path="leave" element={<LeaveRequestsPage />} />
        <Route
          path="allocation"
          element={<StaffAllocationPage />}
        />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="roles" element={<RolesAccessPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}