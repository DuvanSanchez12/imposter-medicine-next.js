// lib/socket.ts
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
// Apuntamos al puerto 4000 del nuevo backend
export const socket = io(SOCKET_URL, {
    transports: ["websocket"] 
});