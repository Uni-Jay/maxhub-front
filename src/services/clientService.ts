import { apiClient } from './apiClient';
import type { ClientItem, ClientDocument, ClientNote } from '@/types';

export interface ClientListResponse {
  data: ClientItem[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

export const clientService = {
  getAll: (params?: Record<string, string>) =>
    apiClient.getRaw('/clients', params) as Promise<ClientListResponse>,

  getStats: () => apiClient.get<ClientStats>('/clients/stats'),

  getById: (id: number | string) => apiClient.get<ClientItem>(`/clients/${id}`),

  create: (data: Partial<ClientItem>) => apiClient.post<ClientItem>('/clients', data),

  update: (id: number | string, data: Partial<ClientItem>) =>
    apiClient.patch<ClientItem>(`/clients/${id}`, data),

  delete: (id: number | string) => apiClient.delete<void>(`/clients/${id}`),

  // Documents
  getDocuments: (clientId: number | string) =>
    apiClient.get<ClientDocument[]>(`/clients/${clientId}/documents`),

  uploadDocument: (clientId: number | string, data: Partial<ClientDocument>) =>
    apiClient.post<ClientDocument>(`/clients/${clientId}/documents`, data),

  deleteDocument: (clientId: number | string, docId: number | string) =>
    apiClient.delete<void>(`/clients/${clientId}/documents/${docId}`),

  // Notes
  getNotes: (clientId: number | string) =>
    apiClient.get<ClientNote[]>(`/clients/${clientId}/notes`),

  addNote: (clientId: number | string, note: string) =>
    apiClient.post<ClientNote>(`/clients/${clientId}/notes`, { note }),

  deleteNote: (clientId: number | string, noteId: number | string) =>
    apiClient.delete<void>(`/clients/${clientId}/notes/${noteId}`),
};
