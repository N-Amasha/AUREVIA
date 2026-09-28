package com.aurevia.billing.mapper;

import com.aurevia.billing.dto.PaymentResponse;
import com.aurevia.billing.entity.Payment;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        UserAccount userAccount =
                payment.getInvoice()
                        .getCustomer()
                        .getUserAccount();

        String customerName =
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName();

        Integer cashierId =
                payment.getVerifiedByCashier() == null
                        ? null
                        : payment.getVerifiedByCashier()
                                .getEmployeeId();

        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getInvoice().getInvoiceId(),
                payment.getInvoice()
                        .getCustomer()
                        .getUserId(),
                customerName,
                cashierId,
                payment.getTransactionReference(),
                payment.getPaymentType(),
                payment.getPaymentDate(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getVerifiedAt()
        );
    }
}