export interface IRoomLog {
  id: string;
  recentChat: IChatlog | null;
  roomStatus: { id: number; name: string };
}

export interface IChatlog {
  id?: string;
  content: string;
  isSender: boolean;
  created_at: string;
}

export interface ICoords {
  latitude: number;
  longitude: number;
}
