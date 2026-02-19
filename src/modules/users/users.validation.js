const { body, param } = require("express-validator");

const updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("role")
    .optional()
    .isIn(["admin", "editor", "author", "viewer"])
    .withMessage("Invalid role"),
];

const userIdValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

module.exports = { updateUserValidation, userIdValidation };
