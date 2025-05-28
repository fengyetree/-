
import { api } from './api';
import type { User, Competition, Track, Registration, InsertUser, InsertCompetition, InsertTrack, InsertRegistration } from '@shared/schema';

// 用户相关API
export const userService = {
  getAllUsers: () => api.get<User[]>('/api/users'),
  getUserProfile: () => api.get<User>('/api/user'),
};

// 比赛相关API
export const competitionService = {
  getAllCompetitions: () => api.get<Competition[]>('/api/competitions'),
  getCompetition: (id: number) => api.get<Competition>(`/api/competitions/${id}`),
  createCompetition: (data: InsertCompetition) => api.post<Competition>('/api/competitions', data),
  updateCompetition: (id: number, data: Partial<InsertCompetition>) => api.put<Competition>(`/api/competitions/${id}`, data),
  deleteCompetition: (id: number) => api.delete(`/api/competitions/${id}`),
};

// 赛道相关API
export const trackService = {
  getAllTracks: () => api.get<Track[]>('/api/tracks'),
  getTrack: (id: number) => api.get<Track>(`/api/tracks/${id}`),
  createTrack: (data: InsertTrack) => api.post<Track>('/api/tracks', data),
};

// 报名相关API
export const registrationService = {
  getAllRegistrations: () => api.get<Registration[]>('/api/registrations'),
  checkRegistration: (competitionId: number) => api.get<boolean>(`/api/registrations/check/${competitionId}`),
  createRegistration: (data: InsertRegistration) => api.post<Registration>('/api/registrations', data),
  updateRegistrationStatus: (id: number, status: string) => api.put<Registration>(`/api/registrations/${id}`, { status }),
};
