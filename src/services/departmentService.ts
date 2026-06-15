import { apiClient } from './apiClient';

export interface Department {
  id: number;
  name: string;
  code: string;
  status: string;
}

export interface Designation {
  id: number;
  name: string;
  code: string;
  level: number;
  departmentId?: number;
}

export const departmentService = {
  getAll: () => apiClient.get<Department[]>('/departments'),
};

export const designationService = {
  getAll: (departmentId?: number) =>
    apiClient.get<Designation[]>('/designations', departmentId ? { departmentId } : undefined),
};
