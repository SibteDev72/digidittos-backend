const User = require("./users.model");
const ApiError = require("../../utils/ApiError");

const getAllUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().select("-password").skip(skip).limit(limit).sort("-createdAt"),
    User.countDocuments(),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
