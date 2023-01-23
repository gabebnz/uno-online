import React, { createContext } from 'react';
import io, { type Socket } from 'socket.io-client';

const socket = io('');

export const SocketContext = createContext<Socket>(socket);

