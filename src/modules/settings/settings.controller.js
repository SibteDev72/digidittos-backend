const settingsService = require("./settings.service");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

const getAllSettings = catchAsync(async (req, res) => {
  const settings = await settingsService.getAllSettings();
  ApiResponse.success(res, settings);
});

const getSettingByKey = catchAsync(async (req, res) => {
  const setting = await settingsService.getSettingByKey(req.params.key);
  ApiResponse.success(res, setting);
});

const upsertSetting = catchAsync(async (req, res) => {
  const setting = await settingsService.upsertSetting(req.body);
  ApiResponse.success(res, setting, "Setting saved successfully");
});

const deleteSetting = catchAsync(async (req, res) => {
  await settingsService.deleteSetting(req.params.key);
  ApiResponse.success(res, null, "Setting deleted successfully");
});

module.exports = { getAllSettings, getSettingByKey, upsertSetting, deleteSetting };
