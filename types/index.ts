export interface IChatlog {
  id?: string;
  content: string;
  isSender: boolean;
  createdAt: string;
}

export interface ICoords {
  latitude: number;
  longitude: number;
}
