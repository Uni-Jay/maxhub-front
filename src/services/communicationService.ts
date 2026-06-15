import { apiClient } from './apiClient';
import type { MessageTemplate, CommunicationLog, CommStats } from '@/types';

export interface SendMessagePayload {
  channel: 'Email' | 'SMS' | 'WhatsApp';
  recipientType: 'All' | 'Department' | 'Selected' | 'Country' | 'Status';
  recipientFilter?: Record<string, unknown>;
  subject?: string;
  message: string;
  selectedClientIds?: string[];
  scheduledAt?: string;
}

export interface SendMessageResult {
  logId: number;
  totalRecipients: number;
  successCount: number;
  failureCount: number;
}

export interface LogListResponse {
  data: CommunicationLog[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const communicationService = {
  // Templates
  getTemplates: () => apiClient.get<MessageTemplate[]>('/communication/templates'),

  createTemplate: (data: Partial<MessageTemplate>) =>
    apiClient.post<MessageTemplate>('/communication/templates', data),

  updateTemplate: (id: number | string, data: Partial<MessageTemplate>) =>
    apiClient.patch<MessageTemplate>(`/communication/templates/${id}`, data),

  deleteTemplate: (id: number | string) =>
    apiClient.delete<void>(`/communication/templates/${id}`),

  // Send
  send: (payload: SendMessagePayload) =>
    apiClient.post<SendMessageResult>('/communication/send', payload),

  // Logs
  getLogs: (params?: Record<string, string>) =>
    apiClient.getRaw('/communication/logs', params) as Promise<LogListResponse>,

  getStats: () => apiClient.get<CommStats>('/communication/stats'),
};
