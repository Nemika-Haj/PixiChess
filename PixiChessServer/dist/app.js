"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
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
    console.log(socket.id, "connected");
    connectedSockets.push(socket);
    socket.on('message', (message) => {
        connectedSockets.forEach(connection => connection.emit('message', `${socket.id}: ${message}`));
    });
    socket.on('movePawn', (fromPoint, point) => {
        connectedSockets.filter(connection => connection.id != socket.id).forEach(connection => connection.emit('movePawn', fromPoint, point));
    });
});
http.listen(3000, () => console.log("Listening on port 3000"));
//# sourceMappingURL=app.js.map