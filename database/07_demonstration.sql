-- ============================================================
-- AUREVIA DATABASE FINAL DEMONSTRATION
-- Compatible with MariaDB 10.4.32
-- ============================================================

USE aurevia_db;

-- ============================================================
-- 1. DATABASE ENVIRONMENT VALIDATION
-- ============================================================

SELECT DATABASE() AS active_database;

SELECT VERSION() AS database_version;

SELECT @@FOREIGN_KEY_CHECKS AS foreign_key_checking;

-- Expected:
-- active_database = aurevia_db
-- foreign_key_checking = 1


-- ============================================================
-- 2. TABLE COUNT VALIDATION
-- ============================================================

SELECT COUNT(*) AS total_table_count
FROM information_schema.tables
WHERE table_schema = 'aurevia_db'
  AND table_type = 'BASE TABLE';

-- Expected: 40 tables


-- ============================================================
-- 3. STORAGE ENGINE VALIDATION
-- ============================================================

SELECT
    engine,
    COUNT(*) AS table_count
FROM information_schema.tables
WHERE table_schema = 'aurevia_db'
  AND table_type = 'BASE TABLE'
GROUP BY engine;

-- Expected:
-- engine = InnoDB
-- table_count = 40


-- Show any table that is not using InnoDB.
SELECT
    table_name,
    engine
FROM information_schema.tables
WHERE table_schema = 'aurevia_db'
  AND table_type = 'BASE TABLE'
  AND engine <> 'InnoDB';

-- Expected: 0 rows


-- ============================================================
-- 4. DATABASE OBJECT VALIDATION
-- ============================================================

-- Stored procedure and stored function
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'aurevia_db'
ORDER BY routine_type, routine_name;

-- Expected:
-- fn_invoice_remaining_balance              FUNCTION
-- sp_get_customer_reservation_history       PROCEDURE


-- Trigger
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'aurevia_db';

-- Expected:
-- trg_inventory_usage_before_insert
-- INSERT
-- inventory_usage
-- BEFORE


-- ============================================================
-- 5. FOREIGN KEY VALIDATION
-- ============================================================

SELECT COUNT(*) AS foreign_key_count
FROM information_schema.table_constraints
WHERE constraint_schema = 'aurevia_db'
  AND constraint_type = 'FOREIGN KEY';

-- The result must be greater than 0. (52)

-- ============================================================
-- 6. SAMPLE DATA VALIDATION FOR ALL 40 TABLES
-- ============================================================

SELECT 'user_account' AS table_name, COUNT(*) AS record_count
FROM user_account
UNION ALL
SELECT 'customer', COUNT(*) FROM customer
UNION ALL
SELECT 'administrator', COUNT(*) FROM administrator
UNION ALL
SELECT 'customer_phone', COUNT(*) FROM customer_phone
UNION ALL
SELECT 'employee', COUNT(*) FROM employee
UNION ALL
SELECT 'restaurant_manager', COUNT(*) FROM restaurant_manager
UNION ALL
SELECT 'event_coordinator', COUNT(*) FROM event_coordinator
UNION ALL
SELECT 'chef', COUNT(*) FROM chef
UNION ALL
SELECT 'cashier', COUNT(*) FROM cashier
UNION ALL
SELECT 'inventory_manager', COUNT(*) FROM inventory_manager
UNION ALL
SELECT 'hr_manager', COUNT(*) FROM hr_manager
UNION ALL
SELECT 'restaurant_staff', COUNT(*) FROM restaurant_staff

UNION ALL

SELECT 'restaurant_table', COUNT(*) FROM restaurant_table
UNION ALL
SELECT 'reservation', COUNT(*) FROM reservation
UNION ALL
SELECT 'venue', COUNT(*) FROM venue
UNION ALL
SELECT 'venue_feature', COUNT(*) FROM venue_feature
UNION ALL
SELECT 'event_booking', COUNT(*) FROM event_booking
UNION ALL
SELECT 'pricing_rule', COUNT(*) FROM pricing_rule

UNION ALL

SELECT 'menu', COUNT(*) FROM menu
UNION ALL
SELECT 'menu_item', COUNT(*) FROM menu_item
UNION ALL
SELECT 'catering_package', COUNT(*) FROM catering_package
UNION ALL
SELECT 'package_item', COUNT(*) FROM package_item
UNION ALL
SELECT 'favorite_package', COUNT(*) FROM favorite_package
UNION ALL
SELECT 'customer_order', COUNT(*) FROM customer_order
UNION ALL
SELECT 'order_item', COUNT(*) FROM order_item

UNION ALL

SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'vendor', COUNT(*) FROM vendor
UNION ALL
SELECT 'event_service', COUNT(*) FROM event_service
UNION ALL
SELECT 'event_timeline', COUNT(*) FROM event_timeline
UNION ALL
SELECT 'review', COUNT(*) FROM review

UNION ALL

SELECT 'invoice', COUNT(*) FROM invoice
UNION ALL
SELECT 'payment', COUNT(*) FROM payment

UNION ALL

SELECT 'supplier', COUNT(*) FROM supplier
UNION ALL
SELECT 'inventory_item', COUNT(*) FROM inventory_item
UNION ALL
SELECT 'inventory_usage', COUNT(*) FROM inventory_usage
UNION ALL
SELECT 'waste_record', COUNT(*) FROM waste_record

UNION ALL

SELECT 'shift', COUNT(*) FROM shift
UNION ALL
SELECT 'attendance', COUNT(*) FROM attendance
UNION ALL
SELECT 'leave_request', COUNT(*) FROM leave_request
UNION ALL
SELECT 'employee_task', COUNT(*) FROM employee_task;

-- ============================================================
-- 7. EMPTY TABLE CHECK
-- ============================================================

SELECT
    table_name,
    table_rows AS approximate_record_count
FROM information_schema.tables
WHERE table_schema = 'aurevia_db'
  AND table_type = 'BASE TABLE'
  AND table_rows = 0
ORDER BY table_name;

-- Expected: 0 rows

-- ============================================================
-- 8. STORED PROCEDURE DEMONSTRATION
-- ============================================================

CALL sp_get_customer_reservation_history(1);

-- Expected:
-- Customer 1: Amaya Perera
-- Her reservation information should be displayed.

-- ============================================================
-- 9. STORED FUNCTION DEMONSTRATION
-- ============================================================

SELECT
    invoice_id,
    total_amount,
    fn_invoice_remaining_balance(invoice_id) AS remaining_balance
FROM invoice
WHERE invoice_id = 2;

-- Expected for invoice 2:
-- total_amount      = 216800.00
-- remaining_balance = 116800.00

SELECT
    i.invoice_id,
    i.total_amount AS invoice_total,
    COALESCE(
        SUM(
            CASE
                WHEN p.payment_status = 'APPROVED'
                THEN p.amount
                ELSE 0
            END
        ),
        0
    ) AS approved_payment_amount,
    fn_invoice_remaining_balance(i.invoice_id) AS remaining_balance
FROM invoice i
LEFT JOIN payment p
    ON p.invoice_id = i.invoice_id
WHERE i.invoice_id = 2
GROUP BY
    i.invoice_id,
    i.total_amount;

-- Expected:
-- invoice_total           = 216800.00
-- approved_payment_amount = 100000.00
-- remaining_balance       = 116800.00

-- ============================================================
-- 10. TRIGGER AND TRANSACTION DEMONSTRATION
-- ============================================================

START TRANSACTION;

-- Display quantity before inventory usage.
SELECT
    inventory_item_id,
    item_name,
    current_quantity AS quantity_before
FROM inventory_item
WHERE inventory_item_id = 1;

-- The trigger should automatically deduct this quantity.
INSERT INTO inventory_usage (
    inventory_item_id,
    order_id,
    usage_date,
    quantity_used,
    usage_reason
)
VALUES (
    1,
    NULL,
    NOW(),
    10.000,
    'Final trigger demonstration'
);

-- Display quantity after the trigger executes.
SELECT
    inventory_item_id,
    item_name,
    current_quantity AS quantity_after
FROM inventory_item
WHERE inventory_item_id = 1;

-- Confirm that the temporary usage record exists.
SELECT
    usage_id,
    inventory_item_id,
    quantity_used,
    usage_reason
FROM inventory_usage
WHERE usage_reason = 'Final trigger demonstration';

-- Undo the demonstration changes.
ROLLBACK;

-- Confirm that the original quantity was restored.
SELECT
    inventory_item_id,
    item_name,
    current_quantity AS quantity_restored
FROM inventory_item
WHERE inventory_item_id = 1;

-- Confirm that the demonstration record was removed.
SELECT COUNT(*) AS demonstration_records_after_rollback
FROM inventory_usage
WHERE usage_reason = 'Final trigger demonstration';

-- Expected:
-- quantity_before = 150.000
-- quantity_after = 140.000
-- quantity_restored = 150.000
-- demonstration_records_after_rollback = 0


-- ============================================================
-- 11. INSUFFICIENT INVENTORY TEST
-- Run separately because the expected SIGNAL error stops
-- execution of the remaining SQL statements.
-- ============================================================

/*
INSERT INTO inventory_usage (
    inventory_item_id,
    order_id,
    usage_date,
    quantity_used,
    usage_reason
)
VALUES (
    1,
    NULL,
    NOW(),
    1000.000,
    'Insufficient stock test'
);

Expected error:
#1644 - Insufficient inventory quantity for this usage

Verification:
SELECT current_quantity
FROM inventory_item
WHERE inventory_item_id = 1;

Expected quantity: 150.000

SELECT COUNT(*) AS rejected_record_count
FROM inventory_usage
WHERE usage_reason = 'Insufficient stock test';

Expected: 0
*/