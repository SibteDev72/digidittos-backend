const Blog = require("./blogs.model");
const ApiError = require("../../utils/ApiError");

const getAllBlogs = async ({ page = 1, limit = 10, status, author, tag, search }) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (status) filter.status = status;
  if (author) filter.author = author;
  if (tag) filter.tags = tag;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { "seo.metaKeywords": { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("author", "name email avatar")
      .select("-content")
      .skip(skip)
      .limit(limit)
      .sort("-createdAt"),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Public endpoint: only published blogs, optimized for frontend consumption
const getPublishedBlogs = async ({ page = 1, limit = 10, tag, search }) => {
  const skip = (page - 1) * limit;
  const filter = { status: "published" };

  if (tag) filter.tags = tag;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("author", "name avatar")
      .select("title slug excerpt featuredImage tags readingTime publishedAt seo author")
      .skip(skip)
      .limit(limit)
      .sort("-publishedAt"),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getBlogById = async (id) => {
  const blog = await Blog.findById(id).populate("author", "name email avatar");
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  return blog;
};

const getBlogBySlug = async (slug) => {
  const blog = await Blog.findOne({ slug, status: "published" }).populate(
    "author",
    "name avatar"
  );
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  return blog;
};

const createBlog = async (data) => {
  const blog = await Blog.create(data);
  return blog.populate("author", "name email avatar");
};

const updateBlog = async (id, updateData) => {
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Apply updates via save() to trigger pre-save hooks (slug, excerpt, readingTime)
  Object.keys(updateData).forEach((key) => {
    if (key === "seo") {
      blog.seo = { ...blog.seo?.toObject?.() || {}, ...updateData.seo };
    } else {
      blog[key] = updateData[key];
    }
  });

  await blog.save();
  return blog.populate("author", "name email avatar");
};

const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
};

const getAllTags = async () => {
  const tags = await Blog.aggregate([
    { $match: { status: "published" } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, tag: "$_id", count: 1 } },
  ]);
  return tags;
};

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
