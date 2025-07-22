"use client";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ success: boolean; user: any }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/auth/logout", { method: "POST" });
  }

  async getMe() {
    return this.request<{ user: any }>("/auth/me");
  }

  // Items methods
  async getItems(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.category) searchParams.set("category", params.category);

    const query = searchParams.toString();
    return this.request<{
      items: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/items${query ? `?${query}` : ""}`);
  }

  async getItem(id: string) {
    return this.request<{ item: any }>(`/items/${id}`);
  }

  async createItem(data: any) {
    return this.request<{ item: any }>("/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async updateItem(id: string, data: any) {
    return this.request<{ item: any }>(`/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async deleteItem(id: string) {
    return this.request<{ message: string }>(`/items/${id}`, {
      method: "DELETE",
    });
  }

  // Borrowings methods
  async getBorrowings(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);

    const query = searchParams.toString();
    return this.request<{
      borrowings: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/borrowings${query ? `?${query}` : ""}`);
  }

  async createBorrowing(data: any) {
    return this.request<{ borrowing: any }>("/borrowings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async updateBorrowing(id: string, data: any) {
    return this.request<{ borrowing: any }>(`/borrowings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async deleteBorrowing(id: string) {
    return this.request<{ message: string }>(`/borrowings/${id}`, {
      method: "DELETE",
    });
  }

  // Users methods
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.role) searchParams.set("role", params.role);

    const query = searchParams.toString();
    return this.request<{
      users: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/users${query ? `?${query}` : ""}`);
  }

  async createUser(data: any) {
    return this.request<{ user: any }>("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request<{ user: any }>(`/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Borrowers methods
  async getBorrowers(params?: { search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString();
    return this.request<{
      borrowers: any[];
    }>(`/users/borrowers${query ? `?${query}` : ""}`);
  }

  // Lecturers methods
  async getLecturers() {
    return this.request<{
      lecturers: {
        id: string;
        name: string;
        nidn: string;
        email: string;
        phone?: string;
        department: string;
        photo?: string;
      }[];
    }>("/lecturers");
  }

  async createLecturer(formData: FormData) {
    const response = await fetch(`${this.baseURL}/lecturers`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  async updateLecturer(formData: FormData) {
    const response = await fetch(`${this.baseURL}/lecturers`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  async deleteLecturer(id: string) {
    const response = await fetch(`${this.baseURL}/lecturers?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
