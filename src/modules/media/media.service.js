const fs = require("fs");
const path = require("path");
const Media = require("./media.model");
const ApiError = require("../../utils/ApiError");

const getAllMedia = async ({ page = 1, limit = 10, uploadedBy }) => {
  const query = {};
  if (uploadedBy) query.uploadedBy = uploadedBy;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Media.find(query)
      .populate("uploadedBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort("-createdAt"),
    Media.countDocuments(query),
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

const uploadMedia = async (file, userId) => {
  const media = await Media.create({
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`,
    uploadedBy: userId,
  });

  return media.populate("uploadedBy", "name email");
};

const getMediaById = async (id) => {
  const media = await Media.findById(id).populate("uploadedBy", "name email");
  if (!media) {
    throw new ApiError(404, "Media not found");
  }
  return media;
};

const deleteMedia = async (id) => {
  const media = await Media.findByIdAndDelete(id);
  if (!media) {
    throw new ApiError(404, "Media not found");
  }

  // Remove file from disk
  const filePath = path.join(process.cwd(), media.url);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = { getAllMedia, uploadMedia, getMediaById, deleteMedia };
