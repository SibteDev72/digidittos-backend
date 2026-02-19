const { body, param } = require("express-validator");

const upsertSettingValidation = [
  body("key").trim().notEmpty().withMessage("Setting key is required"),
  body("value").notEmpty().withMessage("Setting value is required"),
  body("description").optional().trim(),
];

const settingKeyValidation = [
  param("key").trim().notEmpty().withMessage("Setting key is required"),
];

module.exports = { upsertSettingValidation, settingKeyValidation };
