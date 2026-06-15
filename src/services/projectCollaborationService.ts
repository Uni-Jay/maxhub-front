import { apiClient } from './apiClient';

export const projectCollaborationService = {
  /**
   * Add comment
   */
  addComment: async (projectId: string, commentData: any): Promise<any> => {
    const response = await apiClient.post<any>(`/projects/${projectId}/comments`, commentData);
    return response;
  },

  /**
   * Update comment
   */
  updateComment: async (projectId: string, commentId: string, content: string): Promise<any> => {
    const response = await apiClient.put<any>(`/projects/${projectId}/comments/${commentId}`, { content });
    return response;
  },

  /**
   * Delete comment
   */
  deleteComment: async (projectId: string, commentId: string): Promise<any> => {
    const response = await apiClient.delete<any>(`/projects/${projectId}/comments/${commentId}`);
    return response;
  },

  /**
   * Resolve comment
   */
  resolveComment: async (projectId: string, commentId: string): Promise<any> => {
    const response = await apiClient.put<any>(`/projects/${projectId}/comments/${commentId}/resolve`);
    return response;
  },

  /**
   * Upload attachment
   */
  uploadAttachment: async (projectId: string, attachmentData: any): Promise<any> => {
    const response = await apiClient.post<any>(`/projects/${projectId}/attachments`, attachmentData);
    return response;
  },

  /**
   * Download attachment
   */
  downloadAttachment: async (projectId: string, attachmentId: string): Promise<any> => {
    const response = await apiClient.get<any>(`/projects/${projectId}/attachments/${attachmentId}`);
    return response;
  },

  /**
   * Assign task
   */
  assignTask: async (projectId: string, assignmentData: any): Promise<any> => {
    const response = await apiClient.post<any>(`/projects/${projectId}/tasks/assign`, assignmentData);
    return response;
  },

  /**
   * Accept task assignment
   */
  acceptTaskAssignment: async (projectId: string, assignmentId: string): Promise<any> => {
    const response = await apiClient.put<any>(`/projects/${projectId}/tasks/assignments/${assignmentId}/accept`);
    return response;
  },

  /**
   * Decline task assignment
   */
  declineTaskAssignment: async (projectId: string, assignmentId: string, reason: string): Promise<any> => {
    const response = await apiClient.put<any>(`/projects/${projectId}/tasks/assignments/${assignmentId}/decline`, { reason });
    return response;
  },

  /**
   * Create Kanban board
   */
  createKanbanBoard: async (projectId: string, boardData: any): Promise<any> => {
    const response = await apiClient.post<any>(`/projects/${projectId}/kanban`, boardData);
    return response;
  },

  /**
   * Update Kanban board
   */
  updateKanbanBoard: async (projectId: string, boardId: string, boardData: any): Promise<any> => {
    const response = await apiClient.put<any>(`/projects/${projectId}/kanban/${boardId}`, boardData);
    return response;
  },

  /**
   * Move task on Kanban
   */
  moveTaskOnKanban: async (projectId: string, boardId: string, taskId: string, newStatus: string): Promise<any> => {
    const response = await apiClient.put<any>(`/projects/${projectId}/kanban/${boardId}/move-task`, {
      taskId,
      newStatus,
    });
    return response;
  },

  /**
   * Get Kanban board view
   */
  getKanbanView: async (projectId: string, boardId: string): Promise<any> => {
    const response = await apiClient.get<any>(`/projects/${projectId}/kanban/${boardId}`);
    return response;
  },
};
