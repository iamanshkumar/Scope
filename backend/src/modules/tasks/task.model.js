import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        trim : true
    },
    project : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project",
        required : true
    },
    assignee : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null
    },
    status : {
        type : String,
        enum : ["todo" , "in-progress" , "done"],
        default : "todo"
    },
    priority : {
        type : String,
        enum : ["low" , "medium" , "high"],
        default : "medium"
    },
    dueDate : {
        type : Date
    }
},
{ timestamps: true }
)

export const Task = mongoose.model("Task", taskSchema)