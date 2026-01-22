import dotenv from "dotenv"
import connectDB from "./src/config/db.js"
import { app } from "./src/app.js"
import {Server} from "socket.io"
import http from "http"

dotenv.config({
    path: "./.env"
})

const server = http.createServer(app)

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
    },
});

io.on("connection" , (socket)=>{
    console.log("Connected to socket.io")

    socket.on("join_project" , (projectId)=>{
        socket.join(projectId)
        console.log(`User joined project : ${projectId}`)
    })

    socket.on("task_updated" , (data)=>{
        console.log("SERVER RECEIVED UPDATE for Project:", data.projectId);
        socket.to(data.projectId).emit("task_updated",data);
    })

    socket.on("disconnect" , ()=>{
        console.log("User disconnected")
    })
})

app.set("io", io);

const PORT = process.env.PORT || 8000

connectDB().then(()=>{
    server.listen(PORT , ()=>{
        console.log(`Server is running on port : ${PORT}`)
        console.log(`http://localhost:${PORT}`)
    })
}).catch((err) => {
    console.log("MongoDB connection failed !" , err)
    process.exit(1)
})