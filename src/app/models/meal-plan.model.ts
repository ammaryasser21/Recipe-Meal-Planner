export interface MealPlan {
  userId: string;
  items: MealPlanItem[];
  startDate?: Date;
  endDate?: Date;
}

export interface MealPlanItem {
  recipeId: string;
  date?: Date;
  servings?: number;
  timeSlot?: 'Breakfast' | 'Lunch' | 'Dinner';
}