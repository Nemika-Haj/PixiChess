import * as express from 'express';
import * as socketio from 'socket.io';
import * as Names from './data/names.json';
import { ActionType, SocketConnection } from './types';
import * as _ from 'lodash';

const app = express();
app.set("port", process.env.PORT || 3000);

let actions: ActionType[] = []
let connectedSockets: SocketConnection[] = [];

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get("/", (req: any, res: any) => {
    res.send("hello world");
});

io.on('connection', (socket: socketio.Socket) => {
    const socketName = _.sample(Names);

    actions.forEach(action => socket.emit('movePawn', action.fromPoint, action.toPoint));

    socket.broadcast.emit('message', `${socketName} has joined the room!`);
    connectedSockets.push({ name: socketName, socket: socket });

    socket.on('message', (message: string) => {
        connectedSockets.forEach(connection => connection.socket.emit('message', `${socketName}: ${message}`));
    });

    socket.on('movePawn', (fromPoint: { x: number, y: number }, toPoint: { x: number, y: number }) => {
        const newAction = { fromPoint, toPoint };
        actions.push(newAction);
        socket.broadcast.emit('movePawn', newAction.fromPoint, newAction.toPoint);
    });

    socket.on('disconnect', (...rest) => {
        connectedSockets = connectedSockets.filter(connection => connection.socket.id != socket.id);

        if(connectedSockets.length == 0) {
            actions = [];
        }
    })
})

http.listen(3000, () => console.log("Listening on port 3000"));