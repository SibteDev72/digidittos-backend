const express = require("express");
const router = express.Router();
const contentController = require("./content.controller");
const {
  createContentValidation,
  updateContentValidation,
  contentIdValidation,
  contentQueryValidation,
} = require("./content.validation");
const validate = require("../../middleware/validate");
const { protect, authorize } = require("../../middleware/auth");

router
  .route("/")
  .get(validate(contentQueryValidation), contentController.getAllContent)
  .post(
    protect,
    authorize("admin", "editor", "author"),
    validate(createContentValidation),
    contentController.createContent
  );

router.get("/slug/:slug", contentController.getContentBySlug);

router
  .route("/:id")
  .get(validate(contentIdValidation), contentController.getContentById)
  .put(
    protect,
    authorize("admin", "editor"),
    validate(updateContentValidation),
    contentController.updateContent
  )
  .delete(
    protect,
    authorize("admin"),
    validate(contentIdValidation),
    contentController.deleteContent
  );

module.exports = router;
