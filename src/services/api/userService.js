import axiosConfig from "./axios.config";
import { getAppToken } from "./tokenStorage";

const APP_ID = 15;

export async function getUsers(page = 1, limit = 10, searchTerm = '') {
  try {
    const token = getAppToken();
    if (!token) throw new Error('Non authentifié');
    const params = { page, limit };
    if (searchTerm) params.search = searchTerm;
    const response = await axiosConfig.get(
      `serviceauth/users/application/${APP_ID}`,
      {
        params,
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const data = response.data;
    const users = Array.isArray(data.data) ? data.data : [];
    const total = data.total || users.length;
    const totalPages = data.totalPages || Math.ceil(total / limit);

    return {
      users,
      page: data.page || page,
      limit: data.limit || limit,
      total,
      totalPages
    };
  } catch (error) {
    throw error;
  }
}