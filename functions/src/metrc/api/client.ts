/**
 * Metrc API Client for Minnesota
 *
 * Base client for all Metrc API operations
 * Handles authentication, rate limiting, and error handling
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface MetrcConfig {
  /** Metrc Vendor/Integrator Key (used as Basic Auth username) */
  vendorKey: string;

  /** Metrc User API Key (used as Basic Auth password) */
  userKey: string;

  /** State-specific license number */
  licenseNumber: string;

  /** Use sandbox environment (default: false) */
  sandbox?: boolean;

  /** API version (default: 'v2') */
  version?: 'v1' | 'v2';
}

export class MetrcApiClient {
  private client: AxiosInstance;
  private config: MetrcConfig;
  private baseURL: string;

  constructor(config: MetrcConfig) {
    this.config = {
      version: 'v2',
      sandbox: false,
      ...config,
    };

    // Minnesota API endpoint
    this.baseURL = this.config.sandbox
      ? 'https://sandbox-api-mn.metrc.com'
      : 'https://api-mn.metrc.com';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      // Metrc uses Basic Auth with Vendor Key as username and User Key as password
      auth: {
        username: this.config.vendorKey,
        password: this.config.userKey,
      },
    });

    // Add request interceptor for logging and rate limiting
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[Metrc API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[Metrc API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[Metrc API] Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle Metrc API errors with descriptive messages
   */
  private handleError(error: any): void {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error('[Metrc API] Authentication failed - check API key');
          break;
        case 403:
          console.error('[Metrc API] Forbidden - check license number and permissions');
          break;
        case 429:
          console.error('[Metrc API] Rate limit exceeded - slow down requests');
          break;
        case 500:
          console.error('[Metrc API] Metrc server error:', data);
          break;
        default:
          console.error(`[Metrc API] Error ${status}:`, data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('[Metrc API] No response received:', error.message);
    } else {
      // Error setting up request
      console.error('[Metrc API] Request setup error:', error.message);
    }
  }

  /**
   * Make GET request to Metrc API
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(endpoint, {
      params: {
        licenseNumber: this.config.licenseNumber,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * Make POST request to Metrc API
   */
  async post<T = any>(endpoint: string, data: any, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(endpoint, data, {
      params: {
        licenseNumber: this.config.licenseNumber,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * Make PUT request to Metrc API
   */
  async put<T = any>(endpoint: string, data: any, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(endpoint, data, {
      params: {
        licenseNumber: this.config.licenseNumber,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * Make DELETE request to Metrc API
   */
  async delete<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(endpoint, {
      params: {
        licenseNumber: this.config.licenseNumber,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * Get API version being used
   */
  getVersion(): string {
    return this.config.version || 'v2';
  }

  /**
   * Get base URL being used
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Check if using sandbox environment
   */
  isSandbox(): boolean {
    return this.config.sandbox || false;
  }
}

/**
 * Create a configured Metrc API client instance
 */
export function createMetrcClient(config: MetrcConfig): MetrcApiClient {
  return new MetrcApiClient(config);
}
