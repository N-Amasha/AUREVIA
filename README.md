# AUREVIA

**Restaurant & Event Management System**

AUREVIA is a web-based restaurant and event management system designed to connect customer-facing dining and event experiences with the operational activities required to manage reservations, menus, events, billing, inventory, and staff.

The project follows a modular full-stack architecture. The current repository contains a developed React frontend, while the Java Spring Boot backend and MySQL integration are planned as the next major development phase.

---

## Project Overview

Restaurant and event operations involve multiple connected processes. A reservation may affect billing, menu planning, inventory requirements, event coordination, and staff allocation.

AUREVIA brings these processes together within one system while providing dedicated interfaces for customers and authorized staff roles.

The system is organized around six core functional areas.

### 1. Table & Event Venue Reservation

- Table reservation
- Event venue booking
- Availability checking
- Reservation history
- Reservation status tracking
- Restaurant table management
- Venue management
- Pricing-rule management
- Reservation management

### 2. Menu Customization & Recommendation

- Public menu browsing
- Menu item management
- Menu categories
- Catering menu customization
- Dietary and allergen information
- Saved catering packages
- Customer preference support
- Explainable food recommendation filtering

### 3. Event Coordination & Customer Feedback

- Customer event management
- Event details
- Event coordination
- Event timeline tracking
- Vendor management
- Customer feedback
- Feedback insights
- Sentiment-analysis integration support

### 4. Billing & Payment Management

- Customer invoice viewing
- Invoice details
- Bank payment slip upload
- Payment history
- Cashier invoice management
- Payment verification queue
- Manual payment approval/rejection workflow
- Payment status tracking

### 5. Smart Inventory & Food Waste Management

- Inventory dashboard
- Inventory item management
- Item details
- Stock management
- Low-stock monitoring
- Inventory usage
- Food waste recording
- Explainable reorder recommendations

### 6. Staff Management & Predictive Staff Allocation

- Staff management
- Staff details
- Shift scheduling
- Staff assignments
- Attendance
- Leave requests
- Demand-based staff allocation recommendations

---

## Connected Workflows

AUREVIA is designed as a connected system rather than six isolated modules.

### Reservation and Payment

```text
Reservation Request
        ↓
Invoice
        ↓
Bank Payment Slip
        ↓
Cashier Verification
        ↓
Payment Status
        ↓
Reservation Confirmation
```

### Menu, Order, and Inventory

```text
Menu / Order
      ↓
Confirmed Order
      ↓
Ingredient Usage
      ↓
Inventory Update
```

### Demand and Staff Allocation

```text
Reservations + Events
        ↓
Expected Demand
        ↓
Staff Recommendation
        ↓
Staff Allocation
```

### Event Feedback

```text
Completed Event
      ↓
Customer Feedback
      ↓
Sentiment Analysis
      ↓
Management Insight
```

These workflows describe the intended integrated system behavior. Backend persistence and cross-module business logic are not yet connected.

---

## Technology Stack

### Frontend — Implemented

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend — Planned

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Maven
- JWT-based authentication
- Role-based authorization

### Database — Planned

- MySQL

---

## Current Implementation Status

The project has completed a substantial **frontend baseline** covering the public website, customer experience, and role-specific management workspaces.

The frontend currently demonstrates system workflows and interface architecture without pretending that backend persistence or authorization already exists.

### Implemented in the Frontend

- [x] Public website
- [x] Login interface
- [x] Registration interface
- [x] Customer workspace
- [x] Restaurant Manager workspace
- [x] Chef workspace
- [x] Event Coordinator workspace
- [x] Cashier workspace
- [x] Inventory Manager workspace
- [x] HR Manager workspace
- [x] Administrator workspace
- [x] Responsive role navigation
- [x] Dynamic detail routes
- [x] Empty/loading/interface states
- [x] 404 route handling
- [x] Reusable UI component system

### Not Yet Implemented

- [ ] Spring Boot backend
- [ ] MySQL persistence
- [ ] REST API integration
- [ ] Real authentication
- [ ] JWT generation and validation
- [ ] Spring Security authorization
- [ ] Protected frontend routes
- [ ] Backend-enforced role permissions
- [ ] Persistent CRUD operations
- [ ] Real-time reservation availability
- [ ] Backend pricing engine
- [ ] Persistent invoice/payment processing
- [ ] Persistent inventory updates
- [ ] Sentiment-analysis processing
- [ ] End-to-end frontend/backend testing

---

## Frontend Workspaces

### Public Website

The public experience includes:

- Home
- Dining
- Menu
- Events
- About
- Login
- Registration

Public dining availability is currently an interface preview. It must not be interpreted as real-time availability until the backend reservation service is connected.

Menu and event content used for demonstration may come from local frontend data.

---

### Customer Workspace

Base route:

```text
/customer
```

The customer experience includes:

- Dashboard
- Profile
- Table reservation
- Event venue booking
- Reservation history
- Reservation details
- Menu browsing
- Catering menu customization
- Food recommendations
- Saved packages
- My Events
- Event details
- Billing & Payments
- Invoices
- Invoice details
- Bank payment slip upload
- Payment history
- Feedback

Dynamic reservation-detail routes are supported in the frontend:

```text
/customer/reservations/table/:reservationId
/customer/reservations/venue/:bookingId
```

These route parameters currently demonstrate navigation structure. Actual records will be retrieved from backend APIs later.

---

### Restaurant Manager Workspace

Base route:

```text
/restaurant-manager
```

Includes:

- Dashboard
- Reservation management
- Restaurant table management
- Event venue management
- Pricing-rule management

The frontend does not currently perform real availability checks or pricing calculations.

---

### Chef Workspace

Base route:

```text
/chef
```

Includes:

- Dashboard
- Menu item management
- Menu categories
- Dietary and allergen information

Menu management will eventually provide authoritative menu information to customer-facing menu and recommendation functionality.

---

### Event Coordinator Workspace

Base route:

```text
/event-coordinator
```

Includes:

- Dashboard
- Event management
- Event details
- Event timelines
- Vendor management
- Feedback insights

Sentiment results are not fabricated in the frontend. Sentiment processing will be integrated separately.

---

### Cashier Workspace

Base route:

```text
/cashier
```

Includes:

- Dashboard
- Invoice management
- Payment verification queue
- Payment verification details
- Payment history

AUREVIA does not currently use an online payment gateway.

The intended payment workflow is based on customer bank-payment-slip submission followed by manual cashier verification.

---

### Inventory Manager Workspace

Base route:

```text
/inventory
```

Includes:

- Dashboard
- Inventory items
- Inventory item details
- Stock management
- Low-stock monitoring
- Waste management
- Reorder recommendations

Reorder recommendations are currently represented as an explainable decision-support workflow. They do not automatically create purchases.

---

### HR Manager Workspace

Base route:

```text
/hr
```

Includes:

- Dashboard
- Staff management
- Staff details
- Shift scheduling
- Staff assignments
- Attendance
- Leave management
- Staff allocation recommendations

Staff allocation recommendations are decision support only and do not automatically modify shifts or assignments.

---

### Administrator Workspace

Base route:

```text
/admin
```

Includes:

- Dashboard
- User management
- Role management
- Reports
- Settings

Current role-specific frontend layouts provide interface separation only.

Actual security boundaries must be enforced by Spring Security and backend authorization.

---

## Frontend Architecture

The frontend follows a feature-oriented structure with reusable components, layouts, routes, data, services, and module-specific pages.

```text
src/
├── assets/
│   ├── images/
│   └── icons/
│
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── forms/
│   └── ui/
│
├── context/
├── data/
├── hooks/
├── layouts/
│
├── pages/
│   ├── public/
│   ├── auth/
│   ├── customer/
│   ├── reservation/
│   ├── menu/
│   ├── events/
│   ├── billing/
│   ├── inventory/
│   ├── staff/
│   ├── admin/
│   ├── dashboard/
│   └── errors/
│
├── routes/
├── services/
├── utils/
├── App.jsx
├── index.css
└── main.jsx
```

---

## Reusable Frontend Components

The design system includes reusable components for:

- Buttons
- Cards
- Badges
- Modals
- Alerts
- Tabs
- Data tables
- Loading states
- Empty states
- Input fields
- Select fields
- Text areas
- Checkboxes
- File uploads

The frontend uses a consistent visual system based on warm ivory backgrounds, deep emerald tones, warm gold accents, and responsive layouts.

---

## Payment Workflow

AUREVIA does **not** use a real online payment gateway in the current design.

The intended workflow is:

```text
Customer Reservation
        ↓
Invoice Generated
        ↓
Customer Uploads Bank Payment Slip
        ↓
Cashier Reviews Payment Slip
        ↓
Approve / Reject
        ↓
Payment Status Updated
        ↓
Reservation Confirmation
```

This keeps payment verification under authorized cashier control.

The current frontend represents this workflow, while actual file storage, payment records, verification rules, and reservation updates will be implemented through the backend.

---

## Recommendation & Intelligent Features

AUREVIA includes several areas intended to provide explainable intelligent assistance.

### Food Recommendations

The current frontend demonstrates rule-based filtering using information such as:

- Customer dietary preferences
- Dietary classifications
- Allergen exclusions
- Menu-item information

This is currently an explainable recommendation preview, not a trained machine-learning model.

### Inventory Reorder Recommendations

The interface represents reorder decision support based on inventory information.

Recommendations do not automatically create supplier orders.

### Staff Allocation Recommendations

The interface represents demand-based staff allocation support.

Recommendations do not automatically modify employee schedules.

### Sentiment Analysis

Customer feedback can later be processed for sentiment analysis.

The frontend does not fabricate sentiment classifications when no analysis has been performed.

---

## Current Frontend Data

Some frontend areas currently use local structured demonstration data.

Examples may include:

```text
src/data/menuData.js
src/data/eventData.js
```

Demonstration data is kept separate from page presentation where possible.

During backend integration, these sources will be replaced by REST API responses through the frontend service layer.

Backend-dependent dashboards and management tables intentionally use empty states or `—` values instead of fabricated operational records.

---

## Authentication & Security Status

Login and registration interfaces are implemented, but authentication is **not yet connected to a backend**.

The current frontend does not:

- Validate credentials against a database
- Generate JWT tokens
- Protect routes using authenticated sessions
- Enforce staff roles
- Provide backend authorization

Role-specific layouts currently demonstrate the intended user experience only.

The planned backend security architecture will use:

```text
Spring Security
      +
JWT Authentication
      +
Role-Based Authorization
```

Passwords must be securely hashed by the backend and must never be stored or returned as plain text.

Database passwords, JWT secrets, API keys, and environment-specific credentials must not be committed to the repository.

---

## Availability & Pricing Status

Reservation and venue availability interfaces currently demonstrate the intended interaction.

They are **not real-time availability checks**.

The future backend will be responsible for:

- Reading existing reservations
- Detecting booking conflicts
- Validating capacity
- Applying applicable pricing rules
- Preventing double booking
- Returning authoritative availability and price information

Pricing formulas should remain backend-authoritative rather than being trusted to the browser.

---

## Running the Frontend

### 1. Clone the repository

```bash
git clone https://github.com/N-Amasha/AUREVIA.git
```

### 2. Open the project directory

Navigate to the frontend project directory.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Create a production build

```bash
npm run build
```

---

## Screenshots

Development screenshots are stored in:

```text
docs/screenshots/
```

They document major frontend milestones including public pages, customer functionality, and role-specific management workspaces.

---

## Development Principles

AUREVIA follows these development principles:

- Modular architecture
- Reusable UI components
- Responsive design
- Separation of presentation and data
- Clear frontend/backend boundaries
- Explainable recommendation logic
- Backend-authoritative business rules
- No fake authentication
- No hard-coded credentials
- No exposed secrets
- Git-based version control
- Incremental development and testing

---

## Next Development Phase

The next major phase is backend implementation and frontend integration.

```text
Frontend Baseline
      COMPLETE
          ↓
Spring Boot Project Setup
          ↓
MySQL Configuration
          ↓
EER → JPA Entity Mapping
          ↓
Repositories
          ↓
Service Layer
          ↓
REST Controllers
          ↓
Spring Security + JWT
          ↓
Role-Based Authorization
          ↓
Frontend Axios Integration
          ↓
Persistent Business Workflows
          ↓
End-to-End Testing
```

The backend will be developed from the finalized system requirements and database design rather than from fabricated frontend data.

---

## Development Status

AUREVIA is under active development.

The current repository provides a broad frontend implementation of the intended restaurant and event management experience. The next phase will convert these interfaces into persistent, secured, data-driven workflows through Java Spring Boot and MySQL.