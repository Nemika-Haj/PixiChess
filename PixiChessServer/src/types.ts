import { Socket } from "socket.io"

export type SocketConnection = {
    socket: Socket,
    name: string
};

export type ActionType = {
    fromPoint: { x: number, y: number },
    toPoint: { x: number, y: number }
}

export type Person = {
    results: {
        gender: string,
        name: {
            title: string,
            first: string,
            last: string
        },
        location: object,
        city: string,
        state: string,
        country: StaticRange,
        postcode: string,
        coordinates: object,
        timezone: object,
        email: string,
        login: object,
        dob: object,
        registered: object,
        phone: string,
        id: object,
        picture: object,
        info: object
    }[]
}