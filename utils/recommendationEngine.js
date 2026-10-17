function generateRecommendations({ skinType, concerns, acneType }) {
  const ingredients = new Set();

  if (skinType === "dry") {
    ingredients.add("Hyaluronic Acid");
    ingredients.add("Ceramides");
  }

  if (skinType === "oily") {
    ingredients.add("Niacinamide");
  }

  if (skinType === "combination") {
    ingredients.add("Niacinamide");
  }

  if (concerns.includes("hyperpigmentation")) {
    ingredients.add("Vitamin C");
    ingredients.add("Alpha Arbutin");
  }

  if (concerns.includes("dullness")) {
    ingredients.add("Vitamin C");
  }

  if (concerns.includes("pores")) {
    ingredients.add("Niacinamide");
    ingredients.add("Salicylic Acid");
  }

  if (concerns.includes("dryness")) {
    ingredients.add("Hyaluronic Acid");
    ingredients.add("Ceramides");
  }

  if (acneType === "comedonal") {
    ingredients.add("Salicylic Acid");
  }

  if (acneType === "inflammatory") {
    ingredients.add("Benzoyl Peroxide");
  }

  if (acneType === "cystic") {
    ingredients.add("Salicylic Acid");
    ingredients.add("Adapalene");
  }

  if (acneType === "hormonal") {
    ingredients.add("Niacinamide");
  }

  // if user selected "no-acne", do nothing extra

  return {
    recommendedIngredients: [...ingredients],
  };
}

module.exports = generateRecommendations;