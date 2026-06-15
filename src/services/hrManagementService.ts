import { apiClient } from './apiClient';

export const hrManagementService = {
  /**
   * Issue warning
   */
  issueWarning: async (warningData: any): Promise<any> => {
    const response = await apiClient.post<any>('/hr/warnings/issue', warningData);
    return response;
  },

  /**
   * Acknowledge warning
   */
  acknowledgeWarning: async (warningId: string): Promise<any> => {
    const response = await apiClient.put<any>(`/hr/warnings/${warningId}/acknowledge`);
    return response;
  },

  /**
   * Submit resignation
   */
  submitResignation: async (resignationData: any): Promise<any> => {
    const response = await apiClient.post<any>('/hr/resignation/submit', resignationData);
    return response;
  },

  /**
   * Approve resignation
   */
  approveResignation: async (resignationId: string): Promise<any> => {
    const response = await apiClient.put<any>(`/hr/resignation/${resignationId}/approve`);
    return response;
  },

  /**
   * Propose promotion
   */
  proposePromotion: async (promotionData: any): Promise<any> => {
    const response = await apiClient.post<any>('/hr/promotion/propose', promotionData);
    return response;
  },

  /**
   * Approve promotion
   */
  approvePromotion: async (promotionId: string): Promise<any> => {
    const response = await apiClient.put<any>(`/hr/promotion/${promotionId}/approve`);
    return response;
  },

  /**
   * Complete onboarding task
   */
  completeOnboardingTask: async (taskId: string, updateData: any): Promise<any> => {
    const response = await apiClient.put<any>(`/hr/onboarding/${taskId}/complete`, updateData);
    return response;
  },

  /**
   * Get employee records
   */
  getEmployeeRecords: async (staffId: string): Promise<any> => {
    const response = await apiClient.get<any>(`/hr/records/${staffId}`);
    return response;
  },

  /**
   * Update employee records
   */
  updateEmployeeRecords: async (staffId: string, recordData: any): Promise<any> => {
    const response = await apiClient.put<any>(`/hr/records/${staffId}`, recordData);
    return response;
  },
};
