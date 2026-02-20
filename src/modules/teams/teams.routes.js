const express = require("express");
const router = express.Router();
const teamsController = require("./teams.controller");
const {
  createTeamValidation,
  updateTeamValidation,
  teamIdValidation,
  teamQueryValidation,
  reorderValidation,
} = require("./teams.validation");
const validate = require("../../middleware/validate");
const { protect, authorize } = require("../../middleware/auth");

// Public routes
router.get("/public", teamsController.getPublicTeam);
router.get("/slug/:slug", teamsController.getTeamBySlug);

// Protected routes (admin only)
router
  .route("/")
  .get(
    protect,
    authorize("admin"),
    validate(teamQueryValidation),
    teamsController.getAllTeams
  )
  .post(
    protect,
    authorize("admin"),
    validate(createTeamValidation),
    teamsController.createTeam
  );

router.put(
  "/reorder",
  protect,
  authorize("admin"),
  validate(reorderValidation),
  teamsController.reorderTeam
);

router
  .route("/:id")
  .get(
    protect,
    authorize("admin"),
    validate(teamIdValidation),
    teamsController.getTeamById
  )
  .put(
    protect,
    authorize("admin"),
    validate(updateTeamValidation),
    teamsController.updateTeam
  )
  .delete(
    protect,
    authorize("admin"),
    validate(teamIdValidation),
    teamsController.deleteTeam
  );

module.exports = router;
