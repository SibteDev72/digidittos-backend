const Team = require("./teams.model");
const ApiError = require("../../utils/ApiError");

const getAllTeams = async ({ page = 1, limit = 10, search, isActive }) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (typeof isActive !== "undefined") {
    filter.isActive = isActive === "true" || isActive === true;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ];
  }

  const [members, total] = await Promise.all([
    Team.find(filter)
      .skip(skip)
      .limit(limit)
      .sort("displayOrder createdAt"),
    Team.countDocuments(filter),
  ]);

  return {
    members,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Public: only active members, sorted by display order
const getPublicTeam = async () => {
  const members = await Team.find({ isActive: true })
    .select("name slug role photo bio socials")
    .sort("displayOrder createdAt");
  return members;
};

const getTeamById = async (id) => {
  const member = await Team.findById(id);
  if (!member) {
    throw new ApiError(404, "Team member not found");
  }
  return member;
};

const getTeamBySlug = async (slug) => {
  const member = await Team.findOne({ slug, isActive: true });
  if (!member) {
    throw new ApiError(404, "Team member not found");
  }
  return member;
};

const createTeam = async (data) => {
  const member = await Team.create(data);
  return member;
};

const updateTeam = async (id, updateData) => {
  const member = await Team.findById(id);
  if (!member) {
    throw new ApiError(404, "Team member not found");
  }

  // Apply updates via save() to trigger pre-save hooks (slug generation)
  Object.keys(updateData).forEach((key) => {
    member[key] = updateData[key];
  });

  await member.save();
  return member;
};

const deleteTeam = async (id) => {
  const member = await Team.findByIdAndDelete(id);
  if (!member) {
    throw new ApiError(404, "Team member not found");
  }
};

const reorderTeam = async (orderedIds) => {
  const operations = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { displayOrder: index },
    },
  }));
  await Team.bulkWrite(operations);
};

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
