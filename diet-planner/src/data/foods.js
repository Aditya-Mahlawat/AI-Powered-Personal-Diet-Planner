// src/data/foods.js
// Foods catalog — used for meal planning and intake logging
// Tags: veg, vegan, nonveg, nuts, lactose, gluten, dairy

export const FOODS_CATALOG = [
  // Grains & Cereals
  { id: "oats", name: "Oats", per100: { kcal: 379, p: 13.2, c: 67.7, f: 6.5 }, tags: ["veg", "vegan", "gluten"], cuisine: "global" },
  { id: "brown_rice", name: "Brown Rice", per100: { kcal: 370, p: 7.9, c: 77.0, f: 2.9 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "white_rice", name: "White Rice", per100: { kcal: 365, p: 7.1, c: 79.9, f: 0.7 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "quinoa", name: "Quinoa", per100: { kcal: 368, p: 14.1, c: 64.2, f: 6.1 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "whole_wheat_bread", name: "Whole Wheat Bread", per100: { kcal: 247, p: 9.0, c: 46.1, f: 3.4 }, tags: ["veg", "vegan", "gluten"], cuisine: "global" },
  { id: "chapati", name: "Chapati (Roti)", per100: { kcal: 297, p: 9.0, c: 55.0, f: 4.0 }, tags: ["veg", "vegan", "gluten"], cuisine: "indian" },
  { id: "upma_semolina", name: "Upma (Semolina)", per100: { kcal: 123, p: 4.0, c: 23.0, f: 1.5 }, tags: ["veg", "gluten"], cuisine: "indian" },

  // Proteins — Vegetarian
  { id: "paneer", name: "Paneer", per100: { kcal: 265, p: 18.0, c: 6.0, f: 20.0 }, tags: ["veg", "lactose", "dairy"], cuisine: "indian" },
  { id: "tofu", name: "Tofu", per100: { kcal: 76, p: 8.0, c: 1.9, f: 4.8 }, tags: ["veg", "vegan"], cuisine: "asian" },
  { id: "lentils_dal", name: "Lentils (Dal)", per100: { kcal: 116, p: 9.0, c: 20.0, f: 0.4 }, tags: ["veg", "vegan"], cuisine: "indian" },
  { id: "chickpeas_chole", name: "Chickpeas (Chole)", per100: { kcal: 164, p: 8.9, c: 27.4, f: 2.6 }, tags: ["veg", "vegan"], cuisine: "indian" },
  { id: "rajma", name: "Kidney Beans (Rajma)", per100: { kcal: 127, p: 8.7, c: 22.8, f: 0.5 }, tags: ["veg", "vegan"], cuisine: "indian" },
  { id: "moong_dal", name: "Moong Dal", per100: { kcal: 105, p: 7.0, c: 18.5, f: 0.4 }, tags: ["veg", "vegan"], cuisine: "indian" },
  { id: "greek_yogurt", name: "Greek Yogurt", per100: { kcal: 59, p: 10.0, c: 3.6, f: 0.4 }, tags: ["veg", "lactose", "dairy"], cuisine: "global" },
  { id: "cottage_cheese", name: "Cottage Cheese (Low Fat)", per100: { kcal: 72, p: 12.4, c: 3.0, f: 1.0 }, tags: ["veg", "lactose", "dairy"], cuisine: "global" },
  { id: "milk", name: "Skimmed Milk", per100: { kcal: 34, p: 3.4, c: 4.9, f: 0.1 }, tags: ["veg", "lactose", "dairy"], cuisine: "global" },

  // Proteins — Non-Vegetarian
  { id: "egg", name: "Egg (Boiled)", per100: { kcal: 155, p: 13.0, c: 1.1, f: 11.0 }, tags: ["nonveg"], cuisine: "global" },
  { id: "chicken_breast", name: "Chicken Breast", per100: { kcal: 165, p: 31.0, c: 0.0, f: 3.6 }, tags: ["nonveg"], cuisine: "global" },
  { id: "tuna", name: "Tuna (Canned)", per100: { kcal: 116, p: 25.5, c: 0.0, f: 1.0 }, tags: ["nonveg"], cuisine: "global" },
  { id: "salmon", name: "Salmon", per100: { kcal: 208, p: 20.0, c: 0.0, f: 13.4 }, tags: ["nonveg"], cuisine: "global" },
  { id: "mutton", name: "Mutton (Lean)", per100: { kcal: 143, p: 27.0, c: 0.0, f: 3.5 }, tags: ["nonveg"], cuisine: "indian" },

  // Vegetables
  { id: "spinach", name: "Spinach", per100: { kcal: 23, p: 2.9, c: 3.6, f: 0.4 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "broccoli", name: "Broccoli", per100: { kcal: 34, p: 2.8, c: 6.6, f: 0.4 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "carrot", name: "Carrot", per100: { kcal: 41, p: 0.9, c: 9.6, f: 0.2 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "sweet_potato", name: "Sweet Potato", per100: { kcal: 86, p: 1.6, c: 20.1, f: 0.1 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "tomato", name: "Tomato", per100: { kcal: 18, p: 0.9, c: 3.9, f: 0.2 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "cucumber", name: "Cucumber", per100: { kcal: 15, p: 0.7, c: 3.6, f: 0.1 }, tags: ["veg", "vegan"], cuisine: "global" },

  // Fruits
  { id: "apple", name: "Apple", per100: { kcal: 52, p: 0.3, c: 14.0, f: 0.2 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "banana", name: "Banana", per100: { kcal: 89, p: 1.1, c: 22.8, f: 0.3 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "mango", name: "Mango", per100: { kcal: 60, p: 0.8, c: 15.0, f: 0.4 }, tags: ["veg", "vegan"], cuisine: "indian" },
  { id: "orange", name: "Orange", per100: { kcal: 47, p: 0.9, c: 11.8, f: 0.1 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "berries", name: "Mixed Berries", per100: { kcal: 57, p: 0.7, c: 14.5, f: 0.3 }, tags: ["veg", "vegan"], cuisine: "global" },

  // Fats & Nuts
  { id: "almonds", name: "Almonds", per100: { kcal: 579, p: 21.2, c: 21.6, f: 49.9 }, tags: ["veg", "vegan", "nuts"], cuisine: "global" },
  { id: "walnuts", name: "Walnuts", per100: { kcal: 654, p: 15.2, c: 13.7, f: 65.2 }, tags: ["veg", "vegan", "nuts"], cuisine: "global" },
  { id: "peanut_butter", name: "Peanut Butter", per100: { kcal: 588, p: 25.1, c: 20.0, f: 50.4 }, tags: ["veg", "vegan", "nuts"], cuisine: "global" },
  { id: "avocado", name: "Avocado", per100: { kcal: 160, p: 2.0, c: 8.5, f: 14.7 }, tags: ["veg", "vegan"], cuisine: "global" },
  { id: "olive_oil", name: "Olive Oil", per100: { kcal: 884, p: 0.0, c: 0.0, f: 100.0 }, tags: ["veg", "vegan"], cuisine: "global" },

  // Prepared Indian Dishes
  { id: "idli", name: "Idli", per100: { kcal: 58, p: 2.0, c: 12.0, f: 0.4 }, tags: ["veg"], cuisine: "indian" },
  { id: "dosa", name: "Dosa", per100: { kcal: 120, p: 3.5, c: 20.5, f: 3.0 }, tags: ["veg"], cuisine: "indian" },
  { id: "sambar", name: "Sambar", per100: { kcal: 42, p: 2.0, c: 7.2, f: 0.5 }, tags: ["veg", "vegan"], cuisine: "indian" },
  { id: "dal_makhani", name: "Dal Makhani", per100: { kcal: 135, p: 7.0, c: 16.0, f: 4.5 }, tags: ["veg", "dairy"], cuisine: "indian" },
];

export function searchFoods(query) {
  const q = query.toLowerCase();
  return FOODS_CATALOG.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q) ||
      f.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getFoodById(id) {
  return FOODS_CATALOG.find((f) => f.id === id);
}
