// src/utils/macros.js
// Mifflin-St Jeor BMR formula (as specified in project document)

const PAL = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 */
export function calculateBMR({ sex, weight_kg, height_cm, age }) {
  const s = sex === "male" ? 5 : -161;
  return 10 * weight_kg + 6.25 * height_cm - 5 * age + s;
}

/**
 * Calculate Total Daily Energy Expenditure
 */
export function calculateTDEE(bmr, activity_level) {
  return bmr * (PAL[activity_level] || 1.2);
}

/**
 * Calculate all targets: BMR, TDEE, goal-adjusted calories, and macro split (30/40/30 P/C/F)
 * Returns { bmr, tdee, cal, macros: { p, c, f } }
 */
export function calculateTargets({ sex, weight_kg, height_cm, age, activity_level, goal }) {
  const bmr = calculateBMR({ sex, weight_kg, height_cm, age });
  const tdee = bmr * (PAL[activity_level] || 1.2);
  // goal adjustment: cut = -15%, gain = +15%, maintain = 0%
  const delta = goal === "cut" ? -0.15 : goal === "gain" ? 0.15 : 0;
  const cal = Math.round(tdee * (1 + delta));
  // default macro split: Protein 30%, Carbs 40%, Fat 30%
  const macros = {
    p: Math.round((0.3 * cal) / 4),   // protein: 4 kcal/g
    c: Math.round((0.4 * cal) / 4),   // carbs: 4 kcal/g
    f: Math.round((0.3 * cal) / 9),   // fat: 9 kcal/g
  };
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), cal, macros };
}

/**
 * Compute nutrition values for a given food item and gram amount
 */
export function computeNutrition(food, grams) {
  if (!food || !food.per100 || !grams) {
    return { kcal: 0, p: 0, c: 0, f: 0 };
  }
  const ratio = grams / 100;
  return {
    kcal: Math.round(food.per100.kcal * ratio),
    p: Math.round(food.per100.p * ratio * 10) / 10,
    c: Math.round(food.per100.c * ratio * 10) / 10,
    f: Math.round(food.per100.f * ratio * 10) / 10,
  };
}

/**
 * Greedy knapsack-style meal planner (as specified in project document)
 * Selects foods to approximate target macros while respecting diet preferences and allergies
 */
export function planDay({ macros, diet_pref, allergies = [], foods }) {
  let rem = { p: macros.p, c: macros.c, f: macros.f };
  const plan = [];

  const filtered = foods.filter((food) => {
    if (diet_pref === "vegan" && food.tags.includes("nonveg")) return false;
    if (diet_pref === "veg" && food.tags.includes("nonveg")) return false;
    if (allergies.some((a) => food.tags.includes(a))) return false;
    return true;
  });

  // shuffle to add variety across plan generations
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);

  for (const food of shuffled) {
    let grams = 0;
    let prevScore = Math.abs(rem.p) + Math.abs(rem.c) + Math.abs(rem.f);

    while (rem.p > 0 || rem.c > 0 || rem.f > 0) {
      grams += 50;
      if (grams > 400) break;
      const ratio = grams / 100;
      const currScore =
        Math.abs(rem.p - food.per100.p * ratio) +
        Math.abs(rem.c - food.per100.c * ratio) +
        Math.abs(rem.f - food.per100.f * ratio);
      if (currScore > prevScore && grams > 50) {
        grams -= 50;
        break;
      }
      prevScore = currScore;
    }

    if (grams > 0) {
      const nutrition = computeNutrition(food, grams);
      rem.p = Math.max(0, rem.p - nutrition.p);
      rem.c = Math.max(0, rem.c - nutrition.c);
      rem.f = Math.max(0, rem.f - nutrition.f);
      const slots = ["breakfast", "lunch", "lunch", "snack", "dinner", "dinner"];
      const mealSlot = slots[plan.length] || "dinner";
      plan.push({
        foodId: food.id,
        name: food.name,
        grams,
        ...nutrition,
        tags: food.tags,
        mealSlot,
      });
    }
    if (plan.length >= 6) break;
  }

  return plan;
}

/**
 * Scale an Indian preset meal plan to fit the user's specific daily calorie quota
 */
export function scalePresetPlan(presetPlan, targetCalories) {
  const target = targetCalories || presetPlan.calories || 2000;
  const base = presetPlan.calories || 2000;
  const scale = target / base;
  const meals = {};
  let totalKcal = 0, totalP = 0, totalC = 0, totalF = 0;

  for (const [slot, items] of Object.entries(presetPlan.meals)) {
    meals[slot] = items.map((item) => {
      const grams = Math.max(15, Math.round((item.grams * scale) / 5) * 5);
      const ratio = item.grams > 0 ? grams / item.grams : 1;
      const scaledItem = {
        ...item,
        grams,
        kcal: Math.round(item.kcal * ratio),
        p: Math.round(item.p * ratio * 10) / 10,
        c: Math.round(item.c * ratio * 10) / 10,
        f: Math.round(item.f * ratio * 10) / 10,
        mealSlot: slot,
      };
      totalKcal += scaledItem.kcal;
      totalP += scaledItem.p;
      totalC += scaledItem.c;
      totalF += scaledItem.f;
      return scaledItem;
    });
  }

  return {
    ...presetPlan,
    scaledCalories: totalKcal,
    scaledMacros: {
      p: Math.round(totalP),
      c: Math.round(totalC),
      f: Math.round(totalF),
    },
    meals,
    flatItems: Object.values(meals).flat(),
  };
}

/**
 * Compute totals from an array of logged intake items
 */
export function computeIntakeTotals(items = []) {
  return items.reduce(
    (acc, item) => ({
      kcal: acc.kcal + (item.kcal || 0),
      p: Math.round((acc.p + (item.p || 0)) * 10) / 10,
      c: Math.round((acc.c + (item.c || 0)) * 10) / 10,
      f: Math.round((acc.f + (item.f || 0)) * 10) / 10,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 }
  );
}
