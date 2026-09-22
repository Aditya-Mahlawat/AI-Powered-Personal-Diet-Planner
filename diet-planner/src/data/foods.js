// src/data/foods.js
// Extensive food database with authentic Indian regional foods and global staples.
// Tags: veg, vegan, nonveg, dairy, nuts, gluten, lactose, high_protein, jain

export const FOODS_CATALOG = [
  // ---- Indian Grains & Breads ----
  { id: "chapati", name: "Chapati (Whole Wheat Roti)", category: "grains", per100: { kcal: 297, p: 9.0, c: 55.0, f: 4.0 }, tags: ["veg", "vegan", "gluten"], cuisine: "indian", serving: "1 piece (35g) ~ 104 kcal" },
  { id: "ragi_roti", name: "Ragi Roti (Finger Millet)", category: "grains", per100: { kcal: 256, p: 7.3, c: 54.0, f: 1.5 }, tags: ["veg", "vegan"], cuisine: "indian", serving: "1 piece (40g) ~ 102 kcal" },
  { id: "bajra_roti", name: "Bajra Roti (Pearl Millet)", category: "grains", per100: { kcal: 260, p: 8.5, c: 52.0, f: 2.2 }, tags: ["veg", "vegan"], cuisine: "indian", serving: "1 piece (45g) ~ 117 kcal" },
  { id: "thepla", name: "Gujarati Methi Thepla", category: "grains", per100: { kcal: 280, p: 8.0, c: 45.0, f: 8.0 }, tags: ["veg", "gluten"], cuisine: "indian", serving: "1 piece (40g) ~ 112 kcal" },
  { id: "white_rice", name: "Steamed White Rice", category: "grains", per100: { kcal: 130, p: 2.7, c: 28.2, f: 0.3 }, tags: ["veg", "vegan"], cuisine: "indian", serving: "1 medium katori (150g) ~ 195 kcal" },
  { id: "brown_rice", name: "Brown Rice (Cooked)", category: "grains", per100: { kcal: 111, p: 2.6, c: 23.0, f: 0.9 }, tags: ["veg", "vegan"], cuisine: "global", serving: "1 medium katori (150g) ~ 166 kcal" },
  { id: "poha", name: "Poha (Flattened Rice)", category: "grains", per100: { kcal: 180, p: 3.5, c: 32.0, f: 4.5 }, tags: ["veg", "vegan"], cuisine: "indian", serving: "1 plate (150g) ~ 270 kcal" },
  { id: "upma_semolina", name: "Upma (Semolina)", category: "grains", per100: { kcal: 135, p: 4.0, c: 24.0, f: 2.5 }, tags: ["veg", "gluten"], cuisine: "indian", serving: "1 plate (150g) ~ 202 kcal" },
  { id: "oats", name: "Rolled Oats", category: "grains", per100: { kcal: 379, p: 13.2, c: 67.7, f: 6.5 }, tags: ["veg", "vegan", "gluten"], cuisine: "global", serving: "1 bowl (40g dry) ~ 152 kcal" },
  { id: "quinoa", name: "Quinoa (Cooked)", category: "grains", per100: { kcal: 120, p: 4.4, c: 21.3, f: 1.9 }, tags: ["veg", "vegan"], cuisine: "global", serving: "1 bowl (150g) ~ 180 kcal" },
  { id: "whole_wheat_bread", name: "Whole Wheat Bread", category: "grains", per100: { kcal: 247, p: 9.0, c: 46.1, f: 3.4 }, tags: ["veg", "vegan", "gluten"], cuisine: "global", serving: "2 slices (60g) ~ 148 kcal" },

  // ---- Indian Vegetarian Proteins ----
  { id: "paneer", name: "Paneer (Fresh Cottage Cheese)", category: "protein_veg", per100: { kcal: 265, p: 18.3, c: 3.4, f: 20.8 }, tags: ["veg", "dairy", "lactose", "high_protein"], cuisine: "indian", serving: "100g ~ 265 kcal (18g Protein)" },
  { id: "paneer_low_fat", name: "Low-Fat Paneer", category: "protein_veg", per100: { kcal: 160, p: 25.0, c: 4.0, f: 5.0 }, tags: ["veg", "dairy", "lactose", "high_protein"], cuisine: "indian", serving: "100g ~ 160 kcal (25g Protein)" },
  { id: "soya_chunks", name: "Soya Chunks (Nutrela)", category: "protein_veg", per100: { kcal: 345, p: 52.0, c: 33.0, f: 0.5 }, tags: ["veg", "vegan", "high_protein"], cuisine: "indian", serving: "50g dry ~ 172 kcal (26g Protein)" },
  { id: "tofu", name: "Tofu (Soy Paneer)", category: "protein_veg", per100: { kcal: 76, p: 8.0, c: 1.9, f: 4.8 }, tags: ["veg", "vegan", "high_protein"], cuisine: "asian", serving: "100g ~ 76 kcal (8g Protein)" },
  { id: "lentils_dal", name: "Yellow Dal Tadka (Cooked)", category: "protein_veg", per100: { kcal: 110, p: 7.2, c: 16.5, f: 2.2 }, tags: ["veg", "vegan"], cuisine: "indian", serving: "1 katori (150g) ~ 165 kcal" },
  { id: "dal_makhani", name: "Dal Makhani", category: "protein_veg", per100: { kcal: 140, p: 6.5, c: 17.0, f: 5.5 }, tags: ["veg", "dairy"], cuisine: "indian", serving: "1 katori (150g) ~ 210 kcal" },
  { id: "chickpeas_chole", name: "Chole (Chickpeas Curry)", category: "protein_veg", per100: { kcal: 150, p: 7.5, c: 22.0, f: 4.0 }, tags: ["veg", "vegan"], cuisine: "indian", serving: "1 katori (150g) ~ 225 kcal" },
  { id: "rajma", name: "Rajma (Red Kidney Beans Curry)", category: "protein_veg", per100: { kcal: 135, p: 7.8, c: 21.0, f: 2.5 }, tags: ["veg", "vegan"], cuisine: "indian", serving: "1 katori (150g) ~ 202 kcal" },
  { id: "moong_dal", name: "Moong Dal (Cooked)", category: "protein_veg", per100: { kcal: 98, p: 7.0, c: 15.5, f: 1.2 }, tags: ["veg", "vegan", "jain"], cuisine: "indian", serving: "1 katori (150g) ~ 147 kcal" },
  { id: "sprouted_moong", name: "Sprouted Moong (Raw/Boiled)", category: "protein_veg", per100: { kcal: 105, p: 8.5, c: 19.0, f: 0.8 }, tags: ["veg", "vegan", "jain", "high_protein"], cuisine: "indian", serving: "1 cup (100g) ~ 105 kcal" },
  { id: "kala_chana", name: "Kala Chana (Black Chickpea Curry)", category: "protein_veg", per100: { kcal: 142, p: 8.0, c: 22.5, f: 2.8 }, tags: ["veg", "vegan"], cuisine: "indian", serving: "1 katori (150g) ~ 213 kcal" },
  { id: "sattu", name: "Roasted Chana Sattu Flour", category: "protein_veg", per100: { kcal: 410, p: 25.0, c: 64.0, f: 5.2 }, tags: ["veg", "vegan", "high_protein"], cuisine: "indian", serving: "3 tbsp (40g) ~ 164 kcal (10g Protein)" },
  { id: "dahi", name: "Curd / Plain Dahi", category: "protein_veg", per100: { kcal: 62, p: 3.8, c: 4.5, f: 3.5 }, tags: ["veg", "dairy", "lactose", "jain"], cuisine: "indian", serving: "1 katori (120g) ~ 74 kcal" },
  { id: "greek_yogurt", name: "Greek Yogurt (Unsweetened)", category: "protein_veg", per100: { kcal: 59, p: 10.0, c: 3.6, f: 0.4 }, tags: ["veg", "dairy", "lactose", "high_protein"], cuisine: "global", serving: "1 cup (150g) ~ 88 kcal (15g Protein)" },

  // ---- Non-Vegetarian Proteins ----
  { id: "egg", name: "Egg (Whole Boiled)", category: "protein_nonveg", per100: { kcal: 155, p: 13.0, c: 1.1, f: 11.0 }, tags: ["nonveg", "high_protein"], cuisine: "global", serving: "1 large egg (50g) ~ 78 kcal (6.5g Protein)" },
  { id: "egg_boiled", name: "Boiled Whole Egg", category: "protein_nonveg", per100: { kcal: 155, p: 13.0, c: 1.1, f: 11.0 }, tags: ["nonveg", "high_protein"], cuisine: "global", serving: "1 large egg (50g) ~ 78 kcal (6.5g Protein)" },
  { id: "egg_whites", name: "Egg Whites", category: "protein_nonveg", per100: { kcal: 52, p: 11.0, c: 0.7, f: 0.2 }, tags: ["nonveg", "high_protein"], cuisine: "global", serving: "3 egg whites (100g) ~ 52 kcal (11g Protein)" },
  { id: "egg_bhurji", name: "Indian Egg Bhurji (Scrambled)", category: "protein_nonveg", per100: { kcal: 180, p: 12.5, c: 3.2, f: 13.0 }, tags: ["nonveg", "high_protein"], cuisine: "indian", serving: "2 eggs bhurji (130g) ~ 234 kcal" },
  { id: "chicken_breast", name: "Grilled Chicken Breast", category: "protein_nonveg", per100: { kcal: 165, p: 31.0, c: 0.0, f: 3.6 }, tags: ["nonveg", "high_protein"], cuisine: "global", serving: "150g ~ 247 kcal (46.5g Protein)" },
  { id: "chicken_curry", name: "Homestyle Chicken Curry", category: "protein_nonveg", per100: { kcal: 155, p: 18.0, c: 4.2, f: 7.5 }, tags: ["nonveg", "high_protein"], cuisine: "indian", serving: "1 bowl (180g) ~ 279 kcal" },
  { id: "tandoori_chicken", name: "Tandoori Chicken", category: "protein_nonveg", per100: { kcal: 195, p: 26.0, c: 3.0, f: 9.0 }, tags: ["nonveg", "high_protein"], cuisine: "indian", serving: "1 leg piece (140g) ~ 273 kcal" },
  { id: "fish_curry", name: "Indian Rohu / Surmai Fish Curry", category: "protein_nonveg", per100: { kcal: 135, p: 19.0, c: 3.0, f: 5.5 }, tags: ["nonveg", "high_protein"], cuisine: "indian", serving: "1 portion (150g) ~ 202 kcal" },
  { id: "mutton", name: "Mutton Curry (Lean)", category: "protein_nonveg", per100: { kcal: 190, p: 22.0, c: 3.5, f: 10.0 }, tags: ["nonveg"], cuisine: "indian", serving: "1 portion (150g) ~ 285 kcal" },

  // ---- South Indian Specialties ----
  { id: "idli", name: "Steamed Idli", category: "south_indian", per100: { kcal: 130, p: 4.2, c: 26.5, f: 0.6 }, tags: ["veg", "vegan"], cuisine: "south_indian", serving: "2 medium idlis (80g) ~ 104 kcal" },
  { id: "dosa", name: "Plain Dosa", category: "south_indian", per100: { kcal: 168, p: 4.0, c: 29.0, f: 4.2 }, tags: ["veg"], cuisine: "south_indian", serving: "1 medium dosa (90g) ~ 151 kcal" },
  { id: "sambar", name: "Vegetable Sambar", category: "south_indian", per100: { kcal: 55, p: 2.8, c: 9.5, f: 0.8 }, tags: ["veg", "vegan"], cuisine: "south_indian", serving: "1 bowl (180g) ~ 99 kcal" },
  { id: "coconut_chutney", name: "Fresh Coconut Chutney", category: "south_indian", per100: { kcal: 230, p: 3.0, c: 7.5, f: 22.0 }, tags: ["veg", "vegan"], cuisine: "south_indian", serving: "2 tbsp (30g) ~ 69 kcal" },
  { id: "curd_rice", name: "South Indian Curd Rice (Thayir Sadam)", category: "south_indian", per100: { kcal: 145, p: 3.8, c: 23.0, f: 4.2 }, tags: ["veg", "dairy", "lactose"], cuisine: "south_indian", serving: "1 bowl (180g) ~ 261 kcal" },
  { id: "lemon_rice", name: "Chitranna (Lemon Rice)", category: "south_indian", per100: { kcal: 175, p: 3.2, c: 28.0, f: 5.5 }, tags: ["veg", "vegan"], cuisine: "south_indian", serving: "1 bowl (160g) ~ 280 kcal" },

  // ---- Indian Vegetables & Sabzi ----
  { id: "palak_paneer", name: "Palak Paneer", category: "vegetables", per100: { kcal: 160, p: 8.5, c: 6.0, f: 11.5 }, tags: ["veg", "dairy"], cuisine: "indian", serving: "1 katori (150g) ~ 240 kcal" },
  { id: "paneer_bhurji", name: "Paneer Bhurji", category: "vegetables", per100: { kcal: 195, p: 13.0, c: 4.5, f: 14.0 }, tags: ["veg", "dairy", "high_protein"], cuisine: "indian", serving: "1 portion (130g) ~ 253 kcal" },
  { id: "lauki_sabzi", name: "Lauki Ki Sabzi (Bottle Gourd)", category: "vegetables", per100: { kcal: 50, p: 1.2, c: 6.0, f: 2.5 }, tags: ["veg", "vegan", "jain"], cuisine: "indian", serving: "1 katori (150g) ~ 75 kcal" },
  { id: "bhindi_masala", name: "Bhindi Masala (Okra)", category: "vegetables", per100: { kcal: 85, p: 2.2, c: 9.5, f: 4.5 }, tags: ["veg", "vegan", "jain"], cuisine: "indian", serving: "1 katori (120g) ~ 102 kcal" },
  { id: "mix_veg", name: "Mixed Vegetable Sabzi", category: "vegetables", per100: { kcal: 78, p: 2.5, c: 11.0, f: 3.0 }, tags: ["veg", "vegan"], cuisine: "indian", serving: "1 katori (150g) ~ 117 kcal" },
  { id: "khichdi", name: "Moong Dal Khichdi (Desi Ghee)", category: "vegetables", per100: { kcal: 130, p: 4.5, c: 22.0, f: 3.0 }, tags: ["veg", "jain"], cuisine: "indian", serving: "1 bowl (200g) ~ 260 kcal" },
  { id: "spinach", name: "Palak (Spinach Puree)", category: "vegetables", per100: { kcal: 23, p: 2.9, c: 3.6, f: 0.4 }, tags: ["veg", "vegan", "jain"], cuisine: "global", serving: "100g ~ 23 kcal" },
  { id: "cucumber", name: "Cucumber Salad (Kheera)", category: "vegetables", per100: { kcal: 15, p: 0.7, c: 3.6, f: 0.1 }, tags: ["veg", "vegan", "jain"], cuisine: "global", serving: "1 bowl (120g) ~ 18 kcal" },
  { id: "tomato", name: "Fresh Tomatoes", category: "vegetables", per100: { kcal: 18, p: 0.9, c: 3.9, f: 0.2 }, tags: ["veg", "vegan", "jain"], cuisine: "global", serving: "1 medium (100g) ~ 18 kcal" },

  // ---- Healthy Indian Snacks & Drinks ----
  { id: "roasted_chana", name: "Roasted Chana (Bhuna Chana)", category: "snacks", per100: { kcal: 360, p: 19.0, c: 58.0, f: 5.5 }, tags: ["veg", "vegan", "high_protein"], cuisine: "indian", serving: "1 handful (40g) ~ 144 kcal (7.6g Protein)" },
  { id: "makhana", name: "Roasted Makhana (Foxnuts)", category: "snacks", per100: { kcal: 350, p: 9.7, c: 76.0, f: 0.5 }, tags: ["veg", "vegan", "jain"], cuisine: "indian", serving: "1 big bowl (30g) ~ 105 kcal" },
  { id: "chaas", name: "Masala Chaas (Spiced Buttermilk)", category: "snacks", per100: { kcal: 28, p: 1.8, c: 2.5, f: 1.0 }, tags: ["veg", "dairy", "jain"], cuisine: "indian", serving: "1 glass (250ml) ~ 70 kcal" },
  { id: "dhokla", name: "Khaman Dhokla (Steamed)", category: "snacks", per100: { kcal: 160, p: 5.5, c: 26.0, f: 4.0 }, tags: ["veg", "jain"], cuisine: "indian", serving: "2 pieces (80g) ~ 128 kcal" },
  { id: "almonds", name: "Almonds (Badaam)", category: "snacks", per100: { kcal: 579, p: 21.2, c: 21.6, f: 49.9 }, tags: ["veg", "vegan", "nuts", "jain"], cuisine: "global", serving: "10 pieces (15g) ~ 87 kcal" },
  { id: "walnuts", name: "Walnuts (Akhrot)", category: "snacks", per100: { kcal: 654, p: 15.2, c: 13.7, f: 65.2 }, tags: ["veg", "vegan", "nuts", "jain"], cuisine: "global", serving: "4 halves (15g) ~ 98 kcal" },
  { id: "peanut_butter", name: "Peanut Butter (Unsweetened)", category: "snacks", per100: { kcal: 588, p: 25.1, c: 20.0, f: 50.4 }, tags: ["veg", "vegan", "nuts", "high_protein"], cuisine: "global", serving: "1 tbsp (20g) ~ 118 kcal" },
  { id: "banana", name: "Banana (Kela)", category: "snacks", per100: { kcal: 89, p: 1.1, c: 22.8, f: 0.3 }, tags: ["veg", "vegan", "jain"], cuisine: "global", serving: "1 medium (110g) ~ 98 kcal" },
  { id: "apple", name: "Apple (Seb)", category: "snacks", per100: { kcal: 52, p: 0.3, c: 14.0, f: 0.2 }, tags: ["veg", "vegan", "jain"], cuisine: "global", serving: "1 medium (150g) ~ 78 kcal" },
]

// Curated Indian Regional & Nutritional Daily Meal Plans
export const INDIAN_PRESET_PLANS = [
  {
    id: "north_indian_veg",
    title: "North Indian Homestyle (Vegetarian)",
    description: "Classic balanced Indian diet with Rotis, Dal Tadka, Paneer Bhurji, fresh Curd and seasonal Sabzi.",
    region: "North Indian",
    category: "Balanced",
    calories: 2150,
    macros: { p: 85, c: 280, f: 65 },
    meals: {
      breakfast: [
        { foodId: "poha", name: "Poha with Peanuts & Veggies", grams: 180, kcal: 324, p: 6.3, c: 57.6, f: 8.1 },
        { foodId: "dahi", name: "Plain Curd / Dahi", grams: 120, kcal: 74, p: 4.6, c: 5.4, f: 4.2 },
      ],
      lunch: [
        { foodId: "chapati", name: "Chapati (Whole Wheat Roti)", grams: 105, kcal: 312, p: 9.5, c: 57.8, f: 4.2 },
        { foodId: "lentils_dal", name: "Yellow Dal Tadka", grams: 180, kcal: 198, p: 13.0, c: 29.7, f: 4.0 },
        { foodId: "paneer_bhurji", name: "Paneer Bhurji", grams: 120, kcal: 234, p: 15.6, c: 5.4, f: 16.8 },
        { foodId: "cucumber", name: "Cucumber Salad", grams: 100, kcal: 15, p: 0.7, c: 3.6, f: 0.1 },
      ],
      snack: [
        { foodId: "roasted_chana", name: "Roasted Chana", grams: 40, kcal: 144, p: 7.6, c: 23.2, f: 2.2 },
        { foodId: "chaas", name: "Masala Chaas", grams: 250, kcal: 70, p: 4.5, c: 6.3, f: 2.5 },
      ],
      dinner: [
        { foodId: "chapati", name: "Chapati (Whole Wheat Roti)", grams: 70, kcal: 208, p: 6.3, c: 38.5, f: 2.8 },
        { foodId: "rajma", name: "Rajma (Kidney Bean Curry)", grams: 180, kcal: 243, p: 14.0, c: 37.8, f: 4.5 },
        { foodId: "mix_veg", name: "Mix Vegetable Sabzi", grams: 140, kcal: 109, p: 3.5, c: 15.4, f: 4.2 },
      ],
    },
  },
  {
    id: "south_indian_traditional",
    title: "South Indian Traditional Feast",
    description: "Wholesome South Indian staples featuring Steamed Idlis, Crispy Dosa, Vegetable Sambar, and Curd Rice.",
    region: "South Indian",
    category: "Traditional",
    calories: 2050,
    macros: { p: 72, c: 310, f: 55 },
    meals: {
      breakfast: [
        { foodId: "idli", name: "Steamed Idli (3 pcs)", grams: 120, kcal: 156, p: 5.0, c: 31.8, f: 0.7 },
        { foodId: "sambar", name: "Vegetable Sambar", grams: 180, kcal: 99, p: 5.0, c: 17.1, f: 1.4 },
        { foodId: "coconut_chutney", name: "Coconut Chutney", grams: 35, kcal: 80, p: 1.1, c: 2.6, f: 7.7 },
      ],
      lunch: [
        { foodId: "brown_rice", name: "Cooked Brown Rice", grams: 200, kcal: 222, p: 5.2, c: 46.0, f: 1.8 },
        { foodId: "sambar", name: "Vegetable Sambar", grams: 200, kcal: 110, p: 5.6, c: 19.0, f: 1.6 },
        { foodId: "curd_rice", name: "Curd Rice (Thayir Sadam)", grams: 150, kcal: 218, p: 5.7, c: 34.5, f: 6.3 },
        { foodId: "cucumber", name: "Fresh Cucumber Kosambari", grams: 100, kcal: 15, p: 0.7, c: 3.6, f: 0.1 },
      ],
      snack: [
        { foodId: "banana", name: "Fresh Banana", grams: 110, kcal: 98, p: 1.2, c: 25.1, f: 0.3 },
        { foodId: "almonds", name: "Soaked Almonds", grams: 15, kcal: 87, p: 3.2, c: 3.2, f: 7.5 },
      ],
      dinner: [
        { foodId: "dosa", name: "Crispy Plain Dosa (2 pcs)", grams: 160, kcal: 269, p: 6.4, c: 46.4, f: 6.7 },
        { foodId: "sambar", name: "Vegetable Sambar", grams: 180, kcal: 99, p: 5.0, c: 17.1, f: 1.4 },
        { foodId: "moong_dal", name: "Steamed Moong Dal Sundal", grams: 120, kcal: 118, p: 8.4, c: 18.6, f: 1.4 },
      ],
    },
  },
  {
    id: "high_protein_indian_veg",
    title: "High-Protein Indian Vegetarian (Gym & Muscle)",
    description: "Specially formulated vegetarian muscle building plan packed with Soya Chunks, Low-Fat Paneer, Sattu & Sprouted Moong.",
    region: "Indian Pan-Regional",
    category: "High Protein",
    calories: 2350,
    macros: { p: 155, c: 260, f: 60 },
    meals: {
      breakfast: [
        { foodId: "oats", name: "Oats with Skimmed Milk & Peanut Butter", grams: 60, kcal: 227, p: 7.9, c: 40.6, f: 3.9 },
        { foodId: "sprouted_moong", name: "Sprouted Moong Salad", grams: 120, kcal: 126, p: 10.2, c: 22.8, f: 1.0 },
        { foodId: "peanut_butter", name: "Peanut Butter", grams: 20, kcal: 118, p: 5.0, c: 4.0, f: 10.1 },
      ],
      lunch: [
        { foodId: "chapati", name: "Chapati (Whole Wheat Roti)", grams: 70, kcal: 208, p: 6.3, c: 38.5, f: 2.8 },
        { foodId: "soya_chunks", name: "Soya Chunks Curry (50g dry equivalent)", grams: 150, kcal: 235, p: 32.0, c: 18.0, f: 2.5 },
        { foodId: "lentils_dal", name: "Dal Tadka", grams: 150, kcal: 165, p: 10.8, c: 24.8, f: 3.3 },
        { foodId: "greek_yogurt", name: "Greek Yogurt / Hung Curd", grams: 150, kcal: 88, p: 15.0, c: 5.4, f: 0.6 },
      ],
      snack: [
        { foodId: "sattu", name: "Desi Sattu Protein Drink", grams: 50, kcal: 205, p: 12.5, c: 32.0, f: 2.6 },
        { foodId: "roasted_chana", name: "Roasted Chana", grams: 40, kcal: 144, p: 7.6, c: 23.2, f: 2.2 },
      ],
      dinner: [
        { foodId: "paneer_low_fat", name: "Grilled Low-Fat Paneer Tikka", grams: 150, kcal: 240, p: 37.5, c: 6.0, f: 7.5 },
        { foodId: "brown_rice", name: "Brown Rice", grams: 120, kcal: 133, p: 3.1, c: 27.6, f: 1.1 },
        { foodId: "spinach", name: "Garlic Palak Sabzi", grams: 120, kcal: 45, p: 3.5, c: 4.5, f: 1.0 },
      ],
    },
  },
  {
    id: "indian_nonveg_protein",
    title: "Indian High-Protein (Non-Vegetarian)",
    description: "Lean muscle building and fitness plan featuring Whole & White Eggs, Chicken Breast Curry, Tandoori Chicken and Fish.",
    region: "Indian Pan-Regional",
    category: "High Protein",
    calories: 2280,
    macros: { p: 165, c: 215, f: 65 },
    meals: {
      breakfast: [
        { foodId: "egg_bhurji", name: "3-Egg Vegetable Bhurji (2 whites, 1 whole)", grams: 150, kcal: 210, p: 18.5, c: 4.0, f: 12.0 },
        { foodId: "whole_wheat_bread", name: "Toasted Whole Wheat Bread", grams: 60, kcal: 148, p: 5.4, c: 27.7, f: 2.0 },
      ],
      lunch: [
        { foodId: "brown_rice", name: "Brown Rice", grams: 150, kcal: 166, p: 3.9, c: 34.5, f: 1.4 },
        { foodId: "chicken_curry", name: "Homestyle Lean Chicken Breast Curry", grams: 200, kcal: 310, p: 36.0, c: 8.4, f: 15.0 },
        { foodId: "lentils_dal", name: "Moong Dal Tadka", grams: 150, kcal: 165, p: 10.8, c: 24.8, f: 3.3 },
        { foodId: "cucumber", name: "Kachumber Salad", grams: 100, kcal: 15, p: 0.7, c: 3.6, f: 0.1 },
      ],
      snack: [
        { foodId: "egg_boiled", name: "Hard Boiled Eggs (2 pcs)", grams: 100, kcal: 155, p: 13.0, c: 1.1, f: 11.0 },
        { foodId: "apple", name: "Crisp Apple", grams: 130, kcal: 68, p: 0.4, c: 18.2, f: 0.3 },
      ],
      dinner: [
        { foodId: "chapati", name: "Chapati (Whole Wheat Roti)", grams: 70, kcal: 208, p: 6.3, c: 38.5, f: 2.8 },
        { foodId: "tandoori_chicken", name: "Tandoori Chicken Tikka", grams: 160, kcal: 312, p: 41.6, c: 4.8, f: 14.4 },
        { foodId: "mix_veg", name: "Light Sautéed Vegetables", grams: 120, kcal: 60, p: 2.0, c: 8.0, f: 1.5 },
      ],
    },
  },
  {
    id: "indian_weight_loss",
    title: "Indian Weight Loss & Calorie Deficit Plan",
    description: "Nutrient-dense, high-fiber, low-calorie Indian meals designed to keep you satiated while burning stubborn body fat.",
    region: "Indian Pan-Regional",
    category: "Weight Loss",
    calories: 1650,
    macros: { p: 90, c: 200, f: 42 },
    meals: {
      breakfast: [
        { foodId: "upma_semolina", name: "Vegetable Oats / Rava Upma", grams: 150, kcal: 202, p: 6.0, c: 36.0, f: 3.8 },
        { foodId: "dahi", name: "Low-Fat Dahi", grams: 100, kcal: 62, p: 3.8, c: 4.5, f: 3.5 },
      ],
      lunch: [
        { foodId: "ragi_roti", name: "Ragi (Millet) Roti (2 pcs)", grams: 80, kcal: 204, p: 5.8, c: 43.2, f: 1.2 },
        { foodId: "moong_dal", name: "Light Moong Dal", grams: 180, kcal: 176, p: 12.6, c: 27.9, f: 2.2 },
        { foodId: "lauki_sabzi", name: "Lauki (Bottle Gourd) Sabzi", grams: 150, kcal: 75, p: 1.8, c: 9.0, f: 3.8 },
        { foodId: "chaas", name: "Chilled Masala Chaas", grams: 250, kcal: 70, p: 4.5, c: 6.3, f: 2.5 },
      ],
      snack: [
        { foodId: "makhana", name: "Light Roasted Makhana", grams: 30, kcal: 105, p: 2.9, c: 22.8, f: 0.2 },
        { foodId: "apple", name: "Green / Red Apple", grams: 120, kcal: 62, p: 0.4, c: 16.8, f: 0.2 },
      ],
      dinner: [
        { foodId: "paneer_low_fat", name: "Sauteed Low-Fat Paneer with Veggies", grams: 120, kcal: 192, p: 30.0, c: 4.8, f: 6.0 },
        { foodId: "chapati", name: "1 Thin Chapati (Phulka)", grams: 35, kcal: 104, p: 3.2, c: 19.3, f: 1.4 },
        { foodId: "cucumber", name: "Big Cucumber Tomato Salad", grams: 150, kcal: 25, p: 1.1, c: 5.5, f: 0.2 },
      ],
    },
  },
  {
    id: "jain_satvik_veg",
    title: "Jain & Satvik Pure Vegetarian Plan",
    description: "100% Satvik diet compliant with Jain dietary rules: strictly No Onion, Garlic, Potatoes, or Root Vegetables.",
    region: "Jain / Satvik",
    category: "Satvik",
    calories: 1900,
    macros: { p: 70, c: 260, f: 55 },
    meals: {
      breakfast: [
        { foodId: "dhokla", name: "Steamed Khaman Dhokla (No Onion/Garlic)", grams: 120, kcal: 192, p: 6.6, c: 31.2, f: 4.8 },
        { foodId: "chaas", name: "Fresh Mint Chaas", grams: 200, kcal: 56, p: 3.6, c: 5.0, f: 2.0 },
      ],
      lunch: [
        { foodId: "chapati", name: "Phulka (Whole Wheat Roti)", grams: 70, kcal: 208, p: 6.3, c: 38.5, f: 2.8 },
        { foodId: "moong_dal", name: "Satvik Moong Dal Tadka (Cumin & Hing)", grams: 180, kcal: 176, p: 12.6, c: 27.9, f: 2.2 },
        { foodId: "lauki_sabzi", name: "Dudhi / Lauki Sabzi", grams: 160, kcal: 80, p: 1.9, c: 9.6, f: 4.0 },
        { foodId: "dahi", name: "Fresh Homemade Curd", grams: 120, kcal: 74, p: 4.6, c: 5.4, f: 4.2 },
      ],
      snack: [
        { foodId: "makhana", name: "Roasted Makhana (Desi Ghee)", grams: 35, kcal: 122, p: 3.4, c: 26.6, f: 0.2 },
        { foodId: "almonds", name: "Mamra Badam (Almonds)", grams: 15, kcal: 87, p: 3.2, c: 3.2, f: 7.5 },
      ],
      dinner: [
        { foodId: "khichdi", name: "Moong Dal Khichdi (Pure Ghee)", grams: 220, kcal: 286, p: 9.9, c: 48.4, f: 6.6 },
        { foodId: "dahi", name: "Curd / Raita", grams: 100, kcal: 62, p: 3.8, c: 4.5, f: 3.5 },
        { foodId: "bhindi_masala", name: "Crispy Bhindi (Okra) Sabzi", grams: 120, kcal: 102, p: 2.6, c: 11.4, f: 5.4 },
      ],
    },
  },
  {
    id: "indian_keto_lowcarb",
    title: "Indian Keto & Low-Carb Plan",
    description: "Ultra low carbohydrate, healthy-fat Indian plan focusing on Paneer, Spinach, Ghee, Almonds and Tandoori grills.",
    region: "Indian Keto",
    category: "Low Carb",
    calories: 2100,
    macros: { p: 110, c: 35, f: 165 },
    meals: {
      breakfast: [
        { foodId: "paneer_bhurji", name: "Paneer Bhurji in Butter/Ghee", grams: 150, kcal: 292, p: 19.5, c: 6.7, f: 21.0 },
        { foodId: "almonds", name: "Roasted Almonds", grams: 25, kcal: 145, p: 5.3, c: 5.4, f: 12.5 },
      ],
      lunch: [
        { foodId: "palak_paneer", name: "Palak Paneer (Creamy)", grams: 200, kcal: 320, p: 17.0, c: 12.0, f: 23.0 },
        { foodId: "cucumber", name: "Cucumber with Olive Oil & Salt", grams: 120, kcal: 45, p: 0.8, c: 4.3, f: 3.1 },
      ],
      snack: [
        { foodId: "walnuts", name: "Walnut Halves", grams: 25, kcal: 163, p: 3.8, c: 3.4, f: 16.3 },
        { foodId: "peanut_butter", name: "100% Pure Peanut Butter", grams: 25, kcal: 147, p: 6.3, c: 5.0, f: 12.6 },
      ],
      dinner: [
        { foodId: "paneer", name: "Grilled Paneer Tikka (or Tandoori Chicken)", grams: 180, kcal: 477, p: 32.9, c: 6.1, f: 37.4 },
        { foodId: "spinach", name: "Sautéed Garlic Spinach with Butter", grams: 150, kcal: 80, p: 4.3, c: 5.4, f: 5.0 },
      ],
    },
  },
  {
    id: "student_budget_indian",
    title: "Indian Student & Quick-Prep Budget Plan",
    description: "Affordable, quick-to-prepare, highly nutritious meals requiring minimal cooking equipment (Poha, Chana Chaat, Khichdi).",
    region: "Budget Friendly",
    category: "Quick Prep",
    calories: 2000,
    macros: { p: 85, c: 275, f: 52 },
    meals: {
      breakfast: [
        { foodId: "poha", name: "Quick Peanut Poha", grams: 160, kcal: 288, p: 5.6, c: 51.2, f: 7.2 },
        { foodId: "banana", name: "Banana", grams: 100, kcal: 89, p: 1.1, c: 22.8, f: 0.3 },
      ],
      lunch: [
        { foodId: "chapati", name: "Chapati (Whole Wheat Roti)", grams: 70, kcal: 208, p: 6.3, c: 38.5, f: 2.8 },
        { foodId: "lentils_dal", name: "Dal Tadka", grams: 200, kcal: 220, p: 14.4, c: 33.0, f: 4.4 },
        { foodId: "dahi", name: "Curd / Dahi", grams: 100, kcal: 62, p: 3.8, c: 4.5, f: 3.5 },
      ],
      snack: [
        { foodId: "roasted_chana", name: "Desi Bhuna Chana Chaat (Lemon & Onion)", grams: 50, kcal: 180, p: 9.5, c: 29.0, f: 2.8 },
      ],
      dinner: [
        { foodId: "egg_bhurji", name: "Quick 2-Egg Bhurji (or Paneer Bhurji)", grams: 130, kcal: 234, p: 16.2, c: 4.2, f: 16.9 },
        { foodId: "chapati", name: "Chapati (2 pcs)", grams: 70, kcal: 208, p: 6.3, c: 38.5, f: 2.8 },
      ],
    },
  },
]

export function searchFoods(query) {
  if (!query) return []
  const q = query.toLowerCase()
  return FOODS_CATALOG.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q) ||
      (f.category && f.category.toLowerCase().includes(q)) ||
      (f.cuisine && f.cuisine.toLowerCase().includes(q)) ||
      f.tags.some((t) => t.toLowerCase().includes(q))
  )
}

export function getFoodById(id) {
  return FOODS_CATALOG.find((f) => f.id === id)
}
