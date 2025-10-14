import axios from "axios";
import { baseUrl, baseHeader } from "../apis";
import { DEFAULT_CONFIG } from "config/defaultConfig";
import axiosInstance from "./axiosConfig";

export interface ClientProfile {
  id?: string;
  name: string;
  contactEmail: string;
  location?: string;
  contactNumber: string;
  picture?: string; 
}

const API_BASE_URL = DEFAULT_CONFIG.server.rest.baseURL;

export const clientService = {
  updateClientProfile: async (clientId: string, profileData: ClientProfile) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const response = await axiosInstance.patch(
        `${API_BASE_URL}client/${clientId}`,
        profileData, // <-- This is the actual data to update
        { headers: baseHeader } // <-- This is the config (headers, etc)
      );

      if (!response.data) {
        throw new Error("Failed to update client profile");
      }
      console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getClientProfile: async (clientId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const response = await axiosInstance.get(
        `${API_BASE_URL}client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (!response.data) {
        throw new Error("Invalid response format");
      }
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadClientProfilePicture: async (clientId: string, formData: FormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}client/${clientId}/upload-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          transformRequest: [(data) => data],
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },
}  