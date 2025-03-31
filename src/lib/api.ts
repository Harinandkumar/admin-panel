import { Event, Notification, User, LoginCredentials, Admin } from "./types";

const API_URL = "https://backend-glo6.onrender.com";


async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  // Add auth token if available
  const token = localStorage.getItem("token");
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  
  return await response.json();
}

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials) => 
    apiRequest<{ admin: Admin, token: string }>("/admin-login", "POST", credentials),
  verify: () =>
    apiRequest<{ admin: Admin, message: string }>("/admin/verify"),
};

// Events API
export const eventsAPI = {
  getAll: () => 
    apiRequest<Event[]>("/admin/events"),
  
  getById: (id: string) => 
    apiRequest<Event>(`/admin/events/${id}`),
  
  create: (event: Event) => 
    apiRequest<Event>("/admin/events/create", "POST", event),
  
  update: (id: string, event: Event) => 
    apiRequest<Event>(`/admin/events/${id}`, "PUT", event),
  
  delete: (id: string) => 
    apiRequest<void>(`/admin/events/${id}`, "DELETE"),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => 
    apiRequest<Notification[]>("/admin/notifications"),
  
  getById: (id: string) => 
    apiRequest<Notification>(`/admin/notifications/${id}`),
  
  create: (notification: Notification) => 
    apiRequest<Notification>("/admin/notifications/create", "POST", notification),
  
  update: (id: string, notification: Notification) => 
    apiRequest<Notification>(`/admin/notifications/${id}`, "PUT", notification),
  
  delete: (id: string) => 
    apiRequest<void>(`/admin/notifications/${id}`, "DELETE"),
};

// Users API
export const usersAPI = {
  getAll: () => 
    apiRequest<User[]>("/admin/members"),
  
  getById: (id: string) => 
    apiRequest<User>(`/admin/members/${id}`),
  
  create: (user: User) => 
    apiRequest<User>("/admin/members/create", "POST", user),
  
  update: (id: string, user: User) => 
    apiRequest<User>(`/admin/members/${id}`, "PUT", user),
  
  delete: (id: string) => 
    apiRequest<void>(`/admin/members/${id}`, "DELETE"),
};

// Add the Reports API section
export const reportsAPI = {
  getStats: () =>
    apiRequest<any>("/admin/reports/stats"),
  
  getEventTrend: () =>
    apiRequest<any>("/admin/reports/events/trend"),
  
  getUserTrend: () =>
    apiRequest<any>("/admin/reports/users/trend"),
  
  getUserBranches: () =>
    apiRequest<any>("/admin/reports/users/branches"),
  
  getUserBatches: () =>
    apiRequest<any>("/admin/reports/users/batches"),
};
