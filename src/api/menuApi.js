import axiosClient from "./axiosClient";

export async function getMenuById(menuId) {
  const response = await axiosClient.get(
    `/api/menus/${menuId}`,
  );

  return response.data;
}

export async function getActiveMenus() {
  const response = await axiosClient.get(
    "/api/menus/active",
  );

  return response.data;
}

export async function getActiveMenusByType(menuType) {
  const response = await axiosClient.get(
    `/api/menus/types/${encodeURIComponent(menuType)}`,
  );

  return response.data;
}

export async function getAllMenuItems() {
  const response = await axiosClient.get(
    "/api/menus/items",
  );

  return response.data;
}

export async function getMenuItemById(menuItemId) {
  const response = await axiosClient.get(
    `/api/menus/items/${menuItemId}`,
  );

  return response.data;
}

export async function getAvailableItemsByMenu(menuId) {
  const response = await axiosClient.get(
    `/api/menus/${menuId}/items/available`,
  );

  return response.data;
}

export async function getAvailableItemsByCategory(category) {
  const response = await axiosClient.get(
    `/api/menus/items/categories/${encodeURIComponent(category)}`,
  );

  return response.data;
}

export async function createMenuItem(menuItemData) {
  const response = await axiosClient.post(
    "/api/menus/items",
    menuItemData,
  );

  return response.data;
}

export async function updateMenuItem(
  menuItemId,
  menuItemData,
) {
  const response = await axiosClient.put(
    `/api/menus/items/${menuItemId}`,
    menuItemData,
  );

  return response.data;
}

export async function deleteMenuItem(menuItemId) {
  await axiosClient.delete(
    `/api/menus/items/${menuItemId}`,
  );
}


