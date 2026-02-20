const mongoose = require("mongoose");
const slugify = require("slugify");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
    },
    excerpt: {
      type: String,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    featuredImage: {
      type: String,
      default: null,
    },
    tags: [{ type: String, trim: true }],
    category: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

contentSchema.index({ slug: 1 });
contentSchema.index({ status: 1, createdAt: -1 });
contentSchema.index({ author: 1 });
contentSchema.index({ tags: 1 });

module.exports = mongoose.model("Content", contentSchema);
