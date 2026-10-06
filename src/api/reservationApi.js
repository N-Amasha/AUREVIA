import axiosClient from "./axiosClient";

export async function createTableReservation(
  reservationData,
) {
  const response = await axiosClient.post(
    "/api/reservations",
    reservationData,
  );

  return response.data;
}

export async function getTableReservationById(
  reservationId,
) {
  const response = await axiosClient.get(
    `/api/reservations/${reservationId}`,
  );

  return response.data;
}

export async function getCustomerTableReservations(
  customerId,
) {
  const response = await axiosClient.get(
    `/api/reservations/customers/${customerId}`,
  );

  return response.data;
}

export async function createEventBooking(
  bookingData,
) {
  const response = await axiosClient.post(
    "/api/event-bookings",
    bookingData,
  );

  return response.data;
}

export async function updateEventBooking(
  eventBookingId,
  bookingData,
) {
  const response = await axiosClient.put(
    `/api/event-bookings/${eventBookingId}`,
    bookingData,
  );

  return response.data;
}

export async function cancelEventBooking(eventBookingId) {
  const response = await axiosClient.delete(
    `/api/event-bookings/${eventBookingId}`,
  );

  return response.data;
}

export async function getAllTableReservations() {
  const response = await axiosClient.get(
    "/api/reservations",
  );

  return response.data;
}

export async function getEventBookingById(
  eventBookingId,
) {
  const response = await axiosClient.get(
    `/api/event-bookings/${eventBookingId}`,
  );

  return response.data;
}

export async function getAllEventBookings() {
  const response = await axiosClient.get(
    "/api/event-bookings",
  );

  return response.data;
}

export async function getCustomerEventBookings(
  customerId,
) {
  const response = await axiosClient.get(
    `/api/event-bookings/customers/${customerId}`,
  );

  return response.data;
}

export async function getEventBookingsByStatus(
  bookingStatus,
) {
  const response = await axiosClient.get(
    `/api/event-bookings/statuses/${bookingStatus}`,
  );

  return response.data;
}

export async function getVenueById(venueId) {
  const response = await axiosClient.get(
    `/api/venues/${venueId}`,
  );

  return response.data;
}

export async function getAvailableVenues(params = {}) {
  const response = await axiosClient.get(
    "/api/venues/available",
    {
      params,
    },
  );

  return response.data;
}

export async function getVenuesByType(venueType) {
  const response = await axiosClient.get(
    `/api/venues/types/${venueType}`,
  );

  return response.data;
}

export async function getAvailableRestaurantTables(
  params,
) {
  const response = await axiosClient.get(
    "/api/restaurant-tables/available",
    {
      params,
    },
  );

  return response.data;
}


export async function getAllRestaurantTables() {
  const response = await axiosClient.get(
    "/api/restaurant-tables",
  );

  return response.data;
}

export async function getRestaurantTableById(tableId) {
  const response = await axiosClient.get(
    `/api/restaurant-tables/${tableId}`,
  );

  return response.data;
}

export async function createRestaurantTable(tableData) {
  const response = await axiosClient.post(
    "/api/restaurant-tables",
    tableData,
  );

  return response.data;
}

export async function updateRestaurantTable(
  tableId,
  tableData,
) {
  const response = await axiosClient.put(
    `/api/restaurant-tables/${tableId}`,
    tableData,
  );

  return response.data;
}

export async function deleteRestaurantTable(tableId) {
  await axiosClient.delete(
    `/api/restaurant-tables/${tableId}`,
  );
}

export async function getAllVenues() {
  const response = await axiosClient.get(
    "/api/venues",
  );

  return response.data;
}

export async function createVenue(venueData) {
  const response = await axiosClient.post(
    "/api/venues",
    venueData,
  );

  return response.data;
}

export async function updateVenue(
  venueId,
  venueData,
) {
  const response = await axiosClient.put(
    `/api/venues/${venueId}`,
    venueData,
  );

  return response.data;
}

export async function deleteVenue(venueId) {
  await axiosClient.delete(
    `/api/venues/${venueId}`,
  );
}
