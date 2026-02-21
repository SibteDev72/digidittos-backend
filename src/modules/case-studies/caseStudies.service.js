const CaseStudy = require("./caseStudies.model");
const ApiError = require("../../utils/ApiError");

const getAllCaseStudies = async ({
  page = 1,
  limit = 10,
  status,
  author,
  tag,
  search,
}) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (status) filter.status = status;
  if (author) filter.author = author;
  if (tag) filter.tags = tag;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const [caseStudies, total] = await Promise.all([
    CaseStudy.find(filter)
      .populate("author", "name email avatar")
      .select("-description")
      .skip(skip)
      .limit(limit)
      .sort("-createdAt"),
    CaseStudy.countDocuments(filter),
  ]);

  return {
    caseStudies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Public: only published case studies (lean fields for listing)
const getPublishedCaseStudies = async ({ page = 1, limit = 10, tag, search }) => {
  const skip = (page - 1) * limit;
  const filter = { status: "published" };

  if (tag) filter.tags = tag;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const [caseStudies, total] = await Promise.all([
    CaseStudy.find(filter)
      .populate("author", "name avatar")
      .select("title slug excerpt featuredImage tags publishedAt seo author")
      .skip(skip)
      .limit(limit)
      .sort("-publishedAt"),
    CaseStudy.countDocuments(filter),
  ]);

  return {
    caseStudies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getCaseStudyById = async (id) => {
  const caseStudy = await CaseStudy.findById(id).populate(
    "author",
    "name email avatar"
  );
  if (!caseStudy) {
    throw new ApiError(404, "Case study not found");
  }
  return caseStudy;
};

// Public: get by slug (only published)
const getCaseStudyBySlug = async (slug) => {
  const caseStudy = await CaseStudy.findOne({
    slug,
    status: "published",
  }).populate("author", "name avatar");
  if (!caseStudy) {
    throw new ApiError(404, "Case study not found");
  }
  return caseStudy;
};

const createCaseStudy = async (data) => {
  const caseStudy = await CaseStudy.create(data);
  return caseStudy.populate("author", "name email avatar");
};

const updateCaseStudy = async (id, updateData) => {
  const caseStudy = await CaseStudy.findById(id);
  if (!caseStudy) {
    throw new ApiError(404, "Case study not found");
  }

  // Apply updates via save() to trigger pre-save hooks (slug, excerpt, SEO)
  Object.keys(updateData).forEach((key) => {
    if (key === "seo") {
      caseStudy.seo = {
        ...(caseStudy.seo?.toObject?.() || {}),
        ...updateData.seo,
      };
    } else {
      caseStudy[key] = updateData[key];
    }
  });

  await caseStudy.save();
  return caseStudy.populate("author", "name email avatar");
};

const deleteCaseStudy = async (id) => {
  const caseStudy = await CaseStudy.findByIdAndDelete(id);
  if (!caseStudy) {
    throw new ApiError(404, "Case study not found");
  }
};

const getAllTags = async () => {
  const tags = await CaseStudy.aggregate([
    { $match: { status: "published" } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, tag: "$_id", count: 1 } },
  ]);
  return tags;
};

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
