import { User } from "../users/user.model.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { asyncHandler } from "../../common/utils/asycnHandler.js";
import { ApiError } from "../../common/utils/ApiError.js";

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, users, "All users fetched successfully")
    );
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role, status } = req.body;

    const validRoles = ["admin", "manager", "member"];
    const validStatus = ["active", "inactive", "banned"];

    if (role && !validRoles.includes(role)) throw new ApiError(400, "Invalid role");
    if (status && !validStatus.includes(status)) throw new ApiError(400, "Invalid status");

    const user = await User.findByIdAndUpdate(
        userId,
        { 
            ...(role && { role }), 
            ...(status && { status }) 
        },
        { new: true }
    ).select("-password");

    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(
        new ApiResponse(200, user, "User updated successfully")
    );
});

export { getAllUsers, updateUserProfile };