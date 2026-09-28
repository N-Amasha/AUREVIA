package com.aurevia.billing.mapper;

import com.aurevia.billing.dto.InvoiceResponse;
import com.aurevia.billing.entity.Invoice;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class InvoiceMapper {

    public InvoiceResponse toResponse(
            Invoice invoice,
            BigDecimal approvedAmount
    ) {
        UserAccount userAccount =
                invoice.getCustomer().getUserAccount();

        String customerName =
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName();

        BigDecimal paidAmount =
                approvedAmount == null
                        ? BigDecimal.ZERO
                        : approvedAmount;

        BigDecimal outstandingAmount =
                invoice.getTotalAmount().subtract(paidAmount);

        if (outstandingAmount.signum() < 0) {
            outstandingAmount = BigDecimal.ZERO;
        }

        return new InvoiceResponse(
                invoice.getInvoiceId(),
                invoice.getCustomer().getUserId(),
                customerName,
                invoice.getReservation() == null
                        ? null
                        : invoice.getReservation()
                                .getReservationId(),
                invoice.getEventBooking() == null
                        ? null
                        : invoice.getEventBooking()
                                .getEventBookingId(),
                invoice.getCustomerOrder() == null
                        ? null
                        : invoice.getCustomerOrder().getOrderId(),
                invoice.getInvoiceDate(),
                invoice.getSubtotal(),
                invoice.getDiscount(),
                invoice.getTaxAmount(),
                invoice.getTotalAmount(),
                paidAmount,
                outstandingAmount,
                invoice.getInvoiceStatus()
        );
    }
}