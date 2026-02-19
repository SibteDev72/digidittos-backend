const { body, param, query } = require("express-validator");

const createContentValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("body").notEmpty().withMessage("Body is required"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Invalid status"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("category").optional().trim(),
  body("excerpt").optional().trim(),
];

const updateContentValidation = [
  param("id").isMongoId().withMessage("Invalid content ID"),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("body").optional().notEmpty().withMessage("Body cannot be empty"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Invalid status"),
];

const contentIdValidation = [
  param("id").isMongoId().withMessage("Invalid content ID"),
];

const contentQueryValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Invalid page number"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Invalid status filter"),
];

module.exports = {
  createContentValidation,
  updateContentValidation,
  contentIdValidation,
  contentQueryValidation,
};
