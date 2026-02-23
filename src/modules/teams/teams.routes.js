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
const { protect } = require("../../middleware/auth");

// Public routes
router.get("/public", teamsController.getPublicTeam);
router.get("/slug/:slug", teamsController.getTeamBySlug);

// Protected routes
router
  .route("/")
  .get(protect, validate(teamQueryValidation), teamsController.getAllTeams)
  .post(protect, validate(createTeamValidation), teamsController.createTeam);

router.put(
  "/reorder",
  protect,
  validate(reorderValidation),
  teamsController.reorderTeam
);

router
  .route("/:id")
  .get(protect, validate(teamIdValidation), teamsController.getTeamById)
  .put(protect, validate(updateTeamValidation), teamsController.updateTeam)
  .delete(protect, validate(teamIdValidation), teamsController.deleteTeam);

module.exports = router;
