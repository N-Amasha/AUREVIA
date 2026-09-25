package com.aurevia.menu.repository;

import com.aurevia.menu.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerOrderRepository
        extends JpaRepository<CustomerOrder, Integer> {

    List<CustomerOrder>
    findByCustomerUserIdOrderByOrderDateDesc(Integer customerId);

    List<CustomerOrder> findByOrderStatusIgnoreCase(
            String orderStatus
    );

    List<CustomerOrder>
    findByOrderTypeIgnoreCaseAndOrderStatusIgnoreCase(
            String orderType,
            String orderStatus
    );
}