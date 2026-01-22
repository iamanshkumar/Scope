import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asycnHandler.js"
import { User } from "../../modules/users/user.model.js"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")

        if(!token){
            throw new ApiError(401,"Unauthorized request : no token provided")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token: User not found")
        }

        req.user = user;
        next()
    }catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})

export const verifyAdmin = (req, res, next) => {
    // This relies on verifyJWT running first to populate req.user
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return next(new ApiError(403, "Access denied. Admin privileges required."));
    }
};