const usersService = require("./users.service");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

const getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const { search, isActive } = req.query;
  const { users, pagination } = await usersService.getAllUsers({
    page,
    limit,
    search,
    isActive,
  });
  ApiResponse.paginated(res, users, pagination);
});

const getUserById = catchAsync(async (req, res) => {
  const user = await usersService.getUserById(req.params.id);
  ApiResponse.success(res, user);
});

const createUser = catchAsync(async (req, res) => {
  const user = await usersService.createUser(req.body);
  ApiResponse.created(res, user, "User created successfully");
});

const updateUser = catchAsync(async (req, res) => {
  const user = await usersService.updateUser(req.params.id, req.body);
  ApiResponse.success(res, user, "User updated successfully");
});

const deleteUser = catchAsync(async (req, res) => {
  await usersService.deleteUser(req.params.id, req.user._id);
  ApiResponse.success(res, null, "User deleted successfully");
});

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
