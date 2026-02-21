const caseStudiesService = require("./caseStudies.service");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

// Admin: list all case studies (any status)
const getAllCaseStudies = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const { status, tag, search } = req.query;

  const { caseStudies, pagination } = await caseStudiesService.getAllCaseStudies({
    page,
    limit,
    status,
    tag,
    search,
  });
  ApiResponse.paginated(res, caseStudies, pagination);
});

// Public: list only published case studies
const getPublishedCaseStudies = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const { tag, search } = req.query;

  const { caseStudies, pagination } =
    await caseStudiesService.getPublishedCaseStudies({
      page,
      limit,
      tag,
      search,
    });
  ApiResponse.paginated(res, caseStudies, pagination);
});

const getCaseStudyById = catchAsync(async (req, res) => {
  const caseStudy = await caseStudiesService.getCaseStudyById(req.params.id);
  ApiResponse.success(res, caseStudy);
});

// Public: get by slug (only published)
const getCaseStudyBySlug = catchAsync(async (req, res) => {
  const caseStudy = await caseStudiesService.getCaseStudyBySlug(
    req.params.slug
  );
  ApiResponse.success(res, caseStudy);
});

const createCaseStudy = catchAsync(async (req, res) => {
  const data = { ...req.body, author: req.user._id };
  const caseStudy = await caseStudiesService.createCaseStudy(data);
  ApiResponse.created(res, caseStudy, "Case study created successfully");
});

const updateCaseStudy = catchAsync(async (req, res) => {
  const caseStudy = await caseStudiesService.updateCaseStudy(
    req.params.id,
    req.body
  );
  ApiResponse.success(res, caseStudy, "Case study updated successfully");
});

const deleteCaseStudy = catchAsync(async (req, res) => {
  await caseStudiesService.deleteCaseStudy(req.params.id);
  ApiResponse.success(res, null, "Case study deleted successfully");
});

const getAllTags = catchAsync(async (req, res) => {
  const tags = await caseStudiesService.getAllTags();
  ApiResponse.success(res, tags);
});

module.exports = {
  getAllCaseStudies,
  getPublishedCaseStudies,
  getCaseStudyById,
  getCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getAllTags,
};
