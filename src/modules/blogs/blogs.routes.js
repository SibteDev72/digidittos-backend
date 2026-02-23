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
const { protect } = require("../../middleware/auth");

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
  .get(protect, validate(blogQueryValidation), blogsController.getAllBlogs)
  .post(protect, validate(createBlogValidation), blogsController.createBlog);

router
  .route("/:id")
  .get(protect, validate(blogIdValidation), blogsController.getBlogById)
  .put(protect, validate(updateBlogValidation), blogsController.updateBlog)
  .delete(protect, validate(blogIdValidation), blogsController.deleteBlog);

module.exports = router;
