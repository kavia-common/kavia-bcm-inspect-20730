import axios, { AxiosError } from "axios"; // Import AxiosError
import {
  UserProfileResponse,
  UserProfileFormData,
  GetUsers,
  UserProfile,
} from "../interfaces/user";
import { DEFAULT_CONFIG } from "config/defaultConfig";
import axiosInstance from "./axiosConfig";

const API_BASE_URL = DEFAULT_CONFIG.server.rest.baseURL;

// PUBLIC_INTERFACE
/**
 * Get user profile information
 * @returns Promise with user profile data
 */
export const getProfile = async (): Promise<UserProfileResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axiosInstance.get(`${API_BASE_URL}auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data);
    if (!response.data) {
      throw new Error("Invalid response format");
    }

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch profile");
    }

    if (!response.data.user) {
      throw new Error("Profile data not found in response");
    }

    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized access. Please login again.");
      }
      if (error.response?.data?.message) {
        throw new Error("Profile not found");
      }
      if (error.message === "Network Error") {
        throw new Error("Profile not found");
      }
    }
    throw new Error("Profile not found");
  }
};

// PUBLIC_INTERFACE
/**
 * Update user profile information
 * @param profileData Updated profile data
 * @returns Promise with updated user profile
 */
export const updateProfile = async (
  profileData: FormData
): Promise<UserProfileResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.put(
      `${API_BASE_URL}auth/update-user`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important for file upload
        },
      }
    );

    if (!response.data || !response.data.success) {
      throw new Error(response.data.message || "Failed to update profile");
    }

    return response.data.user;
  } catch (error) {
    console.error(error);
    throw new Error("Invalid data");
  }
};

// PUBLIC_INTERFACE
/**
 * Invite a new user via email
 * @param userData User details for the invitation
 * @returns Promise<void>
 */
export interface InviteUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  clientProfileId: string;
  picture: string;
  gender: string;
  phone_number: string;
}

interface ErrorResponse {
  message?: string; // Optional message property
  [key: string]: any; // Allow other properties if needed
}

export const inviteUser = async (
  userData: InviteUserPayload
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axiosInstance.post(`${API_BASE_URL}auth/invite`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("User invited successfully:", response.data);
  } catch (error) {
    const axiosError = error as AxiosError; // Explicitly cast to AxiosError

    let errorMessage;

    if (axiosError.response) {
      console.log(axiosError.response.data);
      // If the error has a response, use the message from the response
      const responseError = axiosError.response.data as ErrorResponse;
      errorMessage = responseError || "An error occurred";
      console.error("Error inviting user:", axiosError.response.data);
    } else {
      // If there is no response, use the error message from the AxiosError
      errorMessage = axiosError.message;
      console.error("Error inviting user:", axiosError.message);
    }

    // Rethrow the error after logging
    throw errorMessage;
  }
};

export const getUsers = async (
  clientProfileId: string
): Promise<GetUsers[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axiosInstance.get(
      `${API_BASE_URL}client/${clientProfileId}/get-users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);

    if (!response.data?.success && response.data.message) {
      throw new Error(response.data.message);
    }
    if (!response.data?.success || !response.data?.data?.cognitoUsers) {
      throw new Error(response.data?.message || "Failed to fetch users");
    }

    const users = response.data.data.cognitoUsers;

    if (!Array.isArray(users)) {
      throw new Error("Invalid response format: users is not an array");
    }

    return users;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized access. Please login again.");
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }

    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};
// In clientService.ts
export const deleteUser = async (email: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }
    const response = await axiosInstance.delete(`${API_BASE_URL}auth/user/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
