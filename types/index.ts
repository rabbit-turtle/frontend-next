export interface IRoomLog {
  id: string;
  recentChat: IChatlog | null;
  roomStatus: { id: number; name: string };
  lastViewedChat: IChatlog | null;
  location: string;
  title: string;
  myId: string;
  receiver: { id: string; name: string };
  inviter: { id: string; name: string };
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

export interface Iauth {
  access_token: string;
  isLogined: boolean;
  userId: string;
  name: string;
  expires_in: number;
}
