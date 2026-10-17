CREATE TABLE IF NOT EXISTS questionnaire_results (
    id SERIAL PRIMARY KEY,
    skin_type TEXT NOT NULL,
    concerns TEXT[] NOT NULL,
    acne_type TEXT NOT NULL,
    recommended_ingredients TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);