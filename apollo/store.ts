import { makeVar } from '@apollo/client';

export const currentSocketVar = makeVar<null | WebSocket>(null);
export const isSocketConnectedVar = makeVar<boolean>(false);
