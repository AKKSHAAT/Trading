import {createServer} from 'http'
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors:{
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket)=>{
    console.log(`New user connected: ${socket.id}`);
    socket.emit('msg', "hello");
})



httpServer.listen(3000)
