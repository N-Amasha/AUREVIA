import axiosClient from "./axiosClient";

// =====================================================
// EVENTS
// =====================================================

export async function createEvent(eventData) {
  const response = await axiosClient.post(
    "/api/events",
    eventData,
  );

  return response.data;
}

export async function createEventFromBooking(
  eventData,
) {
  const response = await axiosClient.post(
    "/api/events/from-booking",
    eventData,
  );

  return response.data;
}

export async function getEventById(eventId) {
  const response = await axiosClient.get(
    `/api/events/${eventId}`,
  );

  return response.data;
}

export async function getEventsByCoordinator(
  coordinatorId,
) {
  const response = await axiosClient.get(
    `/api/events/coordinators/${coordinatorId}`,
  );

  return response.data;
}

export async function getEventsByStatus(eventStatus) {
  const response = await axiosClient.get(
    `/api/events/statuses/${eventStatus}`,
  );

  return response.data;
}

export async function getEventsByDateRange(
  startDate,
  endDate,
) {
  const response = await axiosClient.get(
    "/api/events/date-range",
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
// EVENT SERVICES
// =====================================================

export async function createEventService(serviceData) {
  const response = await axiosClient.post(
    "/api/event-services",
    serviceData,
  );

  return response.data;
}

export async function updateEventService(
  eventServiceId,
  serviceData,
) {
  const response = await axiosClient.put(
    `/api/event-services/${eventServiceId}`,
    serviceData,
  );

  return response.data;
}

export async function deleteEventService(
  eventServiceId,
) {
  await axiosClient.delete(
    `/api/event-services/${eventServiceId}`,
  );
}

export async function getEventServiceById(
  eventServiceId,
) {
  const response = await axiosClient.get(
    `/api/event-services/${eventServiceId}`,
  );

  return response.data;
}

export async function getServicesByEvent(eventId) {
  const response = await axiosClient.get(
    `/api/event-services/events/${eventId}`,
  );

  return response.data;
}

export async function getServicesByVendor(vendorId) {
  const response = await axiosClient.get(
    `/api/event-services/vendors/${vendorId}`,
  );

  return response.data;
}

export async function getServicesByStatus(
  serviceStatus,
) {
  const response = await axiosClient.get(
    `/api/event-services/statuses/${serviceStatus}`,
  );

  return response.data;
}

export async function getEventServiceTotalCost(eventId) {
  const response = await axiosClient.get(
    `/api/event-services/events/${eventId}/total-cost`,
  );

  return response.data;
}

// =====================================================
// EVENT TIMELINES
// =====================================================

export async function createEventTimeline(
  timelineData,
) {
  const response = await axiosClient.post(
    "/api/event-timelines",
    timelineData,
  );

  return response.data;
}

export async function getTimelineById(timelineId) {
  const response = await axiosClient.get(
    `/api/event-timelines/${timelineId}`,
  );

  return response.data;
}

export async function getTimelinesByEvent(eventId) {
  const response = await axiosClient.get(
    `/api/event-timelines/events/${eventId}`,
  );

  return response.data;
}

export async function getEventTimelinesByStatus(
  eventId,
  status,
) {
  const response = await axiosClient.get(
    `/api/event-timelines/events/${eventId}/statuses/${status}`,
  );

  return response.data;
}

export async function getTimelinesByDateRange(
  startDate,
  endDate,
) {
  const response = await axiosClient.get(
    "/api/event-timelines/date-range",
    {
      params: {
        startDate,
        endDate,
      },
    },
  );

  return response.data;
}

export async function updateTimelineStatus(
  timelineId,
  statusData,
) {
  const response = await axiosClient.patch(
    `/api/event-timelines/${timelineId}/status`,
    statusData,
  );

  return response.data;
}

// =====================================================
// REVIEWS AND SENTIMENT
// =====================================================

export async function createReview(reviewData) {
  const response = await axiosClient.post(
    "/api/reviews",
    reviewData,
  );

  return response.data;
}

export async function getAllReviews() {
  const response = await axiosClient.get(
    "/api/reviews",
  );

  return response.data;
}

export async function getReviewById(reviewId) {
  const response = await axiosClient.get(
    `/api/reviews/${reviewId}`,
  );

  return response.data;
}

export async function getReviewsByCustomer(customerId) {
  const response = await axiosClient.get(
    `/api/reviews/customers/${customerId}`,
  );

  return response.data;
}

export async function getReviewsByEvent(eventId) {
  const response = await axiosClient.get(
    `/api/reviews/events/${eventId}`,
  );

  return response.data;
}

export async function getReviewsByOrder(orderId) {
  const response = await axiosClient.get(
    `/api/reviews/orders/${orderId}`,
  );

  return response.data;
}

export async function getReviewsBySentiment(sentiment) {
  const response = await axiosClient.get(
    `/api/reviews/sentiments/${sentiment}`,
  );

  return response.data;
}

// =====================================================
// VENDORS
// =====================================================

export async function getAllVendors() {
  const response = await axiosClient.get(
    "/api/vendors",
  );

  return response.data;
}

export async function getVendorById(vendorId) {
  const response = await axiosClient.get(
    `/api/vendors/${vendorId}`,
  );

  return response.data;
}

export async function getVendorsByType(vendorType) {
  const response = await axiosClient.get(
    `/api/vendors/types/${vendorType}`,
  );

  return response.data;
}

export async function getVendorsByCity(city) {
  const response = await axiosClient.get(
    "/api/vendors/search",
    {
      params: {
        city,
      },
    },
  );

  return response.data;
}