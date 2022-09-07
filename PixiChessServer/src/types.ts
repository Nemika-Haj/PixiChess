import { Socket } from "socket.io"

export type SocketConnection = {
    socket: Socket,
    name: string
};