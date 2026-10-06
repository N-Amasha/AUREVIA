import axiosClient from "./axiosClient";

export async function getAllPricingRules() {
  const response = await axiosClient.get(
    "/api/pricing-rules",
  );

  return response.data;
}

export async function getPricingRuleById(
  pricingRuleId,
) {
  const response = await axiosClient.get(
    `/api/pricing-rules/${pricingRuleId}`,
  );

  return response.data;
}

export async function getPricingRulesByVenue(
  venueId,
) {
  const response = await axiosClient.get(
    `/api/pricing-rules/venues/${venueId}`,
  );

  return response.data;
}

export async function getPricingRulesByStatus(
  approvalStatus,
) {
  const response = await axiosClient.get(
    `/api/pricing-rules/statuses/${approvalStatus}`,
  );

  return response.data;
}

export async function createPricingRule(
  pricingRuleData,
) {
  const response = await axiosClient.post(
    "/api/pricing-rules",
    pricingRuleData,
  );

  return response.data;
}

export async function updatePricingRule(
  pricingRuleId,
  pricingRuleData,
) {
  const response = await axiosClient.put(
    `/api/pricing-rules/${pricingRuleId}`,
    pricingRuleData,
  );

  return response.data;
}

export async function deletePricingRule(
  pricingRuleId,
) {
  await axiosClient.delete(
    `/api/pricing-rules/${pricingRuleId}`,
  );
}