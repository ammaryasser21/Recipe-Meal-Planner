export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;       
  password?: string;
  following?: string[];
  followers?: string[];
  savedRecipes?: string[];
  favoriteRecipes?: string[];
  
}