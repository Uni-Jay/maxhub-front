import { apiClient } from './apiClient';
import type { StaffQuery, StaffQueryReply, QueryStats } from '@/types';

export interface QueryListResponse {
  data: StaffQuery[];
  stats: QueryStats;
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const queryService = {
  getAll: (params?: Record<string, string>) =>
    apiClient.getRaw('/queries', params) as Promise<QueryListResponse>,

  getStats: () => apiClient.get<QueryStats>('/queries/stats'),

  getById: (id: number | string) =>
    apiClient.get<StaffQuery & { replies: StaffQueryReply[] }>(`/queries/${id}`),

  create: (data: Partial<StaffQuery>) => apiClient.post<StaffQuery>('/queries', data),

  update: (id: number | string, data: Partial<StaffQuery>) =>
    apiClient.patch<StaffQuery>(`/queries/${id}`, data),

  delete: (id: number | string) => apiClient.delete<void>(`/queries/${id}`),

  addReply: (id: number | string, data: { message: string; isInternal?: boolean; attachments?: string[] }) =>
    apiClient.post<StaffQueryReply>(`/queries/${id}/replies`, data),

  resolve: (id: number | string) => apiClient.patch<StaffQuery>(`/queries/${id}/resolve`, {}),
};
