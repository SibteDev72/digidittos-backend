const contentService = require("./content.service");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

const getAllContent = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const { status } = req.query;

  const { items, pagination } = await contentService.getAllContent({
    page,
    limit,
    status,
  });
  ApiResponse.paginated(res, items, pagination);
});

const getContentById = catchAsync(async (req, res) => {
  const content = await contentService.getContentById(req.params.id);
  ApiResponse.success(res, content);
});

const getContentBySlug = catchAsync(async (req, res) => {
  const content = await contentService.getContentBySlug(req.params.slug);
  ApiResponse.success(res, content);
});

const createContent = catchAsync(async (req, res) => {
  const data = { ...req.body, author: req.user._id };
  const content = await contentService.createContent(data);
  ApiResponse.created(res, content, "Content created successfully");
});

const updateContent = catchAsync(async (req, res) => {
  const content = await contentService.updateContent(req.params.id, req.body);
  ApiResponse.success(res, content, "Content updated successfully");
});

const deleteContent = catchAsync(async (req, res) => {
  await contentService.deleteContent(req.params.id);
  ApiResponse.success(res, null, "Content deleted successfully");
});

module.exports = {
  getAllContent,
  getContentById,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
};
