const express = require("express");
const router = express.Router();
const caseStudiesController = require("./caseStudies.controller");
const {
  createCaseStudyValidation,
  updateCaseStudyValidation,
  caseStudyIdValidation,
  caseStudyQueryValidation,
} = require("./caseStudies.validation");
const validate = require("../../middleware/validate");
const { protect } = require("../../middleware/auth");

// Public routes
router.get(
  "/published",
  validate(caseStudyQueryValidation),
  caseStudiesController.getPublishedCaseStudies
);
router.get("/tags", caseStudiesController.getAllTags);
router.get("/slug/:slug", caseStudiesController.getCaseStudyBySlug);

// Protected routes
router
  .route("/")
  .get(
    protect,
    validate(caseStudyQueryValidation),
    caseStudiesController.getAllCaseStudies
  )
  .post(
    protect,
    validate(createCaseStudyValidation),
    caseStudiesController.createCaseStudy
  );

router
  .route("/:id")
  .get(
    protect,
    validate(caseStudyIdValidation),
    caseStudiesController.getCaseStudyById
  )
  .put(
    protect,
    validate(updateCaseStudyValidation),
    caseStudiesController.updateCaseStudy
  )
  .delete(
    protect,
    validate(caseStudyIdValidation),
    caseStudiesController.deleteCaseStudy
  );

module.exports = router;
