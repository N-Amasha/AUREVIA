-- =========================================================
-- AUREVIA SAMPLE DATA
-- MariaDB 10.4.32
-- =========================================================

USE aurevia_db;

START TRANSACTION;

-- =========================================================
-- 1. USER AND ROLE SAMPLE DATA
-- =========================================================

-- Customers: user IDs 1–5
-- Administrators: user IDs 6–10
-- Employees: user IDs 11–45

INSERT INTO user_account (
    user_id,
    first_name,
    last_name,
    email,
    registration_date,
    street,
    city,
    province,
    postal_code,
    password_hash
)
VALUES
(1, 'Amaya', 'Perera', 'amaya.customer@aurevia.test', '2026-01-05 09:00:00', '12 Lake Road', 'Colombo', 'Western', '00100', 'sample_hash_001'),
(2, 'Kasun', 'Silva', 'kasun.customer@aurevia.test', '2026-01-06 09:15:00', '25 Temple Road', 'Kandy', 'Central', '20000', 'sample_hash_002'),
(3, 'Nimali', 'Fernando', 'nimali.customer@aurevia.test', '2026-01-07 10:00:00', '48 Main Street', 'Galle', 'Southern', '80000', 'sample_hash_003'),
(4, 'Ravindu', 'Jayasinghe', 'ravindu.customer@aurevia.test', '2026-01-08 11:30:00', '17 Station Road', 'Kurunegala', 'North Western', '60000', 'sample_hash_004'),
(5, 'Tharushi', 'Bandara', 'tharushi.customer@aurevia.test', '2026-01-09 12:00:00', '31 Hill Street', 'Matale', 'Central', '21000', 'sample_hash_005'),

(6, 'Admin', 'One', 'admin1@aurevia.test', '2026-01-01 08:00:00', '1 Aurevia Road', 'Colombo', 'Western', '00100', 'sample_hash_006'),
(7, 'Admin', 'Two', 'admin2@aurevia.test', '2026-01-01 08:05:00', '2 Aurevia Road', 'Colombo', 'Western', '00100', 'sample_hash_007'),
(8, 'Admin', 'Three', 'admin3@aurevia.test', '2026-01-01 08:10:00', '3 Aurevia Road', 'Colombo', 'Western', '00100', 'sample_hash_008'),
(9, 'Admin', 'Four', 'admin4@aurevia.test', '2026-01-01 08:15:00', '4 Aurevia Road', 'Colombo', 'Western', '00100', 'sample_hash_009'),
(10, 'Admin', 'Five', 'admin5@aurevia.test', '2026-01-01 08:20:00', '5 Aurevia Road', 'Colombo', 'Western', '00100', 'sample_hash_010'),

(11, 'Malith', 'Perera', 'manager1@aurevia.test', '2026-01-02 08:00:00', '11 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_011'),
(12, 'Sanduni', 'Silva', 'manager2@aurevia.test', '2026-01-02 08:05:00', '12 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_012'),
(13, 'Dilan', 'Fernando', 'manager3@aurevia.test', '2026-01-02 08:10:00', '13 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_013'),
(14, 'Piumi', 'Bandara', 'manager4@aurevia.test', '2026-01-02 08:15:00', '14 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_014'),
(15, 'Shehan', 'Dias', 'manager5@aurevia.test', '2026-01-02 08:20:00', '15 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_015'),

(16, 'Charuka', 'Perera', 'coordinator1@aurevia.test', '2026-01-02 08:25:00', '16 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_016'),
(17, 'Ishara', 'Silva', 'coordinator2@aurevia.test', '2026-01-02 08:30:00', '17 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_017'),
(18, 'Thilini', 'Fernando', 'coordinator3@aurevia.test', '2026-01-02 08:35:00', '18 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_018'),
(19, 'Sachin', 'Bandara', 'coordinator4@aurevia.test', '2026-01-02 08:40:00', '19 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_019'),
(20, 'Dinithi', 'Dias', 'coordinator5@aurevia.test', '2026-01-02 08:45:00', '20 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_020'),

(21, 'Akila', 'Perera', 'chef1@aurevia.test', '2026-01-02 08:50:00', '21 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_021'),
(22, 'Hansani', 'Silva', 'chef2@aurevia.test', '2026-01-02 08:55:00', '22 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_022'),
(23, 'Nipun', 'Fernando', 'chef3@aurevia.test', '2026-01-02 09:00:00', '23 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_023'),
(24, 'Oshadi', 'Bandara', 'chef4@aurevia.test', '2026-01-02 09:05:00', '24 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_024'),
(25, 'Tharindu', 'Dias', 'chef5@aurevia.test', '2026-01-02 09:10:00', '25 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_025'),

(26, 'Rashmi', 'Perera', 'cashier1@aurevia.test', '2026-01-02 09:15:00', '26 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_026'),
(27, 'Kavindu', 'Silva', 'cashier2@aurevia.test', '2026-01-02 09:20:00', '27 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_027'),
(28, 'Imesha', 'Fernando', 'cashier3@aurevia.test', '2026-01-02 09:25:00', '28 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_028'),
(29, 'Supun', 'Bandara', 'cashier4@aurevia.test', '2026-01-02 09:30:00', '29 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_029'),
(30, 'Anjali', 'Dias', 'cashier5@aurevia.test', '2026-01-02 09:35:00', '30 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_030'),

(31, 'Ahamed', 'Perera', 'inventory1@aurevia.test', '2026-01-02 09:40:00', '31 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_031'),
(32, 'Ruwani', 'Silva', 'inventory2@aurevia.test', '2026-01-02 09:45:00', '32 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_032'),
(33, 'Praveen', 'Fernando', 'inventory3@aurevia.test', '2026-01-02 09:50:00', '33 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_033'),
(34, 'Sajini', 'Bandara', 'inventory4@aurevia.test', '2026-01-02 09:55:00', '34 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_034'),
(35, 'Gihan', 'Dias', 'inventory5@aurevia.test', '2026-01-02 10:00:00', '35 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_035'),

(36, 'Niluminda', 'Perera', 'hr1@aurevia.test', '2026-01-02 10:05:00', '36 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_036'),
(37, 'Gayani', 'Silva', 'hr2@aurevia.test', '2026-01-02 10:10:00', '37 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_037'),
(38, 'Lahiru', 'Fernando', 'hr3@aurevia.test', '2026-01-02 10:15:00', '38 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_038'),
(39, 'Madhavi', 'Bandara', 'hr4@aurevia.test', '2026-01-02 10:20:00', '39 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_039'),
(40, 'Rukshan', 'Dias', 'hr5@aurevia.test', '2026-01-02 10:25:00', '40 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_040'),

(41, 'Bimal', 'Perera', 'staff1@aurevia.test', '2026-01-02 10:30:00', '41 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_041'),
(42, 'Sachini', 'Silva', 'staff2@aurevia.test', '2026-01-02 10:35:00', '42 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_042'),
(43, 'Nadeesha', 'Fernando', 'staff3@aurevia.test', '2026-01-02 10:40:00', '43 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_043'),
(44, 'Isuru', 'Bandara', 'staff4@aurevia.test', '2026-01-02 10:45:00', '44 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_044'),
(45, 'Vihanga', 'Dias', 'staff5@aurevia.test', '2026-01-02 10:50:00', '45 Staff Lane', 'Colombo', 'Western', '00100', 'sample_hash_045');


INSERT INTO customer (user_id)
VALUES (1), (2), (3), (4), (5);


INSERT INTO administrator (user_id)
VALUES (6), (7), (8), (9), (10);


INSERT INTO customer_phone (user_id, phone_number)
VALUES
(1, '0711111111'),
(2, '0722222222'),
(3, '0753333333'),
(4, '0764444444'),
(5, '0775555555');


INSERT INTO employee (
    employee_id,
    user_id,
    hire_date,
    salary,
    employment_status,
    supervisor_id
)
VALUES
(1, 11, '2024-01-10', 180000.00, 'ACTIVE', NULL),
(2, 12, '2024-02-15', 175000.00, 'ACTIVE', 1),
(3, 13, '2024-03-20', 170000.00, 'ACTIVE', 1),
(4, 14, '2024-04-25', 165000.00, 'ACTIVE', 1),
(5, 15, '2024-05-30', 160000.00, 'ACTIVE', 1),

(6, 16, '2024-06-01', 140000.00, 'ACTIVE', 1),
(7, 17, '2024-06-05', 138000.00, 'ACTIVE', 1),
(8, 18, '2024-06-10', 136000.00, 'ACTIVE', 1),
(9, 19, '2024-06-15', 134000.00, 'ACTIVE', 1),
(10, 20, '2024-06-20', 132000.00, 'ACTIVE', 1),

(11, 21, '2024-07-01', 125000.00, 'ACTIVE', 2),
(12, 22, '2024-07-05', 120000.00, 'ACTIVE', 2),
(13, 23, '2024-07-10', 118000.00, 'ACTIVE', 2),
(14, 24, '2024-07-15', 116000.00, 'ACTIVE', 2),
(15, 25, '2024-07-20', 114000.00, 'ACTIVE', 2),

(16, 26, '2024-08-01', 95000.00, 'ACTIVE', 3),
(17, 27, '2024-08-05', 93000.00, 'ACTIVE', 3),
(18, 28, '2024-08-10', 91000.00, 'ACTIVE', 3),
(19, 29, '2024-08-15', 89000.00, 'ACTIVE', 3),
(20, 30, '2024-08-20', 87000.00, 'ACTIVE', 3),

(21, 31, '2024-09-01', 115000.00, 'ACTIVE', 4),
(22, 32, '2024-09-05', 112000.00, 'ACTIVE', 4),
(23, 33, '2024-09-10', 109000.00, 'ACTIVE', 4),
(24, 34, '2024-09-15', 106000.00, 'ACTIVE', 4),
(25, 35, '2024-09-20', 103000.00, 'ACTIVE', 4),

(26, 36, '2024-10-01', 120000.00, 'ACTIVE', 5),
(27, 37, '2024-10-05', 117000.00, 'ACTIVE', 5),
(28, 38, '2024-10-10', 114000.00, 'ACTIVE', 5),
(29, 39, '2024-10-15', 111000.00, 'ACTIVE', 5),
(30, 40, '2024-10-20', 108000.00, 'ACTIVE', 5),

(31, 41, '2025-01-05', 75000.00, 'ACTIVE', 1),
(32, 42, '2025-01-10', 73000.00, 'ACTIVE', 2),
(33, 43, '2025-01-15', 71000.00, 'ACTIVE', 3),
(34, 44, '2025-01-20', 69000.00, 'ACTIVE', 4),
(35, 45, '2025-01-25', 67000.00, 'ACTIVE', 5);


INSERT INTO restaurant_manager (employee_id, management_area)
VALUES
(1, 'Main Restaurant'),
(2, 'Private Dining'),
(3, 'Customer Service'),
(4, 'Operations'),
(5, 'Banquet Operations');


INSERT INTO event_coordinator (employee_id, coordination_level)
VALUES
(6, 'Senior'),
(7, 'Senior'),
(8, 'Intermediate'),
(9, 'Intermediate'),
(10, 'Junior');


INSERT INTO chef (employee_id, specialization)
VALUES
(11, 'Sri Lankan Cuisine'),
(12, 'Italian Cuisine'),
(13, 'Pastry and Desserts'),
(14, 'Seafood'),
(15, 'Vegetarian Cuisine');


INSERT INTO cashier (employee_id, counter_no)
VALUES
(16, 'C01'),
(17, 'C02'),
(18, 'C03'),
(19, 'C04'),
(20, 'C05');


INSERT INTO inventory_manager (employee_id, warehouse_area)
VALUES
(21, 'Dry Storage'),
(22, 'Cold Storage'),
(23, 'Beverage Storage'),
(24, 'Kitchen Supplies'),
(25, 'Event Supplies');


INSERT INTO hr_manager (employee_id, hr_level)
VALUES
(26, 'Senior'),
(27, 'Senior'),
(28, 'Intermediate'),
(29, 'Intermediate'),
(30, 'Junior');


INSERT INTO restaurant_staff (employee_id, staff_type)
VALUES
(31, 'Waiter'),
(32, 'Waitress'),
(33, 'Host'),
(34, 'Kitchen Assistant'),
(35, 'Event Assistant');

COMMIT;

-- =========================================================
-- 2. TABLE AND VENUE RESERVATION SAMPLE DATA
-- =========================================================

START TRANSACTION;

INSERT INTO restaurant_table (
    table_id,
    table_number,
    capacity,
    location,
    table_status
)
VALUES
(1, 'T01', 2, 'Window Area', 'AVAILABLE'),
(2, 'T02', 4, 'Main Dining Area', 'AVAILABLE'),
(3, 'T03', 6, 'Garden Area', 'AVAILABLE'),
(4, 'T04', 8, 'Private Dining Area', 'AVAILABLE'),
(5, 'T05', 10, 'Terrace Area', 'MAINTENANCE');


INSERT INTO reservation (
    reservation_id,
    customer_id,
    table_id,
    reservation_date,
    start_time,
    end_time,
    number_of_guests,
    reservation_status,
    created_at
)
VALUES
(1, 1, 1, '2026-10-05', '18:00:00', '20:00:00', 2, 'CONFIRMED', '2026-09-20 09:00:00'),
(2, 2, 2, '2026-10-06', '19:00:00', '21:00:00', 4, 'CONFIRMED', '2026-09-20 09:30:00'),
(3, 3, 3, '2026-10-07', '17:30:00', '20:30:00', 6, 'PENDING', '2026-09-20 10:00:00'),
(4, 4, 4, '2026-10-08', '18:30:00', '21:30:00', 8, 'CONFIRMED', '2026-09-20 10:30:00'),
(5, 5, 2, '2026-10-09', '12:00:00', '14:00:00', 3, 'COMPLETED', '2026-09-20 11:00:00');


INSERT INTO venue (
    venue_id,
    venue_name,
    availability_status,
    capacity,
    location,
    venue_type,
    base_price
)
VALUES
(1, 'Grand Ballroom', 'AVAILABLE', 500, 'Ground Floor', 'BALLROOM', 250000.00),
(2, 'Garden Pavilion', 'AVAILABLE', 200, 'Outdoor Garden', 'OUTDOOR', 150000.00),
(3, 'Executive Hall', 'AVAILABLE', 100, 'First Floor', 'CONFERENCE', 90000.00),
(4, 'Rooftop Terrace', 'AVAILABLE', 150, 'Rooftop', 'TERRACE', 120000.00),
(5, 'Private Banquet Hall', 'AVAILABLE', 80, 'Second Floor', 'BANQUET', 75000.00);


INSERT INTO venue_feature (
    venue_id,
    feature_name
)
VALUES
(1, 'Air Conditioning'),
(1, 'Professional Sound System'),
(2, 'Outdoor Stage'),
(3, 'Projector and Screen'),
(4, 'City View'),
(5, 'Private Entrance');


INSERT INTO event_booking (
    event_booking_id,
    customer_id,
    venue_id,
    booking_date,
    guest_count,
    total_amount,
    booking_status,
    created_at
)
VALUES
(1, 1, 1, '2026-11-10', 300, 350000.00, 'CONFIRMED', '2026-09-21 09:00:00'),
(2, 2, 2, '2026-11-15', 150, 210000.00, 'CONFIRMED', '2026-09-21 09:30:00'),
(3, 3, 3, '2026-11-20', 80, 125000.00, 'CONFIRMED', '2026-09-21 10:00:00'),
(4, 4, 4, '2026-11-25', 120, 180000.00, 'CONFIRMED', '2026-09-21 10:30:00'),
(5, 5, 5, '2026-11-30', 60, 100000.00, 'CONFIRMED', '2026-09-21 11:00:00');


INSERT INTO pricing_rule (
    pricing_rule_id,
    venue_id,
    rule_name,
    start_date,
    end_date,
    surcharge,
    price,
    approval_status
)
VALUES
(1, 1, 'Wedding Season Rate', '2026-11-01', '2026-12-31', 50000.00, 300000.00, 'APPROVED'),
(2, 2, 'Weekend Garden Rate', '2026-10-01', '2026-12-31', 25000.00, 175000.00, 'APPROVED'),
(3, 3, 'Corporate Weekday Rate', '2026-10-01', '2026-12-31', 10000.00, 100000.00, 'APPROVED'),
(4, 4, 'Holiday Terrace Rate', '2026-12-01', '2026-12-31', 30000.00, 150000.00, 'PENDING'),
(5, 5, 'Small Event Rate', '2026-10-01', '2027-03-31', 5000.00, 80000.00, 'APPROVED');

COMMIT;

-- =========================================================
-- 3. MENU CUSTOMIZATION AND ORDER SAMPLE DATA
-- =========================================================

START TRANSACTION;

INSERT INTO menu (
    menu_id,
    menu_name,
    menu_type,
    status,
    description
)
VALUES
(1, 'Fine Dining Menu', 'DINE_IN', 'ACTIVE', 'Premium à la carte dining menu'),
(2, 'Sri Lankan Menu', 'TRADITIONAL', 'ACTIVE', 'Traditional Sri Lankan dishes'),
(3, 'Italian Menu', 'INTERNATIONAL', 'ACTIVE', 'Italian main courses and desserts'),
(4, 'Event Catering Menu', 'CATERING', 'ACTIVE', 'Food selection for private events'),
(5, 'Beverage Menu', 'BEVERAGE', 'ACTIVE', 'Hot and cold beverages');


INSERT INTO menu_item (
    menu_item_id,
    menu_id,
    item_name,
    category,
    description,
    price,
    availability_status
)
VALUES
(1, 1, 'Grilled Chicken Supreme', 'MAIN_COURSE', 'Grilled chicken with herb sauce', 2500.00, 'AVAILABLE'),
(2, 1, 'Beef Tenderloin', 'MAIN_COURSE', 'Premium beef with roasted vegetables', 3200.00, 'AVAILABLE'),
(3, 2, 'Sri Lankan Rice and Curry', 'MAIN_COURSE', 'Rice with five traditional curries', 2800.00, 'AVAILABLE'),
(4, 2, 'Seafood Kottu', 'MAIN_COURSE', 'Kottu prepared with mixed seafood', 3500.00, 'AVAILABLE'),
(5, 3, 'Seafood Pasta', 'MAIN_COURSE', 'Italian pasta with prawns and calamari', 4200.00, 'AVAILABLE'),
(6, 3, 'Classic Tiramisu', 'DESSERT', 'Traditional Italian coffee dessert', 1800.00, 'AVAILABLE'),
(7, 4, 'Event Chicken Platter', 'CATERING', 'Chicken platter for event guests', 5500.00, 'AVAILABLE'),
(8, 4, 'Vegetable Spring Rolls', 'STARTER', 'Crispy vegetable spring rolls', 1200.00, 'AVAILABLE'),
(9, 5, 'Fresh Lime Juice', 'COLD_BEVERAGE', 'Fresh lime juice', 900.00, 'AVAILABLE'),
(10, 5, 'Ceylon Tea Selection', 'HOT_BEVERAGE', 'Selection of premium Ceylon teas', 1500.00, 'AVAILABLE');


INSERT INTO catering_package (
    package_id,
    package_name,
    description,
    package_type,
    base_price,
    minimum_guests,
    maximum_guests
)
VALUES
(1, 'Silver Wedding Package', 'Essential wedding catering package', 'WEDDING', 150000.00, 50, 150),
(2, 'Gold Wedding Package', 'Premium wedding catering package', 'WEDDING', 280000.00, 100, 300),
(3, 'Corporate Lunch Package', 'Lunch package for corporate events', 'CORPORATE', 90000.00, 30, 100),
(4, 'Birthday Celebration Package', 'Food package for birthday celebrations', 'BIRTHDAY', 75000.00, 20, 80),
(5, 'Vegetarian Event Package', 'Complete vegetarian catering package', 'VEGETARIAN', 120000.00, 40, 150);


INSERT INTO package_item (
    package_id,
    menu_item_id,
    quantity
)
VALUES
(1, 1, 50),
(1, 8, 100),
(2, 2, 100),
(2, 6, 100),
(3, 3, 40),
(3, 9, 50),
(4, 4, 25),
(4, 10, 30),
(5, 3, 50),
(5, 8, 100);


INSERT INTO favorite_package (
    favorite_id,
    customer_id,
    package_id,
    saved_date,
    notes
)
VALUES
(1, 1, 2, '2026-09-15 10:00:00', 'Preferred wedding package'),
(2, 2, 3, '2026-09-15 10:30:00', 'Suitable for company events'),
(3, 3, 5, '2026-09-15 11:00:00', 'Vegetarian option required'),
(4, 4, 4, '2026-09-15 11:30:00', 'Saved for birthday celebration'),
(5, 5, 1, '2026-09-15 12:00:00', 'Affordable wedding option');


INSERT INTO customer_order (
    order_id,
    customer_id,
    order_date,
    order_type,
    order_status,
    total_amount
)
VALUES
(1, 1, '2026-09-18 18:00:00', 'DINE_IN', 'COMPLETED', 6800.00),
(2, 2, '2026-09-18 18:30:00', 'DINE_IN', 'COMPLETED', 12800.00),
(3, 3, '2026-09-18 19:00:00', 'TAKEAWAY', 'COMPLETED', 10800.00),
(4, 4, '2026-09-18 19:30:00', 'DINE_IN', 'CONFIRMED', 10600.00),
(5, 5, '2026-09-18 20:00:00', 'TAKEAWAY', 'CONFIRMED', 7200.00);


INSERT INTO order_item (
    order_id,
    menu_item_id,
    quantity,
    unit_price,
    subtotal
)
VALUES
(1, 1, 2, 2500.00, 5000.00),
(1, 6, 1, 1800.00, 1800.00),

(2, 2, 4, 3200.00, 12800.00),

(3, 3, 3, 2800.00, 8400.00),
(3, 8, 2, 1200.00, 2400.00),

(4, 4, 2, 3500.00, 7000.00),
(4, 9, 4, 900.00, 3600.00),

(5, 5, 1, 4200.00, 4200.00),
(5, 10, 2, 1500.00, 3000.00);

COMMIT;

-- =========================================================
-- 4. EVENT COORDINATION AND REVIEW SAMPLE DATA
-- =========================================================

START TRANSACTION;

INSERT INTO events (
    event_id,
    event_booking_id,
    coordinator_id,
    event_name,
    event_type,
    event_date,
    start_time,
    end_time,
    budget,
    number_of_guests,
    event_status
)
VALUES
(1, 1, 6, 'Perera Wedding Reception', 'WEDDING', '2026-11-10', '17:00:00', '23:00:00', 500000.00, 300, 'COMPLETED'),
(2, 2, 7, 'Silva Garden Celebration', 'BIRTHDAY', '2026-11-15', '16:00:00', '22:00:00', 250000.00, 150, 'COMPLETED'),
(3, 3, 8, 'Fernando Technology Conference', 'CORPORATE', '2026-11-20', '09:00:00', '17:00:00', 175000.00, 80, 'COMPLETED'),
(4, 4, 9, 'Jayasinghe Rooftop Dinner', 'PRIVATE_DINNER', '2026-11-25', '18:00:00', '23:00:00', 220000.00, 120, 'PLANNED'),
(5, 5, 10, 'Bandara Family Banquet', 'FAMILY_EVENT', '2026-11-30', '17:30:00', '22:30:00', 150000.00, 60, 'CONFIRMED');


INSERT INTO vendor (
    vendor_id,
    vendor_name,
    vendor_type,
    email,
    contact_number,
    street,
    city,
    province,
    postal_code
)
VALUES
(1, 'Elegant Floral Designs', 'FLORAL', 'contact@elegantfloral.test', '0711001001', '10 Flower Road', 'Colombo', 'Western', '00500'),
(2, 'Crystal Sound Systems', 'AUDIO_VISUAL', 'contact@crystalsound.test', '0711001002', '22 Music Lane', 'Colombo', 'Western', '00600'),
(3, 'Golden Frame Photography', 'PHOTOGRAPHY', 'contact@goldenframe.test', '0711001003', '15 Camera Street', 'Kandy', 'Central', '20000'),
(4, 'Celebration Decorations', 'DECORATION', 'contact@celebrationdecor.test', '0711001004', '30 Party Road', 'Galle', 'Southern', '80000'),
(5, 'Harmony Entertainment', 'ENTERTAINMENT', 'contact@harmony.test', '0711001005', '18 Stage Avenue', 'Colombo', 'Western', '00700');


INSERT INTO event_service (
    event_service_id,
    event_id,
    vendor_id,
    service_name,
    service_date,
    start_time,
    end_time,
    cost,
    service_status
)
VALUES
(1, 1, 1, 'Wedding Floral Decoration', '2026-11-10', '09:00:00', '16:00:00', 75000.00, 'COMPLETED'),
(2, 1, 2, 'Wedding Sound and Lighting', '2026-11-10', '12:00:00', '23:00:00', 85000.00, 'COMPLETED'),
(3, 2, 3, 'Birthday Photography', '2026-11-15', '16:00:00', '22:00:00', 45000.00, 'COMPLETED'),
(4, 3, 4, 'Conference Stage Decoration', '2026-11-20', '06:00:00', '18:00:00', 55000.00, 'COMPLETED'),
(5, 5, 5, 'Live Band Performance', '2026-11-30', '18:00:00', '22:00:00', 65000.00, 'CONFIRMED');


INSERT INTO event_timeline (
    timeline_id,
    event_id,
    milestone_name,
    description,
    scheduled_date,
    status,
    updated_date
)
VALUES
(1, 1, 'Venue Decoration', 'Complete ballroom decoration', '2026-11-10 09:00:00', 'COMPLETED', '2026-11-10 16:00:00'),
(2, 2, 'Birthday Cake Delivery', 'Receive and inspect birthday cake', '2026-11-15 14:00:00', 'COMPLETED', '2026-11-15 14:15:00'),
(3, 3, 'Conference Registration', 'Open guest registration desk', '2026-11-20 08:00:00', 'COMPLETED', '2026-11-20 08:10:00'),
(4, 4, 'Terrace Setup', 'Arrange rooftop tables and lighting', '2026-11-25 14:00:00', 'PENDING', '2026-09-21 12:00:00'),
(5, 5, 'Band Sound Check', 'Complete sound check before banquet', '2026-11-30 16:00:00', 'PENDING', '2026-09-21 12:30:00');


INSERT INTO review (
    review_id,
    customer_id,
    event_id,
    order_id,
    review_date,
    rating,
    comment,
    sentiment
)
VALUES
(1, 1, 1, NULL, '2026-11-11 10:00:00', 5, 'The wedding coordination was excellent.', 'POSITIVE'),
(2, 2, 2, NULL, '2026-11-16 11:00:00', 4, 'The garden event was beautiful and well organized.', 'POSITIVE'),
(3, 3, 3, NULL, '2026-11-21 09:00:00', 5, 'The conference facilities and service were excellent.', 'POSITIVE'),
(4, 1, NULL, 1, '2026-09-19 10:00:00', 4, 'The meal was delicious and served quickly.', 'POSITIVE'),
(5, 2, NULL, 2, '2026-09-19 10:30:00', 3, 'The food was good but the waiting time was long.', NULL);

COMMIT;

-- =========================================================
-- 5. BILLING AND PAYMENT SAMPLE DATA
-- =========================================================

START TRANSACTION;

INSERT INTO invoice (
    invoice_id,
    customer_id,
    reservation_id,
    event_booking_id,
    order_id,
    invoice_date,
    subtotal,
    discount,
    tax_amount,
    total_amount,
    invoice_status
)
VALUES
(1, 1, 1, NULL, NULL, '2026-09-20 12:00:00', 5000.00, 500.00, 500.00, 5000.00, 'PAID'),

(2, 2, NULL, 2, NULL, '2026-09-21 12:00:00', 210000.00, 10000.00, 16800.00, 216800.00, 'PARTIALLY_PAID'),

(3, 3, NULL, NULL, 3, '2026-09-18 19:15:00', 10800.00, 800.00, 800.00, 10800.00, 'PAID'),

(4, 4, 4, NULL, NULL, '2026-09-20 12:30:00', 12000.00, 1000.00, 1100.00, 12100.00, 'ISSUED'),

(5, 5, NULL, 5, NULL, '2026-09-21 12:30:00', 100000.00, 5000.00, 7600.00, 102600.00, 'ISSUED');


INSERT INTO payment (
    payment_id,
    invoice_id,
    verified_by_cashier_id,
    transaction_reference,
    payment_type,
    payment_date,
    amount,
    payment_method,
    payment_status,
    verified_at
)
VALUES
(1, 1, 16, 'AUR-PAY-2026-001', 'FULL_PAYMENT', '2026-09-20 13:00:00', 5000.00, 'BANK_TRANSFER', 'APPROVED', '2026-09-20 14:00:00'),

(2, 2, 17, 'AUR-PAY-2026-002', 'ADVANCE_PAYMENT', '2026-09-21 13:00:00', 100000.00, 'BANK_TRANSFER', 'APPROVED', '2026-09-21 14:00:00'),

(3, 3, 18, 'AUR-PAY-2026-003', 'FULL_PAYMENT', '2026-09-18 19:30:00', 10800.00, 'CASH', 'APPROVED', '2026-09-18 19:35:00'),

(4, 4, NULL, 'AUR-PAY-2026-004', 'FULL_PAYMENT', '2026-09-20 13:30:00', 12100.00, 'BANK_TRANSFER', 'PENDING', NULL),

(5, 5, 20, 'AUR-PAY-2026-005', 'ADVANCE_PAYMENT', '2026-09-21 13:30:00', 50000.00, 'BANK_TRANSFER', 'REJECTED', '2026-09-21 15:00:00');

COMMIT;

-- =========================================================
-- 6. INVENTORY AND WASTE SAMPLE DATA
-- =========================================================

START TRANSACTION;

INSERT INTO supplier (
    supplier_id,
    supplier_name,
    email,
    contact_number,
    street,
    city,
    province,
    postal_code
)
VALUES
(1, 'Lanka Fresh Foods', 'sales@lankafresh.test', '0712001001', '10 Market Road', 'Colombo', 'Western', '00100'),
(2, 'Central Meat Suppliers', 'sales@centralmeat.test', '0712001002', '25 Butcher Street', 'Kandy', 'Central', '20000'),
(3, 'Southern Vegetable Farms', 'sales@southernvegetables.test', '0712001003', '18 Farm Road', 'Galle', 'Southern', '80000'),
(4, 'Ceylon Dairy Products', 'sales@ceylondairy.test', '0712001004', '42 Dairy Lane', 'Nuwara Eliya', 'Central', '22200'),
(5, 'Island Beverage Distributors', 'sales@islandbeverage.test', '0712001005', '30 Distribution Road', 'Colombo', 'Western', '00500');


INSERT INTO inventory_item (
    inventory_item_id,
    supplier_id,
    item_name,
    item_category,
    unit,
    current_quantity,
    reorder_level,
    unit_cost,
    expiry_date
)
VALUES
(1, 1, 'Basmati Rice', 'DRY_GOODS', 'KG', 150.000, 50.000, 450.00, '2027-06-30'),
(2, 2, 'Fresh Chicken', 'MEAT', 'KG', 80.000, 25.000, 1800.00, '2026-10-15'),
(3, 3, 'Mixed Vegetables', 'VEGETABLE', 'KG', 60.000, 20.000, 650.00, '2026-10-05'),
(4, 4, 'Fresh Milk', 'DAIRY', 'LITRE', 40.000, 15.000, 600.00, '2026-10-02'),
(5, 5, 'Orange Juice', 'BEVERAGE', 'LITRE', 55.000, 20.000, 900.00, '2026-12-31');


INSERT INTO inventory_usage (
    usage_id,
    inventory_item_id,
    order_id,
    usage_date,
    quantity_used,
    usage_reason
)
VALUES
(1, 1, 1, '2026-09-18 17:00:00', 4.000, 'Rice used for customer order 1'),
(2, 2, 2, '2026-09-18 17:30:00', 8.000, 'Chicken used for customer order 2'),
(3, 3, 3, '2026-09-18 18:00:00', 6.000, 'Vegetables used for customer order 3'),
(4, 4, NULL, '2026-09-18 08:00:00', 2.000, 'Milk used for kitchen quality testing'),
(5, 5, 5, '2026-09-18 19:00:00', 3.000, 'Juice used for customer order 5');


INSERT INTO waste_record (
    waste_id,
    inventory_item_id,
    recorded_by_manager_id,
    waste_date,
    waste_reason,
    quantity,
    estimated_cost
)
VALUES
(1, 1, 21, '2026-09-19 09:00:00', 'Damaged storage package', 5.000, 2250.00),
(2, 2, 22, '2026-09-19 09:30:00', 'Temperature control issue', 2.000, 3600.00),
(3, 3, 23, '2026-09-19 10:00:00', 'Vegetables passed quality inspection limit', 3.000, 1950.00),
(4, 4, 24, '2026-09-19 10:30:00', 'Milk reached expiry date', 4.000, 2400.00),
(5, 5, 25, '2026-09-19 11:00:00', 'Bottle damaged during handling', 1.500, 1350.00);

COMMIT;

-- =========================================================
-- 7. STAFF SCHEDULING AND MANAGEMENT SAMPLE DATA
-- =========================================================

START TRANSACTION;

INSERT INTO shift (
    shift_id,
    employee_id,
    shift_date,
    start_time,
    end_time,
    shift_status
)
VALUES
(1, 31, '2026-10-01', '08:00:00', '16:00:00', 'COMPLETED'),
(2, 32, '2026-10-01', '10:00:00', '18:00:00', 'COMPLETED'),
(3, 33, '2026-10-02', '08:00:00', '16:00:00', 'SCHEDULED'),
(4, 34, '2026-10-02', '14:00:00', '22:00:00', 'SCHEDULED'),
(5, 35, '2026-10-03', '16:00:00', '23:00:00', 'SCHEDULED');


INSERT INTO attendance (
    attendance_id,
    employee_id,
    shift_id,
    attendance_date,
    check_in_time,
    check_out_time,
    attendance_status
)
VALUES
(1, 31, 1, '2026-10-01', '07:55:00', '16:05:00', 'PRESENT'),
(2, 32, 2, '2026-10-01', '10:10:00', '18:00:00', 'LATE'),
(3, 33, 3, '2026-10-02', '08:00:00', '16:00:00', 'PRESENT'),
(4, 34, 4, '2026-10-02', NULL, NULL, 'ABSENT'),
(5, 35, 5, '2026-10-03', '15:55:00', '23:00:00', 'PRESENT');


INSERT INTO leave_request (
    leave_request_id,
    employee_id,
    reviewed_by_hr_manager_id,
    request_date,
    start_date,
    end_date,
    leave_type,
    reason,
    request_status,
    reviewed_date
)
VALUES
(1, 11, 26, '2026-09-20 09:00:00', '2026-10-10', '2026-10-12', 'ANNUAL', 'Family commitment', 'APPROVED', '2026-09-21 09:00:00'),

(2, 12, 27, '2026-09-20 09:30:00', '2026-10-15', '2026-10-16', 'CASUAL', 'Personal matter', 'REJECTED', '2026-09-21 09:30:00'),

(3, 13, NULL, '2026-09-20 10:00:00', '2026-10-20', '2026-10-22', 'MEDICAL', 'Medical treatment', 'PENDING', NULL),

(4, 14, 29, '2026-09-20 10:30:00', '2026-11-01', '2026-11-05', 'ANNUAL', 'Planned vacation', 'APPROVED', '2026-09-21 10:30:00'),

(5, 15, NULL, '2026-09-20 11:00:00', '2026-11-10', '2026-11-10', 'CASUAL', 'Personal appointment', 'PENDING', NULL);


INSERT INTO employee_task (
    task_id,
    employee_id,
    event_id,
    task_description,
    assigned_date,
    due_date,
    task_status
)
VALUES
(1, 31, 1, 'Arrange guest dining tables for the wedding reception', '2026-11-08', '2026-11-10', 'COMPLETED'),
(2, 32, 2, 'Prepare the garden guest reception area', '2026-11-13', '2026-11-15', 'COMPLETED'),
(3, 33, 3, 'Manage the conference registration desk', '2026-11-18', '2026-11-20', 'COMPLETED'),
(4, 34, 4, 'Assist the chef with rooftop dinner preparation', '2026-11-23', '2026-11-25', 'PENDING'),
(5, 35, NULL, 'Perform weekly restaurant equipment inspection', '2026-09-22', '2026-09-25', 'IN_PROGRESS');

COMMIT;