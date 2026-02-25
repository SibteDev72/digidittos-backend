const mongoose = require("mongoose");
const slugify = require("slugify");

const socialSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, "Platform name is required"],
      trim: true,
      lowercase: true,
      enum: [
        "facebook",
        "twitter",
        "instagram",
        "linkedin",
        "github",
        "youtube",
        "tiktok",
        "website",
        "dribbble",
        "behance",
      ],
    },
    url: {
      type: String,
      required: [true, "Social URL is required"],
      trim: true,
    },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
    photo: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },
    socials: [socialSchema],
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name
teamSchema.pre("save", async function () {
  if (this.isModified("name")) {
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    const Team = mongoose.model("Team");
    while (await Team.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
});

teamSchema.index({ isActive: 1, displayOrder: 1 });
teamSchema.index({ name: 1 });

module.exports = mongoose.model("Team", teamSchema);
