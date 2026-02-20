const express = require("express");
const router = express.Router();
const blogsController = require("./blogs.controller");
const {
  createBlogValidation,
  updateBlogValidation,
  blogIdValidation,
  blogQueryValidation,
} = require("./blogs.validation");
const validate = require("../../middleware/validate");
const { protect, authorize } = require("../../middleware/auth");

// Public routes
router.get(
  "/published",
  validate(blogQueryValidation),
  blogsController.getPublishedBlogs
);
router.get("/tags", blogsController.getAllTags);
router.get("/slug/:slug", blogsController.getBlogBySlug);

// Protected routes
router
  .route("/")
  .get(
    protect,
    authorize("admin", "editor", "author"),
    validate(blogQueryValidation),
    blogsController.getAllBlogs
  )
  .post(
    protect,
    authorize("admin", "editor", "author"),
    validate(createBlogValidation),
    blogsController.createBlog
  );

router
  .route("/:id")
  .get(
    protect,
    authorize("admin", "editor", "author"),
    validate(blogIdValidation),
    blogsController.getBlogById
  )
  .put(
    protect,
    authorize("admin", "editor"),
    validate(updateBlogValidation),
    blogsController.updateBlog
  )
  .delete(
    protect,
    authorize("admin"),
    validate(blogIdValidation),
    blogsController.deleteBlog
  );

module.exports = router;
