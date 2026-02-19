const Setting = require("./settings.model");
const ApiError = require("../../utils/ApiError");

const getAllSettings = async () => {
  return Setting.find().sort("key");
};

const getSettingByKey = async (key) => {
  const setting = await Setting.findOne({ key });
  if (!setting) {
    throw new ApiError(404, `Setting '${key}' not found`);
  }
  return setting;
};

const upsertSetting = async ({ key, value, description }) => {
  const setting = await Setting.findOneAndUpdate(
    { key },
    { key, value, description },
    { new: true, upsert: true, runValidators: true }
  );
  return setting;
};

const deleteSetting = async (key) => {
  const setting = await Setting.findOneAndDelete({ key });
  if (!setting) {
    throw new ApiError(404, `Setting '${key}' not found`);
  }
};

module.exports = { getAllSettings, getSettingByKey, upsertSetting, deleteSetting };
