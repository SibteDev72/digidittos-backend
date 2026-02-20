const blogsService = require("./blogs.service");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

// Admin: list all blogs (any status)
const getAllBlogs = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const { status, tag, search } = req.query;

  const { blogs, pagination } = await blogsService.getAllBlogs({
    page,
    limit,
    status,
    tag,
    search,
  });
  ApiResponse.paginated(res, blogs, pagination);
});

// Public: list only published blogs
const getPublishedBlogs = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const { tag, search } = req.query;

  const { blogs, pagination } = await blogsService.getPublishedBlogs({
    page,
    limit,
    tag,
    search,
  });
  ApiResponse.paginated(res, blogs, pagination);
});

const getBlogById = catchAsync(async (req, res) => {
  const blog = await blogsService.getBlogById(req.params.id);
  ApiResponse.success(res, blog);
});

// Public: get by slug (only published)
const getBlogBySlug = catchAsync(async (req, res) => {
  const blog = await blogsService.getBlogBySlug(req.params.slug);
  ApiResponse.success(res, blog);
});

const createBlog = catchAsync(async (req, res) => {
  const data = { ...req.body, author: req.user._id };
  const blog = await blogsService.createBlog(data);
  ApiResponse.created(res, blog, "Blog created successfully");
});

const updateBlog = catchAsync(async (req, res) => {
  const blog = await blogsService.updateBlog(req.params.id, req.body);
  ApiResponse.success(res, blog, "Blog updated successfully");
});

const deleteBlog = catchAsync(async (req, res) => {
  await blogsService.deleteBlog(req.params.id);
  ApiResponse.success(res, null, "Blog deleted successfully");
});

const getAllTags = catchAsync(async (req, res) => {
  const tags = await blogsService.getAllTags();
  ApiResponse.success(res, tags);
});

module.exports = {
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllTags,
};
