const express = require("express");
const router = express.Router();
const mediaController = require("./media.controller");
const { mediaIdValidation, mediaQueryValidation } = require("./media.validation");
const validate = require("../../middleware/validate");
const { protect, authorize } = require("../../middleware/auth");
const upload = require("../../middleware/upload");

router.use(protect);

router
  .route("/")
  .get(validate(mediaQueryValidation), mediaController.getAllMedia);

router.post(
  "/upload",
  authorize("admin", "editor", "author"),
  upload.single("file"),
  mediaController.uploadMedia
);

router
  .route("/:id")
  .get(validate(mediaIdValidation), mediaController.getMediaById)
  .delete(
    authorize("admin"),
    validate(mediaIdValidation),
    mediaController.deleteMedia
  );

module.exports = router;
