export enum ROUTES {
  map = '/map',
  chat = '/chat',
}

export enum SOCKET_MESSAGE_TYPE {
  chat = 'chat',
  map = 'location',
}

export enum ALLOWED_CHAT_TYPES {
  NORMAL = 'NORMAL',
  SUGGESTION = 'SUGGESTION',
  SUGGESTION_CONFIRMED = 'SUGGESTION_CONFIRMED',
  SUGGESTION_REFUSED = 'SUGGESTION_REFUSED',
}
