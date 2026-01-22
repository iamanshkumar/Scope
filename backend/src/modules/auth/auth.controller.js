import { asyncHandler } from "../../common/utils/asycnHandler.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { User } from "../users/user.model.js";

const options = {
    httpOnly : true,
    secure : process.env.NODE_ENV === "production"
}

const registerUser = asyncHandler(async(req , res)=>{
    const {email , username , password , role} = req.body
    
    if([email , username , password].some((field)=>field?.trim()==="")){
        throw new ApiError(400 , "All fields are required")
    }

    const existedUser = await User.findOne({
        $or : [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        email,
        password,
        username : username.toLowerCase(),
        role : role || "member"
    })

    const createdUser = await User.findById(user._id).select("-password")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser ,"User generated successfully" )
    )
})


const loginUser = asyncHandler(async (req,res)=> {
    const {email , password} = req.body

    if(!email){
        throw new ApiError(400 , "Email is required")
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        throw new ApiError(404 , "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401 , "Invalid user credentials")
    }

    const accessToken = user.generateAccessToken()

    const loggedInUser = await User.findById(user._id).select("-password")

    return res.status(200).cookie("accessToken",accessToken,options).json(
        new ApiResponse(200,{user : loggedInUser , accessToken},"User logged in successfully")
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    return res.status(300).clearCookie("accessToken",options).json(
        new ApiResponse(200,{},"User logged out")
    )
})

export {registerUser , loginUser , logoutUser}