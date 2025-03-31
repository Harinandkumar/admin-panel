
export interface User {
  _id?: string;
  userId?: string;
  name: string;
  email: string;
  password?: string;
  branch: string;
  batch: "22-26" | "23-27" | "24-28";
  regno: number;
  mobileno: number;
  isverified: boolean;
  events?: Event[];
  notifications?: Notification[];
}

export interface Event {
  _id?: string;
  eventId?: string;
  name: string;
  imagelink: string;
  date: Date | string;
  pdflink: string;
  isOpen: boolean;
  isResultAnnounced: boolean;
  winners?: string[];
  prize: string;
  location: string;
  description: string;
  participantsCount?: number;
}

export interface Notification {
  _id?: string;
  title: string;
  message: string;
  date?: Date | string;
}

export interface Admin {
  _id?: string;
  email: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
