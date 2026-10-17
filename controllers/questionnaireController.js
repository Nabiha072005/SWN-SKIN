const pool = require("../db/pool");
const generateRecommendations = require("../utils/recommendationEngine");

async function submitQuestionnaire(req, res) {
  try {
    const { skinType, concerns, acneType } = req.body;

    if (!skinType || !Array.isArray(concerns) || concerns.length === 0 || !acneType) {
      return res.status(400).json({ error: "Missing required questionnaire fields." });
    }

    const recommendations = generateRecommendations({ skinType, concerns, acneType });

    const query = `
      INSERT INTO questionnaire_results
      (skin_type, concerns, acne_type, recommended_ingredients)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const values = [
      skinType,
      concerns,
      acneType,
      recommendations.recommendedIngredients,
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Questionnaire submitted successfully",
      resultId: result.rows[0].id,
      recommendedIngredients: recommendations.recommendedIngredients,
    });
  } catch (error) {
    console.error("Error submitting questionnaire:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function getQuestionnaireResult(req, res) {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, skin_type, concerns, acne_type, recommended_ingredients, created_at
      FROM questionnaire_results
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Result not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching questionnaire result:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  submitQuestionnaire,
  getQuestionnaireResult,
};