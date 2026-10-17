const express = require("express");
const router = express.Router();

const {
  submitQuestionnaire,
  getQuestionnaireResult,
} = require("../controllers/questionnaireController");

router.post("/questionnaire", submitQuestionnaire);
router.get("/questionnaire/:id", getQuestionnaireResult);

module.exports = router;