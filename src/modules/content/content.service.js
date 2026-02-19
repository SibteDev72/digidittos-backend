const Content = require("./content.model");
const ApiError = require("../../utils/ApiError");

const getAllContent = async ({ page = 1, limit = 10, status, author }) => {
  const query = {};
  if (status) query.status = status;
  if (author) query.author = author;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Content.find(query)
      .populate("author", "name email")
      .skip(skip)
      .limit(limit)
      .sort("-createdAt"),
    Content.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getContentById = async (id) => {
  const content = await Content.findById(id).populate("author", "name email");
  if (!content) {
    throw new ApiError(404, "Content not found");
  }
  return content;
};

const getContentBySlug = async (slug) => {
  const content = await Content.findOne({ slug }).populate(
    "author",
    "name email"
  );
  if (!content) {
    throw new ApiError(404, "Content not found");
  }
  return content;
};

const createContent = async (data) => {
  const content = await Content.create(data);
  return content.populate("author", "name email");
};

const updateContent = async (id, updateData) => {
  const content = await Content.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("author", "name email");

  if (!content) {
    throw new ApiError(404, "Content not found");
  }
  return content;
};

const deleteContent = async (id) => {
  const content = await Content.findByIdAndDelete(id);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }
};

module.exports = {
  getAllContent,
  getContentById,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
};
