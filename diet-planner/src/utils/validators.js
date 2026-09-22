// src/utils/validators.js

export function validateProfile(form) {
  const errors = {};

  if (!form.name || form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const age = Number(form.age);
  if (!form.age || isNaN(age) || age < 10 || age > 100) {
    errors.age = "Age must be between 10 and 100.";
  }

  if (!form.sex || !["male", "female"].includes(form.sex)) {
    errors.sex = "Please select a biological sex.";
  }

  const height = Number(form.height_cm);
  if (!form.height_cm || isNaN(height) || height < 100 || height > 250) {
    errors.height_cm = "Height must be between 100 cm and 250 cm.";
  }

  const weight = Number(form.weight_kg);
  if (!form.weight_kg || isNaN(weight) || weight < 20 || weight > 300) {
    errors.weight_kg = "Weight must be between 20 kg and 300 kg.";
  }

  if (!form.activity_level || !["sedentary", "light", "moderate", "active"].includes(form.activity_level)) {
    errors.activity_level = "Please select an activity level.";
  }

  if (!form.goal || !["cut", "maintain", "gain"].includes(form.goal)) {
    errors.goal = "Please select a goal.";
  }

  if (!form.diet_pref || !["veg", "vegan", "omnivore"].includes(form.diet_pref)) {
    errors.diet_pref = "Please select a dietary preference.";
  }

  const budget = Number(form.budget_per_day);
  if (form.budget_per_day && (isNaN(budget) || budget < 0 || budget > 10000)) {
    errors.budget_per_day = "Daily budget must be a positive number.";
  }

  const timeline = Number(form.timeline_weeks);
  if (form.timeline_weeks && (isNaN(timeline) || timeline < 1 || timeline > 52)) {
    errors.timeline_weeks = "Timeline must be between 1 and 52 weeks.";
  }

  return errors;
}

export function validateAuth(form) {
  const errors = {};

  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.password || form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}
