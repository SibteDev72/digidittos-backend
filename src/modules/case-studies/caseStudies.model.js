const mongoose = require("mongoose");
const slugify = require("slugify");

const caseStudySchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: [true, "Description is required"],
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
caseStudySchema.pre("save", async function () {
  if (this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    const CaseStudy = mongoose.model("CaseStudy");
    while (await CaseStudy.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }

  // Auto-generate excerpt from description (strip HTML tags)
  if (this.isModified("description") && !this.excerpt) {
    const plainText = this.description
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    this.excerpt = plainText.substring(0, 160);
  }

  // Auto-fill SEO fields if empty
  if (this.isModified("title") && !this.seo?.metaTitle) {
    if (!this.seo) this.seo = {};
    this.seo.metaTitle = this.title.substring(0, 70);
  }

  if (this.isModified("description") && !this.seo?.metaDescription) {
    if (!this.seo) this.seo = {};
    const plainText = this.description
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    this.seo.metaDescription = plainText.substring(0, 160);
  }

  // Set publishedAt when status changes to published
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
});

caseStudySchema.index({ status: 1, publishedAt: -1 });
caseStudySchema.index({ author: 1, createdAt: -1 });
caseStudySchema.index({ tags: 1 });

module.exports = mongoose.model("CaseStudy", caseStudySchema);
