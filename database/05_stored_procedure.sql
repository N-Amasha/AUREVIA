-- =========================================================
-- AUREVIA STORED PROCEDURE AND FUNCTION
-- MariaDB 10.4.32
-- =========================================================

USE aurevia_db;

-- =========================================================
-- 1. STORED PROCEDURE
-- Retrieve a customer's complete table-reservation history.
-- =========================================================

DROP PROCEDURE IF EXISTS sp_get_customer_reservation_history;

DELIMITER $$

CREATE PROCEDURE sp_get_customer_reservation_history (
    IN p_customer_id INT UNSIGNED
)
BEGIN
    SELECT
        r.reservation_id,

               CONCAT(
            u.first_name,
            ' ',
            u.last_name
        ) AS customer_name,

        rt.table_number,
        rt.location AS table_location,
        rt.capacity AS table_capacity,

        r.reservation_date,
        r.start_time,
        r.end_time,
        r.number_of_guests,
        r.reservation_status,
        r.created_at

    FROM reservation r

    JOIN customer c
        ON r.customer_id = c.user_id

    JOIN user_account u
        ON c.user_id = u.user_id

    JOIN restaurant_table rt
        ON r.table_id = rt.table_id

    WHERE r.customer_id = p_customer_id

    ORDER BY
        r.reservation_date DESC,
        r.start_time DESC;
END$$

DELIMITER ;


-- =========================================================
-- 2. STORED FUNCTION
-- Calculate the unpaid balance of an invoice.
-- Only APPROVED payments reduce the invoice balance.
-- =========================================================

DROP FUNCTION IF EXISTS fn_invoice_remaining_balance;

DELIMITER $$

CREATE FUNCTION fn_invoice_remaining_balance (
    p_invoice_id INT UNSIGNED
)
RETURNS DECIMAL(12,2)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_invoice_total DECIMAL(12,2) DEFAULT 0.00;
    DECLARE v_approved_payment_total DECIMAL(12,2) DEFAULT 0.00;
    DECLARE v_remaining_balance DECIMAL(12,2) DEFAULT 0.00;

    SELECT COALESCE(MAX(total_amount), 0.00)
    INTO v_invoice_total
    FROM invoice
    WHERE invoice_id = p_invoice_id;

    SELECT COALESCE(SUM(amount), 0.00)
    INTO v_approved_payment_total
    FROM payment
    WHERE invoice_id = p_invoice_id
      AND payment_status = 'APPROVED';

    SET v_remaining_balance =
        v_invoice_total - v_approved_payment_total;

    RETURN GREATEST(v_remaining_balance, 0.00);
END$$

DELIMITER ;


-- =========================================================
-- 3. DEMONSTRATION CALLS
-- =========================================================

-- Retrieve reservation history for customer 1.

CALL sp_get_customer_reservation_history(1);


-- Calculate the remaining balance of invoice 2.

SELECT
    invoice_id,
    total_amount,
    fn_invoice_remaining_balance(invoice_id)
        AS remaining_balance
FROM invoice
WHERE invoice_id = 2;


-- Display the balance of every invoice.

SELECT
    invoice_id,
    customer_id,
    total_amount,
    invoice_status,
    fn_invoice_remaining_balance(invoice_id)
        AS remaining_balance
FROM invoice
ORDER BY invoice_id;

