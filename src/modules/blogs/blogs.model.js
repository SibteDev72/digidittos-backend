const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    featuredImage: {
      type: String,
      default: null,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
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
    seo: {
      metaTitle: {
        type: String,
        maxlength: [70, "Meta title cannot exceed 70 characters"],
      },
      metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      metaKeywords: [{ type: String, trim: true }],
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title
blogSchema.pre("save", async function () {
  if (this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug uniqueness
    const Blog = mongoose.model("Blog");
    while (await Blog.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }

  // Auto-generate excerpt from content (strip HTML tags)
  if (this.isModified("content") && !this.excerpt) {
    const plainText = this.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    this.excerpt = plainText.substring(0, 160);
  }

  // Calculate reading time (avg 200 words per minute)
  if (this.isModified("content")) {
    const plainText = this.content.replace(/<[^>]*>/g, "");
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  // Auto-fill SEO fields if empty
  if (this.isModified("title") && !this.seo?.metaTitle) {
    if (!this.seo) this.seo = {};
    this.seo.metaTitle = this.title.substring(0, 70);
  }

  if (this.isModified("content") && !this.seo?.metaDescription) {
    if (!this.seo) this.seo = {};
    const plainText = this.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    this.seo.metaDescription = plainText.substring(0, 160);
  }

  // Set publishedAt when status changes to published
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ "seo.metaKeywords": 1 });

module.exports = mongoose.model("Blog", blogSchema);
