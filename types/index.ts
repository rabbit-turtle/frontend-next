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
