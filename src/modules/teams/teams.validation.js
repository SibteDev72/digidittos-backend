const { body, param, query } = require("express-validator");

const ALLOWED_PLATFORMS = [
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
];

const createTeamValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isLength({ max: 100 })
    .withMessage("Role cannot exceed 100 characters"),
  body("photo").optional().trim(),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Bio cannot exceed 1000 characters"),
  body("socials")
    .optional()
    .isArray()
    .withMessage("Socials must be an array"),
  body("socials.*.platform")
    .trim()
    .notEmpty()
    .withMessage("Platform name is required")
    .isIn(ALLOWED_PLATFORMS)
    .withMessage(
      `Platform must be one of: ${ALLOWED_PLATFORMS.join(", ")}`
    ),
  body("socials.*.url")
    .trim()
    .notEmpty()
    .withMessage("Social URL is required")
    .isURL()
    .withMessage("Social URL must be a valid URL"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const updateTeamValidation = [
  param("id").isMongoId().withMessage("Invalid team member ID"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("role")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Role cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Role cannot exceed 100 characters"),
  body("photo").optional().trim(),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Bio cannot exceed 1000 characters"),
  body("socials")
    .optional()
    .isArray()
    .withMessage("Socials must be an array"),
  body("socials.*.platform")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Platform name is required")
    .isIn(ALLOWED_PLATFORMS)
    .withMessage(
      `Platform must be one of: ${ALLOWED_PLATFORMS.join(", ")}`
    ),
  body("socials.*.url")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Social URL is required")
    .isURL()
    .withMessage("Social URL must be a valid URL"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const teamIdValidation = [
  param("id").isMongoId().withMessage("Invalid team member ID"),
];

const teamQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Invalid page number"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string"),
  query("isActive")
    .optional()
    .isIn(["true", "false"])
    .withMessage("isActive must be true or false"),
];

const reorderValidation = [
  body("orderedIds")
    .isArray({ min: 1 })
    .withMessage("orderedIds must be a non-empty array"),
  body("orderedIds.*")
    .isMongoId()
    .withMessage("Each ID must be a valid MongoDB ID"),
];

module.exports = {
  createTeamValidation,
  updateTeamValidation,
  teamIdValidation,
  teamQueryValidation,
  reorderValidation,
};
