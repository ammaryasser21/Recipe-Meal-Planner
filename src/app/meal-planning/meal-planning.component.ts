import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../shared/recipe.service';
import { Recipe } from '../models/recipe.model';
import { MealPlan } from '../models/meal-plan.model';
import { AuthService } from '../shared/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-meal-planning',
  templateUrl: './meal-planning.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatListModule,
    NavbarComponent,
    FooterComponent
],
})
export class MealPlanningComponent implements OnInit {
  mealPlan: MealPlan | null = null;
  timeSlot: string[] = ['Breakfast', 'Lunch', 'Dinner'];
  recipes: Recipe[] = [];
  totalCost = 0;
  currentUser: User | null = null;

  constructor(
    private readonly recipeService: RecipeService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadMealPlan();
  }

  loadMealPlan() {
     const userId = this.authService.getUserId() ?? 'user_1';
   const storedMealPlan = localStorage.getItem(`mealPlan_${userId}`);

    if (storedMealPlan) {
      this.mealPlan = JSON.parse(storedMealPlan);

    } else {
      this.mealPlan = { userId: userId, items: [], startDate: new Date() };
      this.saveMealPlan();
    }
   this.loadRecipes();

  }

  loadRecipes() {
    if (this.mealPlan) {
      console.log(this.mealPlan);
        const recipeIds = this.mealPlan.items.map((item) => item.recipeId);
      console.log("recipeIds :" + recipeIds);
      if (recipeIds.length > 0) {
        this.recipeService.getAllRecipes().subscribe((allRecipes: any) => {
          this.recipes = allRecipes.filter((recipe: { _id: string }) => {
              console.log('recipe._id', recipe);
              return recipeIds.includes(recipe._id);
            });
          this.recipes = this.recipes.map(recipe => {
              const mealPlanItem = this.mealPlan?.items.find(item => item.recipeId === recipe._id);
              if (mealPlanItem?.timeSlot) {
                recipe.timeSlot = mealPlanItem.timeSlot
              }
            if (!recipe.timeSlot) {
              console.warn(`Recipe ${recipe._id} has no timeSlot, defaulting to 'Breakfast'.`);
              recipe.timeSlot = 'Breakfast';
            } else if (!this.isValidTimeSlot(recipe.timeSlot)) {
                console.warn(`Recipe ${recipe._id} has invalid timeSlot '${recipe.timeSlot}'. Defaulting to 'Breakfast'.`);
              recipe.timeSlot = 'Breakfast'
            }
              return recipe;
          })
        this.calculateTotalCost();
        });
      }
    }
  }

  calculateTotalCost() {
   this.totalCost = this.recipes.reduce((total, recipe) => {
     if (recipe?.ingredients) {
        return (
           total +
           recipe.ingredients.reduce(
            (sum, ingredient) => sum + (ingredient.amount ?? 0),
            0
          )
        );
      }
     return total;
   }, 0);
 }

  removeFromList(recipeId: string) {
    if (this.mealPlan) {
      this.mealPlan.items = this.mealPlan.items.filter(
        (item) => item.recipeId !== recipeId
      );
      this.recipes = this.recipes.filter((recipe) => recipe._id !== recipeId);
      this.saveMealPlan();
      this.calculateTotalCost();
    }
  }

 clearList() {
    if (this.mealPlan) {
      this.mealPlan.items = [];
     this.recipes = [];
      this.totalCost = 0;
      this.saveMealPlan();
   }
  }

  saveMealPlan() {
    const userId = this.authService.getUserId() ?? 'user_1';
    if (this.mealPlan) {
      localStorage.setItem(`mealPlan_${userId}`, JSON.stringify(this.mealPlan));
   }
 }

    isValidTimeSlot(timeSlot: string | undefined): boolean {
    return this.timeSlot.includes(timeSlot as string);
  }
}