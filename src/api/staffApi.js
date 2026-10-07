import axiosClient from "./axiosClient";

export async function getAllEmployees() {
  const response = await axiosClient.get(
    "/api/employees",
  );

  return response.data;
}

export async function getEmployeeById(employeeId) {
  const response = await axiosClient.get(
    `/api/employees/${employeeId}`,
  );

  return response.data;
}

export async function getEmployeesByStatus(status) {
  const response = await axiosClient.get(
    `/api/employees/statuses/${encodeURIComponent(status)}`,
  );

  return response.data;
}

export async function getEmployeeShifts(employeeId) {
  const response = await axiosClient.get(
    `/api/shifts/employees/${employeeId}`,
  );

  return response.data;
}

export async function getEmployeeTasks(employeeId) {
  const response = await axiosClient.get(
    `/api/employee-tasks/employees/${employeeId}`,
  );

  return response.data;
}

export async function getEmployeeAttendance(employeeId) {
  const response = await axiosClient.get(
    `/api/attendance/employees/${employeeId}`,
  );

  return response.data;
}

export async function getEmployeeLeaveRequests(employeeId) {
  const response = await axiosClient.get(
    `/api/leave-requests/employees/${employeeId}`,
  );

  return response.data;
}

export async function getAllShifts() {
  const response = await axiosClient.get("/api/shifts");

  return response.data;
}

export async function createShift(shiftData) {
  const response = await axiosClient.post(
    "/api/shifts",
    shiftData,
  );

  return response.data;
}

export async function updateShiftStatus(
  shiftId,
  status,
) {
  const response = await axiosClient.patch(
    `/api/shifts/${shiftId}/status`,
    { status },
  );

  return response.data;
}

export async function getAllEmployeeTasks() {
  const response = await axiosClient.get(
    "/api/employee-tasks",
  );

  return response.data;
}

export async function createEmployeeTask(taskData) {
  const response = await axiosClient.post(
    "/api/employee-tasks",
    taskData,
  );

  return response.data;
}

export async function updateEmployeeTaskStatus(
  taskId,
  taskStatus,
) {
  const response = await axiosClient.patch(
    `/api/employee-tasks/${taskId}/status`,
    { taskStatus },
  );

  return response.data;
}

export async function getAllAttendance() {
  const response = await axiosClient.get(
    "/api/attendance",
  );

  return response.data;
}

export async function createAttendance(attendanceData) {
  const response = await axiosClient.post(
    "/api/attendance",
    attendanceData,
  );

  return response.data;
}

export async function getAllLeaveRequests() {
  const response = await axiosClient.get(
    "/api/leave-requests",
  );

  return response.data;
}

export async function createLeaveRequest(requestData) {
  const response = await axiosClient.post(
    "/api/leave-requests",
    requestData,
  );

  return response.data;
}

export async function reviewLeaveRequest(
  leaveRequestId,
  reviewData,
) {
  const response = await axiosClient.patch(
    `/api/leave-requests/${leaveRequestId}/review`,
    reviewData,
  );

  return response.data;
}
