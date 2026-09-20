# AUREVIA

**Restaurant & Event Management System**

AUREVIA is a web-based restaurant and event management system designed to connect customer-facing dining and event experiences with the operational activities required to manage reservations, menus, events, billing, inventory, and staff.

The project is being developed using a modular architecture with a React frontend and a Spring Boot backend.

---

## Project Overview

Restaurant and event operations involve multiple connected processes. A reservation may affect billing, menu planning, inventory requirements, event coordination, and staff allocation.

AUREVIA is designed to bring these processes together within one system while providing appropriate functionality for customers and authorized staff members.

### Core Functional Areas

1. **Table & Event Venue Reservation**
   - Table and venue reservation management
   - Availability checking
   - Reservation status tracking
   - Venue pricing support

2. **Menu Customization & Recommendation**
   - Menu browsing and management
   - Dietary and allergen information
   - Menu customization
   - Customer preference support
   - Food recommendation functionality

3. **Event Coordination & Customer Feedback**
   - Event management
   - Event timeline tracking
   - Vendor coordination
   - Staff requirement coordination
   - Customer feedback
   - Sentiment analysis support

4. **Billing & Payment Management**
   - Invoice management
   - Bank payment slip upload
   - Manual payment verification by cashier
   - Payment approval and rejection
   - Payment status tracking

5. **Smart Inventory & Food Waste Management**
   - Inventory management
   - Stock tracking
   - Low-stock monitoring
   - Ingredient usage
   - Food waste recording
   - Reorder recommendation support

6. **Staff Management & Predictive Staff Allocation**
   - Staff management
   - Shift scheduling
   - Staff assignments
   - Attendance and performance information
   - Demand-based staff allocation support

---

## Connected Workflows

AUREVIA is designed as a connected system rather than six isolated modules.

Examples include:

```text
Reservation
    ↓
Invoice
    ↓
Payment Slip
    ↓
Cashier Verification
    ↓
Reservation Confirmation
```

```text
Menu / Order
    ↓
Confirmed Order
    ↓
Ingredient Usage
    ↓
Inventory Update
```

```text
Reservations + Events
        ↓
Expected Demand
        ↓
Staff Allocation
```

```text
Completed Event
      ↓
Customer Feedback
      ↓
Sentiment Analysis
```

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Maven
- JWT-based authentication
- Role-based authorization

### Database

- MySQL

---

## Frontend Architecture

The frontend follows a feature-oriented structure with reusable UI components, layouts, route configuration, services, shared data, and module-specific pages.

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

## Frontend Progress

### Foundation

- [x] React + Vite project setup
- [x] Tailwind CSS configuration
- [x] React Router setup
- [x] Reusable design system
- [x] Responsive public layout
- [x] Shared Navbar
- [x] Shared Footer

### Reusable Components

The frontend currently includes reusable components for:

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

### Public Website

- [x] Home
- [x] Dining
- [x] Menu
- [x] Events
- [x] About

### Authentication

- [ ] Authentication layout
- [ ] Login interface
- [ ] Registration interface
- [ ] JWT integration
- [ ] Protected routes
- [ ] Role-based route access

### Customer Module

- [ ] Customer dashboard
- [ ] Profile
- [ ] Reservations
- [ ] Menu customization
- [ ] Recommendations
- [ ] Events
- [ ] Invoices
- [ ] Payment slip upload
- [ ] Payment status
- [ ] Feedback

### Management Modules

- [ ] Reservation management
- [ ] Menu management
- [ ] Event coordination
- [ ] Billing and payment verification
- [ ] Inventory and waste management
- [ ] Staff management and allocation
- [ ] Administration and reporting

---

## Public Frontend Features

### Home

The Home page introduces the AUREVIA dining and event experience and provides navigation to the main public functionality.

### Dining

The Dining page currently provides:

- Dining experience information
- Date, time, and guest selection interface
- Dining option previews
- Reservation process explanation

The availability interface is currently a **frontend preview**. Real availability will be provided by the backend reservation service after integration.

### Menu

The Menu page currently provides:

- Menu category filtering
- Menu search
- Dietary labels
- Allergen information
- Customer dietary preference selection
- Recommendation interface preview

Menu records and prices currently shown in the frontend are **demonstration data**.

The recommendation interface currently demonstrates the user experience only. Recommendation logic will be connected separately.

### Events

The Events page currently provides:

- Event type filtering
- Wedding event information
- Corporate event information
- Celebration event information
- Private event information
- Event coordination process explanation

The coordination journey demonstrates the intended flow:

```text
Event Request
    ↓
Venue Options
    ↓
Dining Customization
    ↓
Resource Coordination
    ↓
Progress Tracking
    ↓
Customer Feedback
```

Venue availability and actual event records will be provided by backend services after integration.

### About

The About page explains:

- The purpose of AUREVIA
- The six core functional areas
- Role-based system access
- Connections between system modules
- Major operational workflows

---

## Current Development Status

The **public frontend milestone is complete**.

Current development focus:

```text
Public Website       COMPLETE
        ↓
Authentication       NEXT
        ↓
Customer Experience
        ↓
Reservation Management
        ↓
Menu Management & Recommendations
        ↓
Event Coordination & Sentiment Analysis
        ↓
Billing & Payment Verification
        ↓
Inventory & Waste Management
        ↓
Staff Management & Allocation
        ↓
Administration
        ↓
Backend Integration & Final Testing
```

---

## Payment Workflow

AUREVIA does **not currently use an online payment gateway**.

The intended payment workflow is:

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

This allows payment verification to remain under authorized cashier control.

---

## Recommendation & Intelligent Features

AUREVIA is designed to support explainable intelligent features such as:

- Food recommendations
- Sentiment analysis
- Inventory reorder recommendations
- Demand-based staff allocation

During frontend development, these areas may contain clearly identified preview interfaces.

The recommendation and prediction logic will be implemented separately and integrated through backend services.

---

## Development Principles

The project follows several development principles:

- Modular architecture
- Reusable UI components
- Separation of presentation and data
- Responsive design
- Role-based access
- Clear frontend/backend separation
- Explainable recommendation logic
- No hard-coded authentication credentials
- No exposed secrets in the repository
- Git-based version control
- Incremental development and testing

---

## Running the Frontend

Navigate to the frontend project directory and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

---

## Current Frontend Data

Some public pages currently use local structured demonstration data during frontend development.

For example:

```text
src/data/menuData.js
src/data/eventData.js
```

This keeps demonstration data separate from page presentation logic.

During backend integration, these local sources can be replaced by API responses through the frontend service layer.

---

## Screenshots

Development screenshots are stored in:

```text
docs/screenshots/
```

They document major frontend milestones and reusable components during implementation.

---

## Security

Sensitive information such as database passwords, JWT secrets, API keys, and environment-specific credentials must not be committed to the repository.

Authentication and authorization will be implemented using Spring Security, JWT, and role-based access control.

---

## Development

AUREVIA is under active development.

The current implementation focuses on establishing a reusable frontend architecture and completing the public customer-facing experience before moving into authentication and role-specific system modules.