"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Names = require("./data/names.json");
const _ = require("lodash");
const app = express();
app.set("port", process.env.PORT || 3000);
const connectedSockets = [];
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
io.on('connection', (socket) => {
    const socketName = _.sample(Names);
    socket.broadcast.emit('message', `${socketName} has joined the room!`);
    connectedSockets.push({ name: socketName, socket: socket });
    socket.on('message', (message) => {
        connectedSockets.forEach(connection => connection.socket.emit('message', `${socketName}: ${message}`));
    });
    socket.on('movePawn', (fromPoint, point) => {
        connectedSockets.filter(connection => connection.socket.id != socket.id).forEach(connection => connection.socket.emit('movePawn', fromPoint, point));
    });
});
http.listen(3000, () => console.log("Listening on port 3000"));
//# sourceMappingURL=app.js.map