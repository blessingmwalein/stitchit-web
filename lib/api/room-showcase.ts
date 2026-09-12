import { apiRequest } from './client';

export interface RoomShowcaseItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
  displayOrder: number;
}

export const roomShowcaseApi = {
  getRoomShowcases(): Promise<RoomShowcaseItem[]> {
    return apiRequest<RoomShowcaseItem[]>('/public/room-showcases', {
      method: 'GET',
      skipAuth: true,
    }).catch(() => []);
  },
};
