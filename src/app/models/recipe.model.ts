
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  _id?: any;
}

export interface Macros {
  carb: number;
  protien: number;
  fats: number;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  cookingTime: number;
  calories:number;
  imageUrl: string | null;
  ingredients: Ingredient[];
  totalCost: number;
  macros: Macros[];
  userId: string;
  cuisine?: string;
  instructions: string[]; // Added instructions property here
  timeSlot: 'Breakfast' | 'Lunch' | 'Dinner'
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  rating?: number;
  ratings?: Rating[];
  comments?: Comment[];
  servings?: number;
  createdDate?: Date;
  likes?:number;
}

export interface Rating {
  userId: string;
  rating: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
}