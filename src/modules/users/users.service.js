const User = require("./users.model");
const ApiError = require("../../utils/ApiError");

const getAllUsers = async ({ page = 1, limit = 10, search, role, isActive }) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const [users, total] = await Promise.all([
    User.find(filter).select("-password").skip(skip).limit(limit).sort("-createdAt"),
    User.countDocuments(filter),
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

const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  const user = await User.create(userData);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const updateUser = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent demoting the last admin
  if (user.role === "admin" && updateData.role && updateData.role !== "admin") {
    const adminCount = await User.countDocuments({ role: "admin", isActive: true });
    if (adminCount <= 1) {
      throw new ApiError(400, "Cannot change role of the last active admin");
    }
  }

  // Prevent deactivating the last admin
  if (user.role === "admin" && updateData.isActive === false) {
    const adminCount = await User.countDocuments({ role: "admin", isActive: true });
    if (adminCount <= 1) {
      throw new ApiError(400, "Cannot deactivate the last active admin");
    }
  }

  // Check email uniqueness if email is being changed
  if (updateData.email && updateData.email !== user.email) {
    const emailTaken = await User.findOne({ email: updateData.email, _id: { $ne: id } });
    if (emailTaken) {
      throw new ApiError(400, "Email already registered");
    }
  }

  // If password is being updated, use save() so the pre-save hook hashes it
  if (updateData.password) {
    if (updateData.name !== undefined) user.name = updateData.name;
    if (updateData.email !== undefined) user.email = updateData.email;
    if (updateData.role !== undefined) user.role = updateData.role;
    user.password = updateData.password;
    if (updateData.isActive !== undefined) {
      user.isActive = updateData.isActive;
    }
    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;
    return updatedUser;
  }

  // Remove password field to prevent unhashed direct assignment
  delete updateData.password;

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  return updatedUser;
};

const deleteUser = async (id, requestingUserId) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent self-deletion
  if (id.toString() === requestingUserId.toString()) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  // Prevent deleting the last admin
  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin", isActive: true });
    if (adminCount <= 1) {
      throw new ApiError(400, "Cannot delete the last active admin");
    }
  }

  await User.findByIdAndDelete(id);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
