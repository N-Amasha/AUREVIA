package com.aurevia.auth.service;

import com.aurevia.user.entity.Employee;
import com.aurevia.user.entity.UserAccount;
import com.aurevia.user.repository.AdministratorRepository;
import com.aurevia.user.repository.CashierRepository;
import com.aurevia.user.repository.ChefRepository;
import com.aurevia.user.repository.CustomerRepository;
import com.aurevia.user.repository.EmployeeRepository;
import com.aurevia.user.repository.EventCoordinatorRepository;
import com.aurevia.user.repository.HrManagerRepository;
import com.aurevia.user.repository.InventoryManagerRepository;
import com.aurevia.user.repository.RestaurantManagerRepository;
import com.aurevia.user.repository.RestaurantStaffRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserRoleService {

    private final AdministratorRepository administratorRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final RestaurantManagerRepository restaurantManagerRepository;
    private final EventCoordinatorRepository eventCoordinatorRepository;
    private final ChefRepository chefRepository;
    private final CashierRepository cashierRepository;
    private final InventoryManagerRepository inventoryManagerRepository;
    private final HrManagerRepository hrManagerRepository;
    private final RestaurantStaffRepository restaurantStaffRepository;

    public UserRoleService(
            AdministratorRepository administratorRepository,
            CustomerRepository customerRepository,
            EmployeeRepository employeeRepository,
            RestaurantManagerRepository restaurantManagerRepository,
            EventCoordinatorRepository eventCoordinatorRepository,
            ChefRepository chefRepository,
            CashierRepository cashierRepository,
            InventoryManagerRepository inventoryManagerRepository,
            HrManagerRepository hrManagerRepository,
            RestaurantStaffRepository restaurantStaffRepository
    ) {
        this.administratorRepository = administratorRepository;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
        this.restaurantManagerRepository = restaurantManagerRepository;
        this.eventCoordinatorRepository = eventCoordinatorRepository;
        this.chefRepository = chefRepository;
        this.cashierRepository = cashierRepository;
        this.inventoryManagerRepository = inventoryManagerRepository;
        this.hrManagerRepository = hrManagerRepository;
        this.restaurantStaffRepository = restaurantStaffRepository;
    }

    public String resolveRole(UserAccount userAccount) {
        Integer userId = userAccount.getUserId();

        if (administratorRepository.existsById(userId)) {
            return "ADMINISTRATOR";
        }

        if (customerRepository.existsById(userId)) {
            return "CUSTOMER";
        }

        Employee employee = employeeRepository
                .findByUserAccountEmailIgnoreCase(
                        userAccount.getEmail()
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "No application role is assigned to user: "
                                        + userAccount.getEmail()
                        )
                );

        Integer employeeId = employee.getEmployeeId();

        if (restaurantManagerRepository.existsById(employeeId)) {
            return "RESTAURANT_MANAGER";
        }

        if (eventCoordinatorRepository.existsById(employeeId)) {
            return "EVENT_COORDINATOR";
        }

        if (chefRepository.existsById(employeeId)) {
            return "CHEF";
        }

        if (cashierRepository.existsById(employeeId)) {
            return "CASHIER";
        }

        if (inventoryManagerRepository.existsById(employeeId)) {
            return "INVENTORY_MANAGER";
        }

        if (hrManagerRepository.existsById(employeeId)) {
            return "HR_MANAGER";
        }

        if (restaurantStaffRepository.existsById(employeeId)) {
            return "RESTAURANT_STAFF";
        }

        return "EMPLOYEE";
    }
}