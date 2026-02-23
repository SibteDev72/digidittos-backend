const express = require("express");
const router = express.Router();
const usersController = require("./users.controller");
const {
  createUserValidation,
  updateUserValidation,
  userIdValidation,
} = require("./users.validation");
const validate = require("../../middleware/validate");
const { protect } = require("../../middleware/auth");

router.use(protect);

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(validate(createUserValidation), usersController.createUser);

router
  .route("/:id")
  .get(validate(userIdValidation), usersController.getUserById)
  .put(
    validate([...userIdValidation, ...updateUserValidation]),
    usersController.updateUser
  )
  .delete(validate(userIdValidation), usersController.deleteUser);

module.exports = router;
