USE aurevia_db;

SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 1. USER AND ROLE MANAGEMENT
-- =========================================================

CREATE TABLE user_account (
    user_id INT UNSIGNED AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    street VARCHAR(150),
    city VARCHAR(80),
    province VARCHAR(80),
    postal_code VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,

    CONSTRAINT pk_user_account PRIMARY KEY (user_id),
    CONSTRAINT uq_user_account_email UNIQUE (email)
) ENGINE = InnoDB;


CREATE TABLE customer (
    user_id INT UNSIGNED,

    CONSTRAINT pk_customer PRIMARY KEY (user_id),

    CONSTRAINT fk_customer_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE administrator (
    user_id INT UNSIGNED,

    CONSTRAINT pk_administrator PRIMARY KEY (user_id),

    CONSTRAINT fk_administrator_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE customer_phone (
    user_id INT UNSIGNED,
    phone_number VARCHAR(20),

    CONSTRAINT pk_customer_phone
        PRIMARY KEY (user_id, phone_number),

    CONSTRAINT fk_customer_phone_customer
        FOREIGN KEY (user_id)
        REFERENCES customer(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE employee (
    employee_id INT UNSIGNED AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    employment_status VARCHAR(30) NOT NULL,
    supervisor_id INT UNSIGNED NULL,

    CONSTRAINT pk_employee PRIMARY KEY (employee_id),
    CONSTRAINT uq_employee_user UNIQUE (user_id),
    CONSTRAINT chk_employee_salary CHECK (salary >= 0),

    CONSTRAINT fk_employee_user
        FOREIGN KEY (user_id)
        REFERENCES user_account(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_employee_supervisor
        FOREIGN KEY (supervisor_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE = InnoDB;


CREATE TABLE restaurant_manager (
    employee_id INT UNSIGNED,
    management_area VARCHAR(100) NOT NULL,

    CONSTRAINT pk_restaurant_manager PRIMARY KEY (employee_id),

    CONSTRAINT fk_restaurant_manager_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE event_coordinator (
    employee_id INT UNSIGNED,
    coordination_level VARCHAR(50) NOT NULL,

    CONSTRAINT pk_event_coordinator PRIMARY KEY (employee_id),

    CONSTRAINT fk_event_coordinator_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE chef (
    employee_id INT UNSIGNED,
    specialization VARCHAR(100) NOT NULL,

    CONSTRAINT pk_chef PRIMARY KEY (employee_id),

    CONSTRAINT fk_chef_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE cashier (
    employee_id INT UNSIGNED,
    counter_no VARCHAR(20) NOT NULL,

    CONSTRAINT pk_cashier PRIMARY KEY (employee_id),

    CONSTRAINT fk_cashier_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE inventory_manager (
    employee_id INT UNSIGNED,
    warehouse_area VARCHAR(100) NOT NULL,

    CONSTRAINT pk_inventory_manager PRIMARY KEY (employee_id),

    CONSTRAINT fk_inventory_manager_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE hr_manager (
    employee_id INT UNSIGNED,
    hr_level VARCHAR(50) NOT NULL,

    CONSTRAINT pk_hr_manager PRIMARY KEY (employee_id),

    CONSTRAINT fk_hr_manager_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE restaurant_staff (
    employee_id INT UNSIGNED,
    staff_type VARCHAR(50) NOT NULL,

    CONSTRAINT pk_restaurant_staff PRIMARY KEY (employee_id),

    CONSTRAINT fk_restaurant_staff_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


-- =========================================================
-- 2. TABLE AND VENUE RESERVATION MANAGEMENT
-- =========================================================

CREATE TABLE restaurant_table (
    table_id INT UNSIGNED AUTO_INCREMENT,
    table_number VARCHAR(20) NOT NULL,
    capacity INT UNSIGNED NOT NULL,
    location VARCHAR(100) NOT NULL,
    table_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT pk_restaurant_table
        PRIMARY KEY (table_id),

    CONSTRAINT uq_restaurant_table_number
        UNIQUE (table_number),

    CONSTRAINT chk_restaurant_table_capacity
        CHECK (capacity > 0)
) ENGINE = InnoDB;


CREATE TABLE reservation (
    reservation_id INT UNSIGNED AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    table_id INT UNSIGNED NOT NULL,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    number_of_guests INT UNSIGNED NOT NULL,
    reservation_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_reservation
        PRIMARY KEY (reservation_id),

    CONSTRAINT chk_reservation_guests
        CHECK (number_of_guests > 0),

    CONSTRAINT chk_reservation_time
        CHECK (end_time > start_time),

    CONSTRAINT fk_reservation_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_reservation_table
        FOREIGN KEY (table_id)
        REFERENCES restaurant_table(table_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE venue (
    venue_id INT UNSIGNED AUTO_INCREMENT,
    venue_name VARCHAR(100) NOT NULL,
    availability_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    capacity INT UNSIGNED NOT NULL,
    location VARCHAR(150) NOT NULL,
    venue_type VARCHAR(50) NOT NULL,
    base_price DECIMAL(12,2) NOT NULL,

    CONSTRAINT pk_venue
        PRIMARY KEY (venue_id),

    CONSTRAINT uq_venue_name
        UNIQUE (venue_name),

    CONSTRAINT chk_venue_capacity
        CHECK (capacity > 0),

    CONSTRAINT chk_venue_base_price
        CHECK (base_price >= 0)
) ENGINE = InnoDB;


CREATE TABLE venue_feature (
    venue_id INT UNSIGNED,
    feature_name VARCHAR(100),

    CONSTRAINT pk_venue_feature
        PRIMARY KEY (venue_id, feature_name),

    CONSTRAINT fk_venue_feature_venue
        FOREIGN KEY (venue_id)
        REFERENCES venue(venue_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE event_booking (
    event_booking_id INT UNSIGNED AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    venue_id INT UNSIGNED NOT NULL,
    booking_date DATE NOT NULL,
    guest_count INT UNSIGNED NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    booking_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_event_booking
        PRIMARY KEY (event_booking_id),

    CONSTRAINT chk_event_booking_guests
        CHECK (guest_count > 0),

    CONSTRAINT chk_event_booking_amount
        CHECK (total_amount >= 0),

    CONSTRAINT fk_event_booking_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_event_booking_venue
        FOREIGN KEY (venue_id)
        REFERENCES venue(venue_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE pricing_rule (
    pricing_rule_id INT UNSIGNED AUTO_INCREMENT,
    venue_id INT UNSIGNED NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    surcharge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    price DECIMAL(12,2) NOT NULL,
    approval_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    CONSTRAINT pk_pricing_rule
        PRIMARY KEY (pricing_rule_id),

    CONSTRAINT chk_pricing_rule_dates
        CHECK (end_date >= start_date),

    CONSTRAINT chk_pricing_rule_surcharge
        CHECK (surcharge >= 0),

    CONSTRAINT chk_pricing_rule_price
        CHECK (price >= 0),

    CONSTRAINT fk_pricing_rule_venue
        FOREIGN KEY (venue_id)
        REFERENCES venue(venue_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;

-- =========================================================
-- 3. MENU CUSTOMIZATION AND ORDER MANAGEMENT
-- =========================================================

CREATE TABLE menu (
    menu_id INT UNSIGNED AUTO_INCREMENT,
    menu_name VARCHAR(100) NOT NULL,
    menu_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    description TEXT,

    PRIMARY KEY (menu_id),
    UNIQUE (menu_name)
) ENGINE = InnoDB;


CREATE TABLE menu_item (
    menu_item_id INT UNSIGNED AUTO_INCREMENT,
    menu_id INT UNSIGNED NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    availability_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',

    PRIMARY KEY (menu_item_id),

    CHECK (price >= 0),

    CONSTRAINT fk_menu_item_menu
        FOREIGN KEY (menu_id)
        REFERENCES menu(menu_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE catering_package (
    package_id INT UNSIGNED AUTO_INCREMENT,
    package_name VARCHAR(100) NOT NULL,
    description TEXT,
    package_type VARCHAR(50) NOT NULL,
    base_price DECIMAL(12,2) NOT NULL,
    minimum_guests INT UNSIGNED NOT NULL,
    maximum_guests INT UNSIGNED NOT NULL,

    PRIMARY KEY (package_id),
    UNIQUE (package_name),

    CHECK (base_price >= 0),
    CHECK (minimum_guests > 0),
    CHECK (maximum_guests >= minimum_guests)
) ENGINE = InnoDB;


CREATE TABLE package_item (
    package_id INT UNSIGNED,
    menu_item_id INT UNSIGNED,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,

    PRIMARY KEY (package_id, menu_item_id),

    CHECK (quantity > 0),

    CONSTRAINT fk_package_item_package
        FOREIGN KEY (package_id)
        REFERENCES catering_package(package_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_package_item_menu_item
        FOREIGN KEY (menu_item_id)
        REFERENCES menu_item(menu_item_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE favorite_package (
    favorite_id INT UNSIGNED AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    package_id INT UNSIGNED NOT NULL,
    saved_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(255),

    PRIMARY KEY (favorite_id),

    CONSTRAINT uq_favorite_customer_package
        UNIQUE (customer_id, package_id),

    CONSTRAINT fk_favorite_package_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_favorite_package_package
        FOREIGN KEY (package_id)
        REFERENCES catering_package(package_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE customer_order (
    order_id INT UNSIGNED AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    order_type VARCHAR(50) NOT NULL,
    order_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    PRIMARY KEY (order_id),

    CHECK (total_amount >= 0),

    CONSTRAINT fk_customer_order_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE order_item (
    order_id INT UNSIGNED,
    menu_item_id INT UNSIGNED,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,

    PRIMARY KEY (order_id, menu_item_id),

    CHECK (quantity > 0),
    CHECK (unit_price >= 0),
    CHECK (subtotal >= 0),
    CHECK (subtotal = quantity * unit_price),

    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES customer_order(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_order_item_menu_item
        FOREIGN KEY (menu_item_id)
        REFERENCES menu_item(menu_item_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- =========================================================
-- 4. EVENT COORDINATION AND CUSTOMER FEEDBACK
-- =========================================================

CREATE TABLE events (
    event_id INT UNSIGNED AUTO_INCREMENT,
    event_booking_id INT UNSIGNED NOT NULL,
    coordinator_id INT UNSIGNED NOT NULL,
    event_name VARCHAR(150) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    budget DECIMAL(12,2) NOT NULL,
    number_of_guests INT UNSIGNED NOT NULL,
    event_status VARCHAR(30) NOT NULL DEFAULT 'PLANNED',

    PRIMARY KEY (event_id),

    CONSTRAINT uq_event_booking
        UNIQUE (event_booking_id),

    CHECK (end_time > start_time),
    CHECK (budget >= 0),
    CHECK (number_of_guests > 0),

    CONSTRAINT fk_event_booking
        FOREIGN KEY (event_booking_id)
        REFERENCES event_booking(event_booking_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_event_coordinator
        FOREIGN KEY (coordinator_id)
        REFERENCES event_coordinator(employee_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE vendor (
    vendor_id INT UNSIGNED AUTO_INCREMENT,
    vendor_name VARCHAR(120) NOT NULL,
    vendor_type VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    street VARCHAR(150),
    city VARCHAR(80),
    province VARCHAR(80),
    postal_code VARCHAR(20),

    PRIMARY KEY (vendor_id),
    UNIQUE (email)
) ENGINE = InnoDB;


CREATE TABLE event_service (
    event_service_id INT UNSIGNED AUTO_INCREMENT,
    event_id INT UNSIGNED NOT NULL,
    vendor_id INT UNSIGNED NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    service_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    cost DECIMAL(12,2) NOT NULL,
    service_status VARCHAR(30) NOT NULL DEFAULT 'PLANNED',

    PRIMARY KEY (event_service_id),

    CHECK (end_time > start_time),
    CHECK (cost >= 0),

    CONSTRAINT fk_event_service_event
        FOREIGN KEY (event_id)
        REFERENCES events(event_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_event_service_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendor(vendor_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE event_timeline (
    timeline_id INT UNSIGNED AUTO_INCREMENT,
    event_id INT UNSIGNED NOT NULL,
    milestone_name VARCHAR(150) NOT NULL,
    description TEXT,
    scheduled_date DATETIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (timeline_id),

    CONSTRAINT fk_event_timeline_event
        FOREIGN KEY (event_id)
        REFERENCES events(event_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE review (
    review_id INT UNSIGNED AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    event_id INT UNSIGNED NULL,
    order_id INT UNSIGNED NULL,
    review_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rating INT UNSIGNED NOT NULL,
    comment TEXT,
    sentiment VARCHAR(30) NULL,

    PRIMARY KEY (review_id),

    CONSTRAINT uq_review_customer_event
        UNIQUE (customer_id, event_id),

    CONSTRAINT uq_review_customer_order
        UNIQUE (customer_id, order_id),

    CHECK (rating BETWEEN 1 AND 5),

    CHECK (
        (event_id IS NOT NULL AND order_id IS NULL)
        OR
        (event_id IS NULL AND order_id IS NOT NULL)
    ),

    CONSTRAINT fk_review_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_review_event
        FOREIGN KEY (event_id)
        REFERENCES events(event_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_review_order
        FOREIGN KEY (order_id)
        REFERENCES customer_order(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


-- =========================================================
-- 5. BILLING AND PAYMENT MANAGEMENT
-- =========================================================

CREATE TABLE invoice (
    invoice_id INT UNSIGNED AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    reservation_id INT UNSIGNED NULL,
    event_booking_id INT UNSIGNED NULL,
    order_id INT UNSIGNED NULL,
    invoice_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(12,2) NOT NULL,
    discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    invoice_status VARCHAR(30) NOT NULL DEFAULT 'ISSUED',

    PRIMARY KEY (invoice_id),

    CONSTRAINT uq_invoice_reservation
        UNIQUE (reservation_id),

    CONSTRAINT uq_invoice_event_booking
        UNIQUE (event_booking_id),

    CONSTRAINT uq_invoice_order
        UNIQUE (order_id),

    CHECK (subtotal >= 0),
    CHECK (discount >= 0),
    CHECK (tax_amount >= 0),
    CHECK (total_amount >= 0),

    CHECK (
        total_amount = subtotal - discount + tax_amount
    ),

    CHECK (
        (reservation_id IS NOT NULL)
        + (event_booking_id IS NOT NULL)
        + (order_id IS NOT NULL) = 1
    ),

    CONSTRAINT fk_invoice_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_invoice_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservation(reservation_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_invoice_event_booking
        FOREIGN KEY (event_booking_id)
        REFERENCES event_booking(event_booking_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_invoice_order
        FOREIGN KEY (order_id)
        REFERENCES customer_order(order_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE payment (
    payment_id INT UNSIGNED AUTO_INCREMENT,
    invoice_id INT UNSIGNED NOT NULL,
    verified_by_cashier_id INT UNSIGNED NULL,
    transaction_reference VARCHAR(100) NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    verified_at DATETIME NULL,

    PRIMARY KEY (payment_id),

    CONSTRAINT uq_payment_transaction_reference
        UNIQUE (transaction_reference),

    CHECK (amount > 0),

    CHECK (
        (
            payment_status IN ('APPROVED', 'REJECTED')
            AND verified_by_cashier_id IS NOT NULL
            AND verified_at IS NOT NULL
        )
        OR
        (
            payment_status NOT IN ('APPROVED', 'REJECTED')
            AND verified_by_cashier_id IS NULL
            AND verified_at IS NULL
        )
    ),

    CONSTRAINT fk_payment_invoice
        FOREIGN KEY (invoice_id)
        REFERENCES invoice(invoice_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_payment_cashier
        FOREIGN KEY (verified_by_cashier_id)
        REFERENCES cashier(employee_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;

-- =========================================================
-- 6. INVENTORY AND WASTE MANAGEMENT
-- =========================================================

CREATE TABLE supplier (
    supplier_id INT UNSIGNED AUTO_INCREMENT,
    supplier_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    street VARCHAR(150),
    city VARCHAR(80),
    province VARCHAR(80),
    postal_code VARCHAR(20),

    PRIMARY KEY (supplier_id),
    UNIQUE (email)
) ENGINE = InnoDB;


CREATE TABLE inventory_item (
    inventory_item_id INT UNSIGNED AUTO_INCREMENT,
    supplier_id INT UNSIGNED NOT NULL,
    item_name VARCHAR(120) NOT NULL,
    item_category VARCHAR(50) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    current_quantity DECIMAL(12,3) NOT NULL DEFAULT 0.000,
    reorder_level DECIMAL(12,3) NOT NULL DEFAULT 0.000,
    unit_cost DECIMAL(12,2) NOT NULL,
    expiry_date DATE NULL,

    PRIMARY KEY (inventory_item_id),

    CHECK (current_quantity >= 0),
    CHECK (reorder_level >= 0),
    CHECK (unit_cost >= 0),

    CONSTRAINT fk_inventory_item_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES supplier(supplier_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE inventory_usage (
    usage_id INT UNSIGNED AUTO_INCREMENT,
    inventory_item_id INT UNSIGNED NOT NULL,
    order_id INT UNSIGNED NULL,
    usage_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    quantity_used DECIMAL(12,3) NOT NULL,
    usage_reason VARCHAR(255) NOT NULL,

    PRIMARY KEY (usage_id),

    CHECK (quantity_used > 0),

    CONSTRAINT fk_inventory_usage_item
        FOREIGN KEY (inventory_item_id)
        REFERENCES inventory_item(inventory_item_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_usage_order
        FOREIGN KEY (order_id)
        REFERENCES customer_order(order_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE = InnoDB;


CREATE TABLE waste_record (
    waste_id INT UNSIGNED AUTO_INCREMENT,
    inventory_item_id INT UNSIGNED NOT NULL,
    recorded_by_manager_id INT UNSIGNED NOT NULL,
    waste_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    waste_reason VARCHAR(255) NOT NULL,
    quantity DECIMAL(12,3) NOT NULL,
    estimated_cost DECIMAL(12,2) NOT NULL,

    PRIMARY KEY (waste_id),

    CHECK (quantity > 0),
    CHECK (estimated_cost >= 0),

    CONSTRAINT fk_waste_record_item
        FOREIGN KEY (inventory_item_id)
        REFERENCES inventory_item(inventory_item_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_waste_record_manager
        FOREIGN KEY (recorded_by_manager_id)
        REFERENCES inventory_manager(employee_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;

-- =========================================================
-- 7. STAFF SCHEDULING AND MANAGEMENT
-- =========================================================

CREATE TABLE shift (
    shift_id INT UNSIGNED AUTO_INCREMENT,
    employee_id INT UNSIGNED NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    shift_status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',

    PRIMARY KEY (shift_id),

    CHECK (end_time > start_time),

    CONSTRAINT fk_shift_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE = InnoDB;


CREATE TABLE attendance (
    attendance_id INT UNSIGNED AUTO_INCREMENT,
    employee_id INT UNSIGNED NOT NULL,
    shift_id INT UNSIGNED NULL,
    attendance_date DATE NOT NULL,
    check_in_time TIME NULL,
    check_out_time TIME NULL,
    attendance_status VARCHAR(30) NOT NULL,

    PRIMARY KEY (attendance_id),

    CONSTRAINT uq_attendance_employee_shift
        UNIQUE (employee_id, shift_id),

    CHECK (
        check_out_time IS NULL
        OR check_in_time IS NULL
        OR check_out_time >= check_in_time
    ),

    CONSTRAINT fk_attendance_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_attendance_shift
        FOREIGN KEY (shift_id)
        REFERENCES shift(shift_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE = InnoDB;


CREATE TABLE leave_request (
    leave_request_id INT UNSIGNED AUTO_INCREMENT,
    employee_id INT UNSIGNED NOT NULL,
    reviewed_by_hr_manager_id INT UNSIGNED NULL,
    request_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    request_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    reviewed_date DATETIME NULL,

    PRIMARY KEY (leave_request_id),

    CHECK (end_date >= start_date),

    CHECK (
        (
            request_status IN ('APPROVED', 'REJECTED')
            AND reviewed_by_hr_manager_id IS NOT NULL
            AND reviewed_date IS NOT NULL
        )
        OR
        (
            request_status NOT IN ('APPROVED', 'REJECTED')
            AND reviewed_by_hr_manager_id IS NULL
            AND reviewed_date IS NULL
        )
    ),

    CONSTRAINT fk_leave_request_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_leave_request_hr_manager
        FOREIGN KEY (reviewed_by_hr_manager_id)
        REFERENCES hr_manager(employee_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE employee_task (
    task_id INT UNSIGNED AUTO_INCREMENT,
    employee_id INT UNSIGNED NOT NULL,
    event_id INT UNSIGNED NULL,
    task_description VARCHAR(255) NOT NULL,
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    task_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (task_id),

    CHECK (due_date >= assigned_date),

    CONSTRAINT fk_employee_task_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_employee_task_event
        FOREIGN KEY (event_id)
        REFERENCES events(event_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE = InnoDB;


-- Re-enable foreign key validation after all tables are created.
SET FOREIGN_KEY_CHECKS = 1;
