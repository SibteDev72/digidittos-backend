const teamsService = require("./teams.service");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

// Admin: list all team members (active & inactive)
const getAllTeams = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const { search, isActive } = req.query;

  const { members, pagination } = await teamsService.getAllTeams({
    page,
    limit,
    search,
    isActive,
  });
  ApiResponse.paginated(res, members, pagination);
});

// Public: get all active team members
const getPublicTeam = catchAsync(async (req, res) => {
  const members = await teamsService.getPublicTeam();
  ApiResponse.success(res, members);
});

const getTeamById = catchAsync(async (req, res) => {
  const member = await teamsService.getTeamById(req.params.id);
  ApiResponse.success(res, member);
});

// Public: get by slug (only active)
const getTeamBySlug = catchAsync(async (req, res) => {
  const member = await teamsService.getTeamBySlug(req.params.slug);
  ApiResponse.success(res, member);
});

const createTeam = catchAsync(async (req, res) => {
  const member = await teamsService.createTeam(req.body);
  ApiResponse.created(res, member, "Team member created successfully");
});

const updateTeam = catchAsync(async (req, res) => {
  const member = await teamsService.updateTeam(req.params.id, req.body);
  ApiResponse.success(res, member, "Team member updated successfully");
});

const deleteTeam = catchAsync(async (req, res) => {
  await teamsService.deleteTeam(req.params.id);
  ApiResponse.success(res, null, "Team member deleted successfully");
});

const reorderTeam = catchAsync(async (req, res) => {
  await teamsService.reorderTeam(req.body.orderedIds);
  ApiResponse.success(res, null, "Team order updated successfully");
});

module.exports = {
  getAllTeams,
  getPublicTeam,
  getTeamById,
  getTeamBySlug,
  createTeam,
  updateTeam,
  deleteTeam,
  reorderTeam,
};
