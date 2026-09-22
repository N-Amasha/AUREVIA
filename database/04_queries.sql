-- =========================================================
-- AUREVIA REQUIRED SQL QUERIES
-- MariaDB 10.4.32
-- =========================================================

USE aurevia_db;

-- =========================================================
-- CATEGORY 1: SELECTION AND PROJECTION
-- =========================================================

-- Query 1:
-- Display confirmed table reservations with more than two guests.

SELECT
    reservation_id,
    customer_id,
    table_id,
    reservation_date,
    start_time,
    end_time,
    number_of_guests
FROM reservation
WHERE reservation_status = 'CONFIRMED'
  AND number_of_guests > 2
ORDER BY reservation_date;


-- Query 2:
-- Display available menu items costing more than Rs. 2,000.

SELECT
    menu_item_id,
    item_name,
    category,
    price
FROM menu_item
WHERE availability_status = 'AVAILABLE'
  AND price > 2000
ORDER BY price DESC;


-- =========================================================
-- CATEGORY 2: AGGREGATE FUNCTIONS
-- =========================================================

-- Query 3:
-- Calculate invoice statistics.

SELECT
    COUNT(*) AS total_invoices,
    SUM(total_amount) AS total_invoice_value,
    AVG(total_amount) AS average_invoice_value,
    MIN(total_amount) AS minimum_invoice_value,
    MAX(total_amount) AS maximum_invoice_value
FROM invoice;


-- Query 4:
-- Calculate total and average waste cost.

SELECT
    COUNT(*) AS total_waste_records,
    SUM(estimated_cost) AS total_waste_cost,
    AVG(estimated_cost) AS average_waste_cost,
    SUM(quantity) AS total_quantity_wasted
FROM waste_record;


-- =========================================================
-- CATEGORY 3: JOIN QUERIES
-- =========================================================

-- Query 5:
-- Display event information with customer and coordinator names.

SELECT
    e.event_id,
    e.event_name,
    e.event_type,
    e.event_date,
    e.event_status,

    CONCAT(
        customer_user.first_name,
        ' ',
        customer_user.last_name
    ) AS customer_name,

    CONCAT(
        coordinator_user.first_name,
        ' ',
        coordinator_user.last_name
    ) AS coordinator_name,

    v.venue_name

FROM events e

JOIN event_booking eb
    ON e.event_booking_id = eb.event_booking_id

JOIN customer c
    ON eb.customer_id = c.user_id

JOIN user_account customer_user
    ON c.user_id = customer_user.user_id

JOIN event_coordinator ec
    ON e.coordinator_id = ec.employee_id

JOIN employee emp
    ON ec.employee_id = emp.employee_id

JOIN user_account coordinator_user
    ON emp.user_id = coordinator_user.user_id

JOIN venue v
    ON eb.venue_id = v.venue_id

ORDER BY e.event_date;


-- Query 6:
-- Display invoices with customers and their source transaction type.

SELECT
    i.invoice_id,

    CONCAT(
        u.first_name,
        ' ',
        u.last_name
    ) AS customer_name,

    CASE
        WHEN i.reservation_id IS NOT NULL
            THEN 'TABLE_RESERVATION'

        WHEN i.event_booking_id IS NOT NULL
            THEN 'EVENT_BOOKING'

        WHEN i.order_id IS NOT NULL
            THEN 'CUSTOMER_ORDER'
    END AS invoice_source,

    COALESCE(
        i.reservation_id,
        i.event_booking_id,
        i.order_id
    ) AS source_id,

    i.total_amount,
    i.invoice_status

FROM invoice i

JOIN customer c
    ON i.customer_id = c.user_id

JOIN user_account u
    ON c.user_id = u.user_id

ORDER BY i.invoice_id;


-- =========================================================
-- CATEGORY 4: SUBQUERIES
-- =========================================================

-- Query 7:
-- Find orders whose total is greater than the average order total.

SELECT
    co.order_id,
    co.customer_id,
    co.order_date,
    co.total_amount
FROM customer_order co
WHERE co.total_amount > (
    SELECT AVG(total_amount)
    FROM customer_order
)
ORDER BY co.total_amount DESC;


-- Query 8:
-- Find inventory items whose quantity is below the average stock quantity.

SELECT
    inventory_item_id,
    item_name,
    current_quantity,
    reorder_level
FROM inventory_item
WHERE current_quantity < (
    SELECT AVG(current_quantity)
    FROM inventory_item
)
ORDER BY current_quantity ASC;


-- =========================================================
-- CATEGORY 5: GROUPING AND ORDERING
-- =========================================================

-- Query 9:
-- Show the number and value of bookings for each venue.

SELECT
    v.venue_id,
    v.venue_name,
    COUNT(eb.event_booking_id) AS total_bookings,
    SUM(eb.total_amount) AS total_booking_value,
    AVG(eb.total_amount) AS average_booking_value
FROM venue v

LEFT JOIN event_booking eb
    ON v.venue_id = eb.venue_id

GROUP BY
    v.venue_id,
    v.venue_name

ORDER BY total_booking_value DESC;


-- Query 10:
-- Show menu-item sales quantities and revenue.
-- Only display items with at least two units sold.

SELECT
    mi.menu_item_id,
    mi.item_name,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.subtotal) AS total_sales_revenue
FROM menu_item mi

JOIN order_item oi
    ON mi.menu_item_id = oi.menu_item_id

GROUP BY
    mi.menu_item_id,
    mi.item_name

HAVING SUM(oi.quantity) >= 2

ORDER BY total_sales_revenue DESC;