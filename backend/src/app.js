import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./modules/auth/auth.routes.js"
import projectRouter from "./modules/projects/project.routes.js"
import taskRouter from "./modules/tasks/task.routes.js"
import dashboardRouter from "./modules/dashboard/dashboard.routes.js"
import adminRouter from "./modules/admin/admin.routes.js"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/",(req,res)=>{
    res.status(200).json({
        message : "Scope API is running",
        environment : process.env.NODE_ENV
    })
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    });
})



export {app}