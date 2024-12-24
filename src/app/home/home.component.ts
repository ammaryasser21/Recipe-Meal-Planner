import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { RecipeService } from '../shared/recipe.service';
import { Recipe } from '../models/recipe.model';
import { Router, RouterModule } from '@angular/router';
import { User } from '../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../shared/user.service';
import { FooterComponent } from "../footer/footer.component";
import { FeaturedChefsComponent } from "./featured-chefs.component";
import { CookingTipsComponent } from "./cooking-tips.component";
import { CuisineCategoriesComponent } from "./cuisine-categories.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatCheckboxModule,
    HttpClientModule,
    NavbarComponent,
    RouterModule,
    FooterComponent,
    FeaturedChefsComponent,
    CookingTipsComponent,
    CuisineCategoriesComponent
],
})
export class HomeComponent implements OnInit {
  recipes: Recipe[] = [];
  postedRecipes: Recipe[] = [];
  private postedRecipesKey='';
  currentUser: User | null = null;
    followedUsers: { [userId: string]: string[] } = {};
  searchForm: FormGroup;
  showOptions = false;

  constructor(
    private readonly authService: AuthService,
    private readonly recipeService: RecipeService,
    public router: Router,
      private readonly userService: UserService,
    private readonly fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      cuisine: [''],
      ingredients: [''],
      cookingTime: [null],
      follow: [false],
      posted: [false],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
      if(this.currentUser?.id){
          this.userService.getFollowedUsers(this.currentUser.id)
            .subscribe(followedUsers => {
            this.followedUsers = followedUsers
            })
            this.postedRecipesKey = `postedRecipes-${this.currentUser?.id}`;
      }
    this.loadRecipes();
    this.loadPostedRecipesFromLocalStorage()
  }

  private loadPostedRecipesFromLocalStorage(): void {
    const storedRecipes = localStorage.getItem(this.postedRecipesKey);
    if (storedRecipes) {
        this.postedRecipes = JSON.parse(storedRecipes);
    }
}
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  loadRecipes(): void {
    this.recipeService.getAllRecipes().subscribe(
      (recipes) => {
         console.log('Recipes from API:', recipes);
        this.recipes = recipes;

      },
      (error) => {
        console.error('Error loading recipes:', error);
      }
    );
  }

  likeRecipe(recipeId: string) {
    if (this.currentUser?.id) {
      this.recipeService
        .addToFavorites(recipeId, this.currentUser.id)
        .subscribe((response) => {
          if (response.unfavorited) {
            console.log('removed from favorites!');
            return;
          }
          console.log('added to favorites!');
        });
    }
  }

  saveRecipe(recipeId: string) {
    if (this.currentUser?.id) {
      this.recipeService
        .addToSaved(recipeId, this.currentUser.id)
        .subscribe((response) => {
          if (response.unsaved) {
            console.log('Removed from saved!');
            return;
          }
          console.log('Added to saved!');
        });
    }
  }
  navigateToDetails(recipeId: string) {
    this.router.navigate(['/details', recipeId]);
  }

  navigateToMealPlanning() {
    this.router.navigate(['/meal-planning']);
  }
  searchRecipes() {
    this.recipeService.getAllRecipes().subscribe((recipes) => {
      let filteredRecipes = recipes;
      if (this.searchForm.get('query')?.value) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) =>
            recipe.title
              .toLowerCase()
              .includes(this.searchForm.get('query')?.value.toLowerCase()) ||
            recipe.description
              .toLowerCase()
              .includes(this.searchForm.get('query')?.value.toLowerCase())
        );
      }
      if (this.searchForm.get('cuisine')?.value) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          recipe.cuisine
            ?.toLowerCase()
            .includes(this.searchForm.get('cuisine')?.value.toLowerCase())
        );
      }
      if (this.searchForm.get('ingredients')?.value) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          recipe.ingredients?.some((ingredient) =>
            ingredient.name
              .toLowerCase()
              .includes(this.searchForm.get('ingredients')?.value.toLowerCase())
          )
        );
      }
      if (this.searchForm.get('cookingTime')?.value) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) =>
            recipe.cookingTime === this.searchForm.get('cookingTime')?.value
        );
      }
        if(this.searchForm.get('follow')?.value) {
          if (this.currentUser?.id && this.followedUsers[this.currentUser.id]) {
            filteredRecipes = filteredRecipes.filter(recipe =>
                this.currentUser?.id ? this.followedUsers[this.currentUser.id].includes(recipe.userId) : false
            );
        } else {
            filteredRecipes = [];
        }
        }
      if (this.searchForm.get('posted')?.value) {
        if (this.currentUser?.id) {
          filteredRecipes = this.postedRecipes
        }
      }

      this.recipes = filteredRecipes;
    });
  }
  addToShoppingList(recipe: Recipe): void {
    if (this.currentUser?.id) {
        this.recipeService.addToShoppingList(recipe,this.currentUser.id)
    }
  }

}