type FoodValues = { calories: unknown; protein: unknown; carbs: unknown; fat: unknown };

export function portionNutrition(food: FoodValues, grams: unknown) {
  const factor = Number(grams) / 100;
  return {
    calories: Number(food.calories) * factor,
    protein: Number(food.protein) * factor,
    carbs: Number(food.carbs) * factor,
    fat: Number(food.fat) * factor,
  };
}

export function sumNutrition(items: Array<{ grams: unknown; food: FoodValues }>) {
  return items.reduce((total, item) => {
    const portion = portionNutrition(item.food, item.grams);
    return { calories: total.calories + portion.calories, protein: total.protein + portion.protein, carbs: total.carbs + portion.carbs, fat: total.fat + portion.fat };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
}
