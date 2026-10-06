package com.aurevia.user.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.user.dto.CustomerProfileResponse;
import com.aurevia.user.dto.CustomerProfileUpdateRequest;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.entity.CustomerPhone;
import com.aurevia.user.entity.CustomerPhoneId;
import com.aurevia.user.entity.UserAccount;
import com.aurevia.user.repository.CustomerPhoneRepository;
import com.aurevia.user.repository.CustomerRepository;
import com.aurevia.user.repository.UserAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CustomerProfileService {

    private final CustomerRepository customerRepository;
    private final UserAccountRepository userAccountRepository;
    private final CustomerPhoneRepository customerPhoneRepository;

    public CustomerProfileService(
            CustomerRepository customerRepository,
            UserAccountRepository userAccountRepository,
            CustomerPhoneRepository customerPhoneRepository
    ) {
        this.customerRepository = customerRepository;
        this.userAccountRepository = userAccountRepository;
        this.customerPhoneRepository = customerPhoneRepository;
    }

    public CustomerProfileResponse getCustomerProfile(
            Integer customerId
    ) {
        Customer customer = findCustomer(customerId);

        return toResponse(customer);
    }

    @Transactional
    public CustomerProfileResponse updateCustomerProfile(
            Integer customerId,
            CustomerProfileUpdateRequest request
    ) {
        Customer customer = findCustomer(customerId);
        UserAccount userAccount = customer.getUserAccount();

        String normalizedEmail =
                request.email().trim().toLowerCase();

        if (userAccountRepository
                .existsByEmailIgnoreCaseAndUserIdNot(
                        normalizedEmail,
                        customerId
                )) {
            throw new BusinessRuleException(
                    "Another account already uses this email address."
            );
        }

        List<String> normalizedPhoneNumbers =
                normalizePhoneNumbers(
                        request.phoneNumbers()
                );

        validatePhoneOwnership(
                customerId,
                normalizedPhoneNumbers
        );

        userAccount.setFirstName(
                request.firstName().trim()
        );
        userAccount.setLastName(
                request.lastName().trim()
        );
        userAccount.setEmail(normalizedEmail);
        userAccount.setStreet(
                normalizeOptional(request.street())
        );
        userAccount.setCity(
                normalizeOptional(request.city())
        );
        userAccount.setProvince(
                normalizeOptional(request.province())
        );
        userAccount.setPostalCode(
                normalizeOptional(request.postalCode())
        );

        userAccountRepository.save(userAccount);

        replacePhoneNumbers(
                customer,
                normalizedPhoneNumbers
        );

        return toResponse(customer);
    }

    private Customer findCustomer(Integer customerId) {
        return customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer",
                                "customerId",
                                customerId
                        )
                );
    }

    private void validatePhoneOwnership(
            Integer customerId,
            List<String> phoneNumbers
    ) {
        for (String phoneNumber : phoneNumbers) {
            customerPhoneRepository
                    .findByIdPhoneNumber(phoneNumber)
                    .filter(phone ->
                            !phone.getCustomer()
                                    .getUserId()
                                    .equals(customerId)
                    )
                    .ifPresent(phone -> {
                        throw new BusinessRuleException(
                                "Phone number "
                                        + phoneNumber
                                        + " is already assigned "
                                        + "to another customer."
                        );
                    });
        }
    }

    private void replacePhoneNumbers(
            Customer customer,
            List<String> phoneNumbers
    ) {
        List<CustomerPhone> currentPhones =
                customerPhoneRepository
                        .findByCustomerUserIdOrderByIdPhoneNumberAsc(
                                customer.getUserId()
                        );

        customerPhoneRepository.deleteAll(
                currentPhones
        );

        List<CustomerPhone> updatedPhones =
                phoneNumbers.stream()
                        .map(phoneNumber -> {
                            CustomerPhone phone =
                                    new CustomerPhone();

                            phone.setId(
                                    new CustomerPhoneId(
                                            customer.getUserId(),
                                            phoneNumber
                                    )
                            );

                            phone.setCustomer(customer);

                            return phone;
                        })
                        .toList();

        customerPhoneRepository.saveAll(
                updatedPhones
        );
    }

    private List<String> normalizePhoneNumbers(
            List<String> phoneNumbers
    ) {
        if (phoneNumbers == null) {
            return Collections.emptyList();
        }

        List<String> normalized =
                phoneNumbers.stream()
                        .map(String::trim)
                        .filter(phone ->
                                !phone.isBlank()
                        )
                        .distinct()
                        .toList();

        if (normalized.size()
                != phoneNumbers.stream()
                .map(String::trim)
                .filter(phone -> !phone.isBlank())
                .count()) {
            throw new BusinessRuleException(
                    "Duplicate phone numbers are not allowed."
            );
        }

        return normalized;
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private CustomerProfileResponse toResponse(
            Customer customer
    ) {
        UserAccount userAccount =
                customer.getUserAccount();

        List<String> phoneNumbers =
                customerPhoneRepository
                        .findByCustomerUserIdOrderByIdPhoneNumberAsc(
                                customer.getUserId()
                        )
                        .stream()
                        .map(CustomerPhone::getPhoneNumber)
                        .toList();

        return new CustomerProfileResponse(
                customer.getUserId(),
                userAccount.getFirstName(),
                userAccount.getLastName(),
                userAccount.getEmail(),
                userAccount.getRegistrationDate(),
                userAccount.getStreet(),
                userAccount.getCity(),
                userAccount.getProvince(),
                userAccount.getPostalCode(),
                phoneNumbers
        );
    }
}