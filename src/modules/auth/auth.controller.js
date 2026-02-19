const authService = require("./auth.service");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  ApiResponse.created(res, result, "Registration successful");
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  ApiResponse.success(res, result, "Login successful");
});

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  ApiResponse.success(res, user);
});

const logout = catchAsync(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  ApiResponse.success(res, null, "Logged out successfully");
});

module.exports = { register, login, getMe, logout };
