import axiosClient from "./axiosClient";
import { saveAuth } from "./authStorage";

export async function login(credentials) {
  const response = await axiosClient.post(
    "/api/auth/login",
    credentials,
  );

  saveAuth(response.data);

  return response.data;
}