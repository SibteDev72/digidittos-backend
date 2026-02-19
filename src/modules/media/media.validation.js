const { param, query } = require("express-validator");

const mediaIdValidation = [
  param("id").isMongoId().withMessage("Invalid media ID"),
];

const mediaQueryValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Invalid page number"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

module.exports = { mediaIdValidation, mediaQueryValidation };
