import { asyncHandler } from "../../common/utils/asycnHandler.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { Project } from "./project.model.js";
import {User} from '../users/user.model.js'

const createProject = asyncHandler(async (req,res)=>{
    const {name , description} = req.body

    if(!name){
        throw new ApiError(400 , "Project name is required")
    }

    const project = await Project.create({
        name,
        description,
        owner : req.user._id
    })

    return res.status(201).json(new ApiResponse(201,project,"Project created successfully!"))
})

const getAllProjects = asyncHandler(async(req,res)=>{
    let query = {}

    const projects = await Project.find({
        $or: [
            { owner: req.user._id },   
            { members: req.user._id }  
        ]
    })
    .populate("owner", "username")
    .sort({ createdAt: -1 });


    return res.status(200).json(new ApiResponse(200,projects,"Projects fetched successfully"))
})

const getProjectById = asyncHandler(async(req,res)=>{
    const {projectId} = req.params

    const project = await Project.findById(projectId).populate("owner", "username email").populate("members", "username email")

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const isMember = project.members.some(
        (member) => member._id.toString() === req.user._id.toString()
    );
    const isOwner = project.owner._id.toString() === req.user._id.toString();

    if (!isOwner && !isMember) {
        throw new ApiError(403, "You do not have access to this project");
    }

    return res.status(200).json(new ApiResponse(200 , project , "Project details fetched successfully"))
})

const addMember = asyncHandler(async(req,res)=>{
    const {projectId} = req.params
    const {email} = req.body

    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404 , "Project not found")
    }

    if(project.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403 , "Only project owners can add new members")
    }

    const userToAdd = await User.findOne({email})
    if(!userToAdd){
        throw new ApiError(404 , "User with this email does not exist")
    }

    if (project.members.includes(userToAdd._id)) {
        throw new ApiError(400, "User is already a member");
    }

    project.members.push(userToAdd._id);
    await project.save();

    return res.status(200).json(
        new ApiResponse(200, project, "Member added successfully")
    );
})

export {createProject , getAllProjects , getProjectById , addMember}