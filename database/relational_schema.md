# AUREVIA Relational Schema

## IT2140 Database Design and Development — Assignment Part 02

**Group:** Y2-S1-MLB-B2G2-04

This relational schema was derived from the finalized AUREVIA EER
diagram. It identifies primary keys, foreign keys, unique constraints,
composite attribute mappings, multivalued attribute mappings,
specialization mappings and relationship mappings.

## 1. User and Role Relations

### USER

USER(
    UserID PK,
    FirstName,
    LastName,
    Email UQ,
    RegistrationDate,
    Street,
    City,
    Province,
    PostalCode,
    PasswordHash
)

The composite Name attribute was mapped into FirstName and LastName.
The composite Address attribute was mapped into Street, City, Province
and PostalCode. Email is declared UNIQUE because two user accounts
should not use the same email address. Password was refined to
PasswordHash because plaintext passwords must not be stored.

### CUSTOMER

CUSTOMER(
    UserID PK, FK → USER.UserID
)

### ADMINISTRATOR

ADMINISTRATOR(
    UserID PK, FK → USER.UserID
)

### CUSTOMER_PHONE

CUSTOMER_PHONE(
    UserID PK, FK → CUSTOMER.UserID,
    PhoneNumber PK
)

Phone is a multivalued attribute in the EER diagram. Therefore, it was
mapped into the separate CUSTOMER_PHONE relation. Its composite primary
key consists of UserID and PhoneNumber, allowing one customer to store
multiple distinct phone numbers.

### EMPLOYEE

EMPLOYEE(
    EmployeeID PK,
    UserID FK → USER.UserID, UQ,
    HireDate,
    Salary,
    EmploymentStatus,
    SupervisorID FK → EMPLOYEE.EmployeeID, NULL
)

EMPLOYEE is connected to USER so that common identity and account
attributes remain in USER. EmployeeID is retained as the primary key
because it is explicitly identified as the key of EMPLOYEE in the EER
diagram. UserID is a UNIQUE foreign key, creating a one-to-one
association between USER and EMPLOYEE.

The recursive Supervises relationship was mapped by adding the nullable
SupervisorID foreign key to EMPLOYEE. A top-level employee may have no
supervisor, so SupervisorID permits NULL.

### RESTAURANT_MANAGER

RESTAURANT_MANAGER(
    EmployeeID PK, FK → EMPLOYEE.EmployeeID,
    ManagementArea
)

### EVENT_COORDINATOR

EVENT_COORDINATOR(
    EmployeeID PK, FK → EMPLOYEE.EmployeeID,
    CoordinationLevel
)

### CHEF

CHEF(
    EmployeeID PK, FK → EMPLOYEE.EmployeeID,
    Specialization
)

### CASHIER

CASHIER(
    EmployeeID PK, FK → EMPLOYEE.EmployeeID,
    CounterNo
)

### INVENTORY_MANAGER

INVENTORY_MANAGER(
    EmployeeID PK, FK → EMPLOYEE.EmployeeID,
    WarehouseArea
)

### HR_MANAGER

HR_MANAGER(
    EmployeeID PK, FK → EMPLOYEE.EmployeeID,
    HRLevel
)

### RESTAURANT_STAFF

RESTAURANT_STAFF(
    EmployeeID PK, FK → EMPLOYEE.EmployeeID,
    StaffType
)

## ISA Mapping Explanation

The USER and EMPLOYEE specialization hierarchies were mapped using the
superclass-and-subclass relation approach. Common attributes are stored
only in their superclass relations, while subtype-specific attributes
are stored in separate subtype relations.

CUSTOMER and ADMINISTRATOR use UserID as both their primary key and a
foreign key referencing USER. EMPLOYEE retains EmployeeID as its
employment identifier and contains a UNIQUE UserID foreign key
referencing USER.

Each employee subtype uses EmployeeID as both its primary key and a
foreign key referencing EMPLOYEE. This prevents duplicated employee
attributes and ensures that a subtype record cannot exist without its
corresponding employee record.

The employee specialization is disjoint, meaning an employee is
classified under one employee subtype according to the EER design.
This rule cannot be completely enforced using individual foreign keys
alone and must also be maintained through application logic or
additional database validation.


## 2. Table and Venue Reservation Relations

### RESTAURANT_TABLE

RESTAURANT_TABLE(
    TableID PK,
    TableNumber UQ,
    Capacity,
    Location,
    TableStatus
)

TableID is the primary key. TableNumber is declared UNIQUE because two
restaurant tables should not have the same visible table number.
Capacity must be greater than zero. TableStatus records whether the
table is currently available for use.

### RESERVATION

RESERVATION(
    ReservationID PK,
    CustomerID FK → CUSTOMER.UserID,
    TableID FK → RESTAURANT_TABLE.TableID,
    ReservationDate,
    StartTime,
    EndTime,
    NumberOfGuests,
    ReservationStatus,
    CreatedAt
)

The MAKES relationship between CUSTOMER and RESERVATION is one-to-many.
Therefore, CustomerID was placed in RESERVATION as a foreign key.

The ASSIGNED_TO relationship between RESTAURANT_TABLE and RESERVATION
is one-to-many. Therefore, TableID was placed in RESERVATION as a
foreign key.

CreatedAt was added as a refinement to record when the reservation
request was entered into the system.

### VENUE

VENUE(
    VenueID PK,
    VenueName UQ,
    AvailabilityStatus,
    Capacity,
    Location,
    VenueType,
    BasePrice
)

VenueID is the primary key. VenueName is declared UNIQUE so that the
same physical venue is not registered more than once. Capacity must be
greater than zero and BasePrice must not be negative.

### VENUE_FEATURE

VENUE_FEATURE(
    VenueID PK, FK → VENUE.VenueID,
    FeatureName PK
)

SpecialFeatures is a multivalued attribute because one venue may have
many features. It was therefore mapped into the separate VENUE_FEATURE
relation. The combination of VenueID and FeatureName forms the primary
key and prevents the same feature from being repeated for one venue.

### EVENT_BOOKING

EVENT_BOOKING(
    EventBookingID PK,
    CustomerID FK → CUSTOMER.UserID,
    VenueID FK → VENUE.VenueID,
    BookingDate,
    GuestCount,
    TotalAmount,
    BookingStatus,
    CreatedAt
)

The MAKES relationship between CUSTOMER and EVENT_BOOKING is
one-to-many. Therefore, CustomerID was placed in EVENT_BOOKING.

The USES relationship between VENUE and EVENT_BOOKING is one-to-many.
Therefore, VenueID was placed in EVENT_BOOKING.

CreatedAt was added as a refinement to distinguish the requested event
date from the date and time on which the booking record was created.

### PRICING_RULE

PRICING_RULE(
    PricingRuleID PK,
    VenueID FK → VENUE.VenueID,
    RuleName,
    StartDate,
    EndDate,
    Surcharge,
    Price,
    ApprovalStatus
)

The APPLIED_TO relationship between VENUE and PRICING_RULE is
one-to-many. Therefore, VenueID was placed in PRICING_RULE as a
foreign key.

StartDate and EndDate define the period during which the rule is
applicable. ApprovalStatus records whether the seasonal or special
pricing rule has been approved.

### Reservation Module Relationship Mapping

1. CUSTOMER–RESERVATION:
   One customer can make many table reservations. CustomerID is stored
   as a foreign key in RESERVATION.

2. RESTAURANT_TABLE–RESERVATION:
   One restaurant table can be assigned to many reservations occurring
   at different dates or times. TableID is stored as a foreign key in
   RESERVATION.

3. CUSTOMER–EVENT_BOOKING:
   One customer can make many event bookings. CustomerID is stored as
   a foreign key in EVENT_BOOKING.

4. VENUE–EVENT_BOOKING:
   One venue can be used for many event bookings at different dates or
   times. VenueID is stored as a foreign key in EVENT_BOOKING.

5. VENUE–PRICING_RULE:
   One venue can have many pricing rules. VenueID is stored as a
   foreign key in PRICING_RULE.

6. VENUE–VENUE_FEATURE:
   One venue can have many special features. The multivalued
   SpecialFeatures attribute was converted into VENUE_FEATURE.

## 3. Menu Customization and Order Management Relations

### MENU

MENU(
    MenuID PK,
    MenuName UQ,
    MenuType,
    Status,
    Description
)

MenuID is the primary key. MenuName is declared UNIQUE to prevent
duplicate menu records with the same name. MenuType identifies the
purpose of the menu, while Status indicates whether the menu is
currently active.

### MENU_ITEM

MENU_ITEM(
    MenuItemID PK,
    MenuID FK → MENU.MenuID,
    ItemName,
    Category,
    Description,
    Price,
    AvailabilityStatus
)

The CONTAINS relationship between MENU and MENU_ITEM is one-to-many.
Therefore, MenuID was placed in MENU_ITEM as a foreign key. One menu
can contain many menu items, while each menu item belongs to one menu
according to the finalized EER design.

### CATERING_PACKAGE

CATERING_PACKAGE(
    PackageID PK,
    PackageName UQ,
    Description,
    PackageType,
    BasePrice,
    MinimumGuests,
    MaximumGuests
)

PackageID is the primary key. PackageName is declared UNIQUE to prevent
duplicate catering package names. MinimumGuests and MaximumGuests
define the supported guest range for the package.

### PACKAGE_ITEM

PACKAGE_ITEM(
    PackageID PK, FK → CATERING_PACKAGE.PackageID,
    MenuItemID PK, FK → MENU_ITEM.MenuItemID,
    Quantity
)

PACKAGE_ITEM resolves the many-to-many relationship between
CATERING_PACKAGE and MENU_ITEM. The combination of PackageID and
MenuItemID forms the composite primary key. This prevents the same
menu item from being added repeatedly to the same package. Quantity
records how many units of that menu item are included.

### FAVORITE_PACKAGE

FAVORITE_PACKAGE(
    FavoriteID PK,
    CustomerID FK → CUSTOMER.UserID,
    PackageID FK → CATERING_PACKAGE.PackageID,
    SavedDate,
    Notes,
    UQ(CustomerID, PackageID)
)

FAVORITE_PACKAGE resolves the many-to-many relationship between
CUSTOMER and CATERING_PACKAGE. FavoriteID is retained as the primary
key because it appears as an identifier in the EER.

The combination of CustomerID and PackageID is declared UNIQUE so that
the same customer cannot save the same catering package more than once.

### CUSTOMER_ORDER

CUSTOMER_ORDER(
    OrderID PK,
    CustomerID FK → CUSTOMER.UserID,
    OrderDate,
    OrderType,
    OrderStatus,
    TotalAmount
)

The EER entity ORDER was renamed CUSTOMER_ORDER because ORDER is an SQL
keyword used in ORDER BY. This is a naming refinement and does not
change the meaning of the entity.

The PLACES relationship between CUSTOMER and ORDER is one-to-many.
Therefore, CustomerID was placed in CUSTOMER_ORDER as a foreign key.

### ORDER_ITEM

ORDER_ITEM(
    OrderID PK, FK → CUSTOMER_ORDER.OrderID,
    MenuItemID PK, FK → MENU_ITEM.MenuItemID,
    Quantity,
    UnitPrice,
    Subtotal
)

ORDER_ITEM resolves the many-to-many relationship between CUSTOMER_ORDER
and MENU_ITEM. OrderID and MenuItemID form the composite primary key.

UnitPrice stores the price of the item at the time of ordering.
Subtotal represents Quantity multiplied by UnitPrice. This allows order
history to remain accurate even if the current menu price changes.

### Menu and Order Relationship Mapping

1. MENU–MENU_ITEM:
   One menu contains many menu items. MenuID is stored as a foreign key
   in MENU_ITEM.

2. CATERING_PACKAGE–MENU_ITEM:
   A catering package can contain many menu items, and a menu item can
   appear in many catering packages. PACKAGE_ITEM resolves this
   many-to-many relationship.

3. CUSTOMER–CATERING_PACKAGE:
   A customer can save many packages, and a package can be saved by
   many customers. FAVORITE_PACKAGE resolves this many-to-many
   relationship.

4. CUSTOMER–CUSTOMER_ORDER:
   One customer can place many orders. CustomerID is stored as a foreign
   key in CUSTOMER_ORDER.

5. CUSTOMER_ORDER–MENU_ITEM:
   An order can contain many menu items, and a menu item can appear in
   many orders. ORDER_ITEM resolves this many-to-many relationship.

## 4. Event Coordination and Customer Feedback Relations

### EVENT

EVENT(
    EventID PK,
    EventBookingID FK → EVENT_BOOKING.EventBookingID, UQ,
    CoordinatorID FK → EVENT_COORDINATOR.EmployeeID,
    EventName,
    EventType,
    EventDate,
    StartTime,
    EndTime,
    Budget,
    NumberOfGuests,
    EventStatus
)

An EVENT is created from an EVENT_BOOKING. EventBookingID is declared
UNIQUE so that one event booking cannot produce multiple primary event
records.

CoordinatorID identifies the event coordinator responsible for managing
the event. It references the EVENT_COORDINATOR subtype so that the
assigned employee must be an event coordinator.

The event date and time are stored in EVENT because they describe the
actual coordinated event schedule.

### VENDOR

VENDOR(
    VendorID PK,
    VendorName,
    VendorType,
    Email UQ,
    ContactNumber,
    Street,
    City,
    Province,
    PostalCode
)

The composite Address attribute was mapped into Street, City, Province
and PostalCode. VendorID is the primary key. Email is declared UNIQUE
to prevent multiple vendor records from using the same business email
address.

### EVENT_SERVICE

EVENT_SERVICE(
    EventServiceID PK,
    EventID FK → EVENT.EventID,
    VendorID FK → VENDOR.VendorID,
    ServiceName,
    ServiceDate,
    StartTime,
    EndTime,
    Cost,
    ServiceStatus
)

The HAS relationship between EVENT and EVENT_SERVICE is one-to-many.
Therefore, EventID was placed in EVENT_SERVICE.

The PROVIDES relationship between VENDOR and EVENT_SERVICE is
one-to-many. Therefore, VendorID was placed in EVENT_SERVICE.

This design allows one event to require several services and allows one
vendor to provide services for several events.

### EVENT_TIMELINE

EVENT_TIMELINE(
    TimelineID PK,
    EventID FK → EVENT.EventID,
    MilestoneName,
    Description,
    ScheduledDate,
    Status,
    UpdatedDate
)

The HAS relationship between EVENT and EVENT_TIMELINE is one-to-many.
Therefore, EventID was placed in EVENT_TIMELINE as a foreign key.

Each timeline record represents one milestone belonging to an event.
UpdatedDate records the latest date on which the milestone information
was modified.

### REVIEW

REVIEW(
    ReviewID PK,
    CustomerID FK → CUSTOMER.UserID,
    EventID FK → EVENT.EventID, NULL,
    OrderID FK → CUSTOMER_ORDER.OrderID, NULL,
    ReviewDate,
    Rating,
    Comment,
    Sentiment NULL,
    UQ(CustomerID, EventID),
    UQ(CustomerID, OrderID)
)

A review is written by one customer. Therefore, CustomerID was placed
in REVIEW as a foreign key.

The EER connects customer feedback to completed events and customer
orders. EventID and OrderID are therefore optional foreign keys.
Exactly one review subject must be selected: either an event or an
order, but not both.

Sentiment is nullable because sentiment analysis is a planned
processing feature. A review can be stored before its sentiment has
been calculated.

The following uniqueness rules apply:

- A customer may submit at most one review for a particular event.
- A customer may submit at most one review for a particular order.
- Exactly one of EventID or OrderID must be non-null.

### Event Coordination Relationship Mapping

1. EVENT_BOOKING–EVENT:
   One event booking creates at most one coordinated event.
   EventBookingID is stored as a UNIQUE foreign key in EVENT.

2. EVENT_COORDINATOR–EVENT:
   One event coordinator may manage many events. CoordinatorID is
   stored as a foreign key in EVENT.

3. EVENT–EVENT_SERVICE:
   One event can require many services. EventID is stored as a foreign
   key in EVENT_SERVICE.

4. VENDOR–EVENT_SERVICE:
   One vendor can provide services for many events. VendorID is stored
   as a foreign key in EVENT_SERVICE.

5. EVENT–EVENT_TIMELINE:
   One event can have many timeline milestones. EventID is stored as a
   foreign key in EVENT_TIMELINE.

6. CUSTOMER–REVIEW:
   One customer can write many reviews. CustomerID is stored as a
   foreign key in REVIEW.

7. EVENT–REVIEW:
   An event can receive customer feedback after completion. EventID is
   stored as an optional foreign key in REVIEW.

8. CUSTOMER_ORDER–REVIEW:
   A completed customer order can receive customer feedback. OrderID
   is stored as an optional foreign key in REVIEW.

## 5. Billing and Payment Management Relations

### INVOICE

INVOICE(
    InvoiceID PK,
    CustomerID FK → CUSTOMER.UserID,
    ReservationID FK → RESERVATION.ReservationID, NULL,
    EventBookingID FK → EVENT_BOOKING.EventBookingID, NULL,
    OrderID FK → CUSTOMER_ORDER.OrderID, NULL,
    InvoiceDate,
    SubTotal,
    Discount,
    TaxAmount,
    TotalAmount,
    InvoiceStatus
)

The RECEIVES relationship between CUSTOMER and INVOICE is one-to-many.
Therefore, CustomerID was placed in INVOICE as a foreign key.

An invoice may be generated for a table reservation, an event booking,
or a customer order. ReservationID, EventBookingID and OrderID are
therefore nullable foreign keys. Exactly one transaction reference must
be provided for each invoice.

The invoice source is constrained so that exactly one of ReservationID,
EventBookingID or OrderID contains a value. This prevents one invoice
from being connected to multiple unrelated transaction types.


SubTotal represents the amount before discounts and taxes. Discount
represents the deducted amount. TaxAmount represents the added tax.
TotalAmount represents the final invoice amount.

The following calculation must hold:

TotalAmount = SubTotal - Discount + TaxAmount

InvoiceStatus records the current state of the invoice. A new invoice
may begin as DRAFT or ISSUED. Payment verification can later change it
to PARTIALLY_PAID or PAID.

### PAYMENT

PAYMENT(
    PaymentID PK,
    InvoiceID FK → INVOICE.InvoiceID,
    VerifiedByCashierID FK → CASHIER.EmployeeID, NULL,
    TransactionReference UQ,
    PaymentType,
    PaymentDate,
    Amount,
    PaymentMethod,
    PaymentStatus,
    VerifiedAt NULL
)

The HAS relationship between INVOICE and PAYMENT is one-to-many.
Therefore, InvoiceID was placed in PAYMENT as a foreign key.

TransactionReference is declared UNIQUE because the same bank or payment
reference must not be accepted more than once.

VerifiedByCashierID is nullable because a newly submitted payment has
not yet been reviewed. After verification, it identifies the cashier
who approved or rejected the payment. VerifiedAt records when that
decision was made.

PaymentType describes the purpose or stage of the payment, while
PaymentMethod describes the mechanism used to make the payment. They
are therefore retained as separate attributes.

A bank payment initially enters the verification process. It is not
considered successful until a cashier approves it. Therefore, the
payment status and invoice status must not be changed to APPROVED and
PAID merely because a customer submitted payment information.

A payment cannot be considered approved or rejected without recording
the cashier responsible for the decision and the verification time.
Newly submitted payments may have no verifying cashier.

### Billing and Payment Relationship Mapping

1. CUSTOMER–INVOICE:
   One customer can receive many invoices. CustomerID is stored as a
   foreign key in INVOICE.

2. RESERVATION–INVOICE:
   A table reservation may generate one invoice. ReservationID is stored
   as an optional UNIQUE foreign key in INVOICE.

3. EVENT_BOOKING–INVOICE:
   An event booking may generate one invoice. EventBookingID is stored
   as an optional UNIQUE foreign key in INVOICE.

4. CUSTOMER_ORDER–INVOICE:
   A customer order may generate one invoice. OrderID is stored as an
   optional UNIQUE foreign key in INVOICE.

5. INVOICE–PAYMENT:
   One invoice can have multiple payments, such as an advance payment
   followed by a final payment. InvoiceID is stored in PAYMENT.

6. CASHIER–PAYMENT:
   One cashier can verify many payments. VerifiedByCashierID is stored
   as an optional foreign key in PAYMENT.

## 6. Inventory and Waste Management Relations

### SUPPLIER

SUPPLIER(
    SupplierID PK,
    SupplierName,
    Email UQ,
    ContactNumber,
    Street,
    City,
    Province,
    PostalCode
)

SupplierID is the primary key. The composite Address attribute was
mapped into Street, City, Province and PostalCode. Email is declared
UNIQUE to prevent multiple supplier records from using the same
business email address.

### INVENTORY_ITEM

INVENTORY_ITEM(
    InventoryItemID PK,
    SupplierID FK → SUPPLIER.SupplierID,
    ItemName,
    ItemCategory,
    Unit,
    CurrentQuantity,
    ReorderLevel,
    UnitCost,
    ExpiryDate
)

The SUPPLIES relationship between SUPPLIER and INVENTORY_ITEM is
one-to-many. Therefore, SupplierID was placed in INVENTORY_ITEM as a
foreign key.

One supplier may supply many inventory items, while each inventory item
is connected to one principal supplier according to the finalized EER.

Low-stock status is treated as derived information. It is calculated by
comparing CurrentQuantity with ReorderLevel instead of storing a
separate value that could become inconsistent.

### INVENTORY_USAGE

INVENTORY_USAGE(
    UsageID PK,
    InventoryItemID FK → INVENTORY_ITEM.InventoryItemID,
    OrderID FK → CUSTOMER_ORDER.OrderID, NULL,
    UsageDate,
    QuantityUsed,
    UsageReason
)

One INVENTORY_ITEM can have many INVENTORY_USAGE records. Therefore,
InventoryItemID was placed in INVENTORY_USAGE as a foreign key.

The CAUSES relationship indicates that a confirmed or completed customer
order may cause several inventory usage records. Therefore, OrderID was
placed in INVENTORY_USAGE as an optional foreign key.

OrderID permits NULL because inventory may also be consumed for reasons
not directly related to a customer order, such as testing, staff meals,
maintenance or stock adjustment.

### WASTE_RECORD

WASTE_RECORD(
    WasteID PK,
    InventoryItemID FK → INVENTORY_ITEM.InventoryItemID,
    RecordedByManagerID FK → INVENTORY_MANAGER.EmployeeID,
    WasteDate,
    WasteReason,
    Quantity,
    EstimatedCost
)

The HAS_A or HAS_WASTE relationship between INVENTORY_ITEM and
WASTE_RECORD is one-to-many. Therefore, InventoryItemID was placed in
WASTE_RECORD.

RecordedByManagerID identifies the inventory manager responsible for
recording the waste transaction. One inventory manager may record many
waste records.

Inventory usage and waste records represent reductions in available
inventory. CurrentQuantity must never become negative. Updating the
quantity and inserting the corresponding usage or waste record must be
performed as one transaction so that the inventory remains consistent.

ExpiryDate is retained in INVENTORY_ITEM to remain consistent with the
finalized EER. A future refinement could introduce an INVENTORY_BATCH
relation if multiple deliveries of the same item must have different
expiry dates.

### Inventory and Waste Relationship Mapping

1. SUPPLIER–INVENTORY_ITEM:
   One supplier can supply many inventory items. SupplierID is stored
   as a foreign key in INVENTORY_ITEM.

2. INVENTORY_ITEM–INVENTORY_USAGE:
   One inventory item can have many usage records. InventoryItemID is
   stored as a foreign key in INVENTORY_USAGE.

3. CUSTOMER_ORDER–INVENTORY_USAGE:
   One customer order can cause many inventory usage records. OrderID
   is stored as an optional foreign key in INVENTORY_USAGE.

4. INVENTORY_ITEM–WASTE_RECORD:
   One inventory item can have many waste records. InventoryItemID is
   stored as a foreign key in WASTE_RECORD.

5. INVENTORY_MANAGER–WASTE_RECORD:
   One inventory manager can record many waste transactions.
   RecordedByManagerID is stored as a foreign key in WASTE_RECORD.

## 7. Staff Scheduling and Management Relations

### SHIFT

SHIFT(
    ShiftID PK,
    EmployeeID FK → EMPLOYEE.EmployeeID,
    ShiftDate,
    StartTime,
    EndTime,
    ShiftStatus
)

The ASSIGNED relationship between EMPLOYEE and SHIFT is one-to-many.
Therefore, EmployeeID was placed in SHIFT as a foreign key.

One employee may be assigned many shifts across different dates, while
each shift record belongs to one employee according to the finalized
EER design.

### ATTENDANCE

ATTENDANCE(
    AttendanceID PK,
    EmployeeID FK → EMPLOYEE.EmployeeID,
    ShiftID FK → SHIFT.ShiftID, NULL,
    AttendanceDate,
    CheckInTime NULL,
    CheckOutTime NULL,
    AttendanceStatus
)

The HAS relationship between EMPLOYEE and ATTENDANCE is one-to-many.
Therefore, EmployeeID was placed in ATTENDANCE as a foreign key.

ShiftID was added as an optional refinement so that attendance can be
matched to a scheduled shift. It permits NULL because attendance may
occasionally be recorded before a shift assignment is linked or for
work that was not originally scheduled.

The combination of EmployeeID and ShiftID is declared UNIQUE to prevent
duplicate attendance records for the same employee and scheduled shift.

### LEAVE_REQUEST

LEAVE_REQUEST(
    LeaveRequestID PK,
    EmployeeID FK → EMPLOYEE.EmployeeID,
    ReviewedByHRManagerID FK → HR_MANAGER.EmployeeID, NULL,
    RequestDate,
    StartDate,
    EndDate,
    LeaveType,
    Reason,
    RequestStatus,
    ReviewedDate NULL
)

The SUBMITS relationship between EMPLOYEE and LEAVE_REQUEST is
one-to-many. Therefore, EmployeeID was placed in LEAVE_REQUEST.

ReviewedByHRManagerID is nullable when the leave request has not yet
been reviewed. Once the request is approved or rejected, it identifies
the HR manager responsible for the decision. ReviewedDate records when
the decision was made.

A leave request cannot be considered approved or rejected without
identifying the HR manager responsible for the decision and recording
the review date. Pending requests may contain no review information.

### EMPLOYEE_TASK

EMPLOYEE_TASK(
    TaskID PK,
    EmployeeID FK → EMPLOYEE.EmployeeID,
    EventID FK → EVENT.EventID, NULL,
    TaskDescription,
    AssignedDate,
    DueDate,
    TaskStatus
)

The ASSIGNED_TO relationship between EMPLOYEE and EMPLOYEE_TASK is
one-to-many. Therefore, EmployeeID was placed in EMPLOYEE_TASK as a
foreign key.

EventID is optional because some employee tasks relate to a coordinated
event, while other tasks relate to normal restaurant operations.

Predictive staff-allocation recommendations are treated as decision
support and are not stored as confirmed shifts automatically. A
recommendation becomes operational only after an authorized manager
creates or updates a SHIFT or EMPLOYEE_TASK record.

### Staff Scheduling Relationship Mapping

1. EMPLOYEE–SHIFT:
   One employee can be assigned many shifts. EmployeeID is stored as a
   foreign key in SHIFT.

2. EMPLOYEE–ATTENDANCE:
   One employee can have many attendance records. EmployeeID is stored
   as a foreign key in ATTENDANCE.

3. SHIFT–ATTENDANCE:
   One scheduled shift may have one attendance record for its assigned
   employee. ShiftID is stored as an optional foreign key in ATTENDANCE.

4. EMPLOYEE–LEAVE_REQUEST:
   One employee can submit many leave requests. EmployeeID is stored as
   a foreign key in LEAVE_REQUEST.

5. HR_MANAGER–LEAVE_REQUEST:
   One HR manager can review many leave requests.
   ReviewedByHRManagerID is stored as an optional foreign key in
   LEAVE_REQUEST.

6. EMPLOYEE–EMPLOYEE_TASK:
   One employee can be assigned many tasks. EmployeeID is stored as a
   foreign key in EMPLOYEE_TASK.

7. EVENT–EMPLOYEE_TASK:
   One event can require many employee tasks. EventID is stored as an
   optional foreign key in EMPLOYEE_TASK.

## 8. Schema Refinements

The following refinements were made while mapping the finalized EER
diagram into the relational schema:

1. ADMINISTRAOR was corrected to ADMINISTRATOR.
2. ORDER was renamed CUSTOMER_ORDER because ORDER is an SQL keyword.
3. Password was refined to PasswordHash to prevent plaintext password
   storage.
4. Composite attributes such as Name and Address were converted into
   atomic columns.
5. Multivalued Phone was mapped into CUSTOMER_PHONE.
6. Multivalued SpecialFeatures was mapped into VENUE_FEATURE.
7. SupervisorID was added to EMPLOYEE to represent the recursive
   Supervises relationship.
8. CreatedAt was added to RESERVATION and EVENT_BOOKING to distinguish
   record creation time from the requested booking date.
9. CoordinatorID was added to EVENT to identify the responsible event
   coordinator.
10. VerifiedByCashierID and VerifiedAt were added to PAYMENT to support
    manual payment verification.
11. RecordedByManagerID was added to WASTE_RECORD to preserve
    accountability.
12. ReviewedByHRManagerID and ReviewedDate were added to LEAVE_REQUEST
    to preserve leave-approval information.
13. ShiftID was added to ATTENDANCE to connect attendance with a
    scheduled shift.
14. EventID was added to EMPLOYEE_TASK so event-related tasks can be
    distinguished from normal restaurant tasks.

## 9. Final Relation Count

The finalized relational schema contains 40 relations:

- 12 user and employee relations
- 6 reservation and venue relations
- 7 menu and order relations
- 5 event and feedback relations
- 2 billing and payment relations
- 4 inventory and waste relations
- 4 staff scheduling relations

## 10. SQL Table Creation Order

1. USER
2. CUSTOMER
3. ADMINISTRATOR
4. EMPLOYEE
5. CUSTOMER_PHONE
6. RESTAURANT_MANAGER
7. EVENT_COORDINATOR
8. CHEF
9. CASHIER
10. INVENTORY_MANAGER
11. HR_MANAGER
12. RESTAURANT_STAFF
13. RESTAURANT_TABLE
14. VENUE
15. VENUE_FEATURE
16. PRICING_RULE
17. MENU
18. MENU_ITEM
19. CATERING_PACKAGE
20. PACKAGE_ITEM
21. FAVORITE_PACKAGE
22. VENDOR
23. SUPPLIER
24. INVENTORY_ITEM
25. RESERVATION
26. EVENT_BOOKING
27. CUSTOMER_ORDER
28. ORDER_ITEM
29. EVENT
30. EVENT_SERVICE
31. EVENT_TIMELINE
32. REVIEW
33. INVOICE
34. PAYMENT
35. INVENTORY_USAGE
36. WASTE_RECORD
37. SHIFT
38. ATTENDANCE
39. LEAVE_REQUEST
40. EMPLOYEE_TASK

