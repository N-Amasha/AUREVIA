import axiosClient from "./axiosClient";

export async function getCustomerProfile(
  customerId,
) {
  const response = await axiosClient.get(
    `/api/customers/${customerId}/profile`,
  );

  return response.data;
}

export async function updateCustomerProfile(
  customerId,
  profileData,
) {
  const response = await axiosClient.put(
    `/api/customers/${customerId}/profile`,
    profileData,
  );

  return response.data;
}