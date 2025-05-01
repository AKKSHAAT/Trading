import "dotenv/config"
import { Server } from "socket.io";
import http from 'http'

export default function socketConnection(app:any){
    const PORT = process.env.PORT
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
          origin: "*", // Allow all origins
        },
    });

    io.on("connection", (socket)=>{
        console.log(`Connected established: ${socket.id}`)
    })

    server.listen(PORT, ()=>{
        console.log(`Socket open on port: ${PORT}`)
    })
}