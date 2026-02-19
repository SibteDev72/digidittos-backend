const mediaService = require("./media.service");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");

const getAllMedia = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const { items, pagination } = await mediaService.getAllMedia({ page, limit });
  ApiResponse.paginated(res, items, pagination);
});

const uploadMedia = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a file");
  }

  const media = await mediaService.uploadMedia(req.file, req.user._id);
  ApiResponse.created(res, media, "File uploaded successfully");
});

const getMediaById = catchAsync(async (req, res) => {
  const media = await mediaService.getMediaById(req.params.id);
  ApiResponse.success(res, media);
});

const deleteMedia = catchAsync(async (req, res) => {
  await mediaService.deleteMedia(req.params.id);
  ApiResponse.success(res, null, "Media deleted successfully");
});

module.exports = { getAllMedia, uploadMedia, getMediaById, deleteMedia };
