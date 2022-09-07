import * as express from 'express';
import * as socketio from 'socket.io';
import { LogManager } from './Manager';
import { ActionType, Person, SocketConnection } from './types';
import * as _ from 'lodash';
import axios from 'axios';
import * as Names from './data/names.json'

const app = express();
app.set("port", process.env.PORT || 3000);

let actions: ActionType[] = [];
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

io.on('connection', async(socket: socketio.Socket) => {
    const socketName: string = _.sample(Names);

    actions.forEach(action => socket.emit('movePawn', action.fromPoint, action.toPoint));
    LogManager.chatLog.forEach(log => socket.emit('message', `[${log.date.fromNow()}] ${log.content}`));

    connectedSockets.push({ name: socketName, socket: socket });

    socket.broadcast.emit('message', LogManager.Log(`${socketName} has joined the room!`));

    socket.on('message', (message: string) => {
        console.log(LogManager.chatLog)
        connectedSockets.forEach(connection => connection.socket.emit('message', LogManager.Log(`${socketName}: ${message}`)));
    });

    socket.on('movePawn', (fromPoint: { x: number, y: number }, toPoint: { x: number, y: number }) => {
        const newAction = { fromPoint, toPoint };
        actions.push(newAction);
        socket.broadcast.emit('movePawn', newAction.fromPoint, newAction.toPoint);
    });

    socket.on('disconnect', () => {
        connectedSockets = connectedSockets.filter(connection => connection.socket.id != socket.id);
        
        if(connectedSockets.length == 0) {
            actions = [];
        }

        socket.broadcast.emit('message', LogManager.Log(`${socketName} has left the room!`))

    })
})

http.listen(3000, () => console.log("Listening on port 3000"));