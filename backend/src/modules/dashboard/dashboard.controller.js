import mongoose from "mongoose";
import { asyncHandler } from "../../common/utils/asycnHandler.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { Project } from "../projects/project.model.js";
import { Task } from "../tasks/task.model.js";

const getDashboardStats = asyncHandler(async(req , res)=>{
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const projects = await Project.find(
        {
            $or: [{ owner: userId }, { members: userId }]
        }
    )

    const projectIds = projects.map(p=>p._id)

    const tasks = await Task.find({ project: { $in: projectIds } });

    const stats = {
        totalProjects: projects.length,
        totalTasks: tasks.length,
        tasksByStatus: {
            todo: tasks.filter(t => t.status === 'todo').length,
            inProgress: tasks.filter(t => t.status === 'in-progress').length,
            done: tasks.filter(t => t.status === 'done').length
        },
        highPriorityTasks: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length
    };

    return res.status(200).json(
        new ApiResponse(200, { stats, recentProjects: projects.slice(0, 3) }, "Dashboard stats fetched")
    );
})

export {getDashboardStats}