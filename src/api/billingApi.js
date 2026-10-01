import axiosClient from "./axiosClient";

export async function createInvoice(invoiceData) {
  const response = await axiosClient.post(
    "/api/invoices",
    invoiceData,
  );

  return response.data;
}

export async function getInvoiceById(invoiceId) {
  const response = await axiosClient.get(
    `/api/invoices/${invoiceId}`,
  );

  return response.data;
}

export async function getInvoicesByCustomer(customerId) {
  const response = await axiosClient.get(
    `/api/invoices/customers/${customerId}`,
  );

  return response.data;
}

export async function getInvoicesByStatus(invoiceStatus) {
  const response = await axiosClient.get(
    `/api/invoices/statuses/${encodeURIComponent(invoiceStatus)}`,
  );

  return response.data;
}

export async function createPayment(paymentData) {
  const response = await axiosClient.post(
    "/api/payments",
    paymentData,
  );

  return response.data;
}

export async function verifyPayment(
  paymentId,
  verificationData,
) {
  const response = await axiosClient.patch(
    `/api/payments/${paymentId}/verification`,
    verificationData,
  );

  return response.data;
}

export async function getPaymentById(paymentId) {
  const response = await axiosClient.get(
    `/api/payments/${paymentId}`,
  );

  return response.data;
}

export async function getPaymentsByInvoice(invoiceId) {
  const response = await axiosClient.get(
    `/api/payments/invoices/${invoiceId}`,
  );

  return response.data;
}

export async function getPaymentsByCustomer(customerId) {
  const response = await axiosClient.get(
    `/api/payments/customers/${customerId}`,
  );

  return response.data;
}

export async function getPaymentsByStatus(paymentStatus) {
  const response = await axiosClient.get(
    `/api/payments/statuses/${encodeURIComponent(paymentStatus)}`,
  );

  return response.data;
}
