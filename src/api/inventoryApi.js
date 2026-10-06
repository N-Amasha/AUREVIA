import axiosClient from "./axiosClient";

// =====================================================
// INVENTORY ITEMS
// =====================================================

export async function getAllInventoryItems() {
  const response = await axiosClient.get(
    "/api/inventory-items",
  );

  return response.data;
}

export async function getInventoryItemById(
  inventoryItemId,
) {
  const response = await axiosClient.get(
    `/api/inventory-items/${inventoryItemId}`,
  );

  return response.data;
}

export async function getInventoryItemsBySupplier(
  supplierId,
) {
  const response = await axiosClient.get(
    `/api/inventory-items/suppliers/${supplierId}`,
  );

  return response.data;
}

export async function getInventoryItemsByCategory(
  itemCategory,
) {
  const response = await axiosClient.get(
    `/api/inventory-items/categories/${encodeURIComponent(
      itemCategory,
    )}`,
  );

  return response.data;
}

export async function getReorderAlerts() {
  const response = await axiosClient.get(
    "/api/inventory-items/alerts/reorder",
  );

  return response.data;
}

export async function getExpiredInventoryItems() {
  const response = await axiosClient.get(
    "/api/inventory-items/alerts/expired",
  );

  return response.data;
}

export async function getExpiringInventoryItems(
  startDate,
  endDate,
) {
  const response = await axiosClient.get(
    "/api/inventory-items/alerts/expiring",
    {
      params: {
        startDate,
        endDate,
      },
    },
  );

  return response.data;
}

// =====================================================
// INVENTORY USAGE
// =====================================================

export async function createInventoryUsage(
  usageData,
) {
  const response = await axiosClient.post(
    "/api/inventory-usages",
    usageData,
  );

  return response.data;
}

export async function getInventoryUsageById(
  usageId,
) {
  const response = await axiosClient.get(
    `/api/inventory-usages/${usageId}`,
  );

  return response.data;
}

export async function getInventoryUsageByItem(
  inventoryItemId,
) {
  const response = await axiosClient.get(
    `/api/inventory-usages/items/${inventoryItemId}`,
  );

  return response.data;
}

export async function getInventoryUsageByOrder(
  orderId,
) {
  const response = await axiosClient.get(
    `/api/inventory-usages/orders/${orderId}`,
  );

  return response.data;
}

export async function getGeneralInventoryUsage() {
  const response = await axiosClient.get(
    "/api/inventory-usages/general",
  );

  return response.data;
}

export async function getInventoryUsageByDateRange(
  startDate,
  endDate,
) {
  const response = await axiosClient.get(
    "/api/inventory-usages/date-range",
    {
      params: {
        startDate,
        endDate,
      },
    },
  );

  return response.data;
}

export async function getTotalUsageForItem(
  inventoryItemId,
) {
  const response = await axiosClient.get(
    `/api/inventory-usages/items/${inventoryItemId}/total`,
  );

  return response.data;
}

// =====================================================
// SUPPLIERS
// =====================================================

export async function getAllSuppliers() {
  const response = await axiosClient.get(
    "/api/suppliers",
  );

  return response.data;
}

export async function getSupplierById(supplierId) {
  const response = await axiosClient.get(
    `/api/suppliers/${supplierId}`,
  );

  return response.data;
}

export async function getSuppliersByCity(city) {
  const response = await axiosClient.get(
    "/api/suppliers/search",
    {
      params: {
        city,
      },
    },
  );

  return response.data;
}

export async function getSuppliersByProvince(
  province,
) {
  const response = await axiosClient.get(
    "/api/suppliers/search",
    {
      params: {
        province,
      },
    },
  );

  return response.data;
}

// =====================================================
// WASTE RECORDS
// =====================================================

export async function createWasteRecord(wasteData) {
  const response = await axiosClient.post(
    "/api/waste-records",
    wasteData,
  );

  return response.data;
}

export async function getWasteRecordById(wasteId) {
  const response = await axiosClient.get(
    `/api/waste-records/${wasteId}`,
  );

  return response.data;
}

export async function getWasteRecordsByItem(
  inventoryItemId,
) {
  const response = await axiosClient.get(
    `/api/waste-records/items/${inventoryItemId}`,
  );

  return response.data;
}

export async function getWasteRecordsByManager(
  managerId,
) {
  const response = await axiosClient.get(
    `/api/waste-records/managers/${managerId}`,
  );

  return response.data;
}

export async function getWasteRecordsByDateRange(
  startDate,
  endDate,
) {
  const response = await axiosClient.get(
    "/api/waste-records/date-range",
    {
      params: {
        startDate,
        endDate,
      },
    },
  );

  return response.data;
}

export async function getTotalEstimatedWasteCost() {
  const response = await axiosClient.get(
    "/api/waste-records/total-cost",
  );

  return response.data;
}

export async function getWasteCostForItem(
  inventoryItemId,
) {
  const response = await axiosClient.get(
    `/api/waste-records/items/${inventoryItemId}/total-cost`,
  );

  return response.data;
}