const express = require("express");
const router = express.Router();
const settingsController = require("./settings.controller");
const {
  upsertSettingValidation,
  settingKeyValidation,
} = require("./settings.validation");
const validate = require("../../middleware/validate");
const { protect, authorize } = require("../../middleware/auth");

router.use(protect, authorize("admin"));

router
  .route("/")
  .get(settingsController.getAllSettings)
  .put(validate(upsertSettingValidation), settingsController.upsertSetting);

router
  .route("/:key")
  .get(validate(settingKeyValidation), settingsController.getSettingByKey)
  .delete(validate(settingKeyValidation), settingsController.deleteSetting);

module.exports = router;
