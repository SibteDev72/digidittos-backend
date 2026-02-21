const { body, param, query } = require("express-validator");

const createCaseStudyValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required"),
  body("excerpt")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Excerpt cannot exceed 300 characters"),
  body("featuredImage")
    .optional()
    .trim(),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each tag cannot exceed 50 characters"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
  body("publishedAt")
    .optional()
    .isISO8601()
    .withMessage("publishedAt must be a valid date"),
  body("seo.metaTitle")
    .optional()
    .trim()
    .isLength({ max: 70 })
    .withMessage("Meta title cannot exceed 70 characters"),
  body("seo.metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters"),
  body("seo.metaKeywords")
    .optional()
    .isArray()
    .withMessage("Meta keywords must be an array"),
];

const updateCaseStudyValidation = [
  param("id").isMongoId().withMessage("Invalid case study ID"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("excerpt")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Excerpt cannot exceed 300 characters"),
  body("featuredImage")
    .optional()
    .trim(),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each tag cannot exceed 50 characters"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
  body("publishedAt")
    .optional()
    .isISO8601()
    .withMessage("publishedAt must be a valid date"),
  body("seo.metaTitle")
    .optional()
    .trim()
    .isLength({ max: 70 })
    .withMessage("Meta title cannot exceed 70 characters"),
  body("seo.metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters"),
  body("seo.metaKeywords")
    .optional()
    .isArray()
    .withMessage("Meta keywords must be an array"),
];

const caseStudyIdValidation = [
  param("id").isMongoId().withMessage("Invalid case study ID"),
];

const caseStudyQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Invalid page number"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Invalid status filter"),
  query("tag")
    .optional()
    .isString()
    .withMessage("Tag must be a string"),
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string"),
];

module.exports = {
  createCaseStudyValidation,
  updateCaseStudyValidation,
  caseStudyIdValidation,
  caseStudyQueryValidation,
};
