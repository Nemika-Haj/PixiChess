"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Manager_1 = require("./Manager");
const _ = require("lodash");
const Names = require("./data/names.json");
const app = express();
app.set("port", process.env.PORT || 3000);
let actions = [];
let connectedSockets = [];
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.get("/", (req, res) => {
    res.send("hello world");
});
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const socketName = _.sample(Names);
    actions.forEach(action => socket.emit('movePawn', action.fromPoint, action.toPoint));
    Manager_1.LogManager.chatLog.forEach(log => socket.emit('message', `[${log.date.fromNow()}] ${log.content}`));
    connectedSockets.push({ name: socketName, socket: socket });
    socket.broadcast.emit('message', Manager_1.LogManager.Log(`${socketName} has joined the room!`));
    socket.on('message', (message) => {
        connectedSockets.forEach(connection => connection.socket.emit('message', Manager_1.LogManager.Log(`${socketName}: ${message}`)));
    });
    socket.on('movePawn', (fromPoint, toPoint) => {
        const newAction = { fromPoint, toPoint };
        actions.push(newAction);
        socket.broadcast.emit('movePawn', newAction.fromPoint, newAction.toPoint);
    });
    socket.on('disconnect', () => {
        connectedSockets = connectedSockets.filter(connection => connection.socket.id != socket.id);
        if (connectedSockets.length == 0) {
            actions = [];
        }
        socket.broadcast.emit('message', Manager_1.LogManager.Log(`${socketName} has left the room!`));
    });
    setInterval(() => {
        connectedSockets.forEach(connection => connection.socket.emit('updateUsers', connectedSockets.length));
    });
}));
http.listen(3000, () => console.log("Listening on port 3000"));
//# sourceMappingURL=app.js.map