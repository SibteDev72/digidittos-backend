const express = require("express");
const router = express.Router();
const usersController = require("./users.controller");
const {
  createUserValidation,
  updateUserValidation,
  userIdValidation,
} = require("./users.validation");
const validate = require("../../middleware/validate");
const { protect, authorize } = require("../../middleware/auth");

router.use(protect);

router
  .route("/")
  .get(authorize("admin"), usersController.getAllUsers)
  .post(
    authorize("admin"),
    validate(createUserValidation),
    usersController.createUser
  );

router
  .route("/:id")
  .get(authorize("admin"), validate(userIdValidation), usersController.getUserById)
  .put(
    authorize("admin"),
    validate([...userIdValidation, ...updateUserValidation]),
    usersController.updateUser
  )
  .delete(
    authorize("admin"),
    validate(userIdValidation),
    usersController.deleteUser
  );

module.exports = router;
