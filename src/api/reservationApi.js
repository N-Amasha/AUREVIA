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

export async function getEventBookingById(
  eventBookingId,
) {
  const response = await axiosClient.get(
    `/api/event-bookings/${eventBookingId}`,
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
