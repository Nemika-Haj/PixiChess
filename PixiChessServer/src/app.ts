import * as express from 'express';
import * as socketio from 'socket.io';

const app = express();
app.set("port", process.env.PORT || 3000);

const connectedSockets: socketio.Socket[] = []

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
    console.log(socket.id, "connected")
    connectedSockets.push(socket)

    socket.on('message', (message: string) => {
        connectedSockets.forEach(connection => connection.emit('message', `${socket.id}: ${message}`))
    })

    socket.on('movePawn', (fromPoint: { x: number, y: number }, point: { x: number, y: number }) => {
        connectedSockets.filter(connection => connection.id != socket.id).forEach(connection => connection.emit('movePawn', fromPoint, point))
    })
})

http.listen(3000, () => console.log("Listening on port 3000"));