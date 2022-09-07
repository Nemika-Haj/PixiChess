import { Socket } from "socket.io"

export type SocketConnection = {
    socket: Socket,
    name: string
};

export type ActionType = {
    fromPoint: { x: number, y: number },
    toPoint: { x: number, y: number }
}