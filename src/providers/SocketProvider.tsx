import React, { createContext } from 'react';
import io, { type Socket } from 'socket.io-client';

const socket = io('http://localhost:4000');

export const SocketContext = createContext<Socket>(socket);

