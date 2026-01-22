import { asyncHandler } from "../../common/utils/asycnHandler.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { Task } from "./task.model.js";
import { Project } from "../projects/project.model.js";

const createTask = asyncHandler(async (req, res) => {
    const { title, description, priority, projectId, status, assignee } = req.body;

    if (!title || !projectId) {
        throw new ApiError(400, "Title and Project ID are required");
    }

    const validAssignee = (assignee && assignee !== "") ? assignee : null;

    const task = await Task.create({
        title,
        description,
        priority: priority || "medium",
        project: projectId,
        status: status || "todo",
        assignee: validAssignee 
    });

    return res.status(201).json(
        new ApiResponse(201, task, "Task created successfully")
    );
});


const getTasksByProject = asyncHandler(async (req,res)=>{
    const {projectId} = req.params

    const tasks = await Task.find({ project: projectId })
        .populate("assignee", "username email")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200 , tasks , "Tasks fetched successfully"))
})

const updateTaskStatus = asyncHandler(async(req,res)=>{
    const {taskId} = req.params
    const {status} = req.body

    const task = await Task.findById(taskId)

    if(!task){
        throw new ApiError(404,"Task not found")
    }

    task.status = status
    await task.save()

    return res.status(200).json(new ApiResponse(200 , task , "Task updated successfully!"))
})

const deleteTask = asyncHandler(async(req,res)=>{
    const {taskId} = req.params;
    
    const task = await Task.findByIdAndDelete(taskId)

    if(!task){
        throw new ApiError(404 , "Task not found")
    }

    return res.status(200).json(
        new ApiResponse(200 , {} , "Task deleted successfully")
    )
})

export { createTask, getTasksByProject, updateTaskStatus , deleteTask }