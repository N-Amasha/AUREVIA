-- =========================================================
-- AUREVIA INVENTORY TRIGGER
-- MariaDB 10.4.32
-- =========================================================

USE aurevia_db;

DROP TRIGGER IF EXISTS trg_inventory_usage_before_insert;

DELIMITER $$

CREATE TRIGGER trg_inventory_usage_before_insert
BEFORE INSERT ON inventory_usage
FOR EACH ROW
BEGIN
    DECLARE v_available_quantity DECIMAL(12,3);

    SELECT current_quantity
    INTO v_available_quantity
    FROM inventory_item
    WHERE inventory_item_id = NEW.inventory_item_id;

    IF NEW.quantity_used <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Inventory usage quantity must be greater than zero';

    ELSEIF NEW.quantity_used > v_available_quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Insufficient inventory quantity for this usage';

    ELSE
        UPDATE inventory_item
        SET current_quantity =
            current_quantity - NEW.quantity_used
        WHERE inventory_item_id = NEW.inventory_item_id;
    END IF;
END$$

DELIMITER ;