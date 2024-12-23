import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { RecipeService } from '../shared/recipe.service';
import { Recipe, Ingredient, Macros } from '../models/recipe.model';
import { User } from '../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';
import { FooterComponent } from "../footer/footer.component";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    standalone: true,
    imports: [
    MatCardModule,
    CommonModule,
    NavbarComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FooterComponent
],
})
export class UserProfileComponent implements OnInit, OnDestroy {
    currentUser: User | null = null;
    favoriteRecipes: Recipe[] = [];
    savedRecipes: Recipe[] = [];
    postedRecipes: Recipe[] = [];
    private userSubscription: Subscription = new Subscription();
    newRecipe: any = {
        title: '',
        description: '',
        cookingTime: 0,
        calories: 0,
        imageUrl: null,
        ingredients: [],
        instructions: '',
        servings: 0,
        difficulty: 'easy',
        cuisine: '',
        author: '',
        likes: [],
        comments: [],
        ratings: [],
        createdAt: new Date(),
    };
    editMode: boolean = false;
    editingRecipeId: string | null = null;
    errorMessage: string | null = null;
    private postedRecipesKey='';

    constructor(
        private readonly authService: AuthService,
        private readonly recipeService: RecipeService,
        private readonly router: Router
    ) { }

    ngOnInit(): void {
        this.userSubscription = this.authService
            .getCurrentUserSubject()
            .subscribe((user) => {
                this.currentUser = user;
                if (this.currentUser?.id) {
                   this.postedRecipesKey = `postedRecipes-${this.currentUser?.id}`;
                    this.loadUserRecipes();
                     this.loadPostedRecipesFromLocalStorage(); 
                }
            });

    }
  private loadPostedRecipesFromLocalStorage(): void {
        const storedRecipes = localStorage.getItem(this.postedRecipesKey);
        if (storedRecipes) {
            this.postedRecipes = JSON.parse(storedRecipes);
        }
  }

  private savePostedRecipesToLocalStorage() {
       localStorage.setItem(this.postedRecipesKey, JSON.stringify(this.postedRecipes));
    }

    loadUserRecipes(): void {
        if (this.currentUser?.id) {
            this.recipeService
                .getFavoritesByUser(this.currentUser.id)
                .subscribe((recipes) => (this.favoriteRecipes = recipes));
            this.recipeService
                .getSavedByUser(this.currentUser.id)
                .subscribe((recipes) => (this.savedRecipes = recipes));
        
        }
    }


    editRecipe(recipe: Recipe) {
        this.editMode = true;
        this.editingRecipeId = recipe._id;
        this.recipeService.getRecipeById(recipe._id).subscribe(
            (retrievedRecipe) => {
                if (retrievedRecipe) {
                    this.newRecipe = {
                        ...retrievedRecipe,
                        ingredients: retrievedRecipe.ingredients.map((ingredient: any) => ({
                            name: ingredient.name,
                            amount: ingredient.amount,
                            unit: ingredient.unit,
                        })),
                        instructions: retrievedRecipe.instructions ? retrievedRecipe.instructions[0] : '',

                    }
                    console.log("RECIPE TO EDIT", this.newRecipe)
                }
            },
            (error) => {
                console.error('Error fetching recipe for edit:', error);
                this.errorMessage = 'Error fetching recipe for edit.';
            }
        )

    }

    deleteRecipe(recipeId: string) {
        if (confirm('Are you sure you want to delete this recipe?')) {
            this.recipeService.deleteRecipe(recipeId).subscribe({
                next: () => {
                    this.postedRecipes = this.postedRecipes.filter(
                        (recipe) => recipe._id !== recipeId
                    );
                    this.savePostedRecipesToLocalStorage();
                    console.log('Recipe deleted successfully');

                },
                error: (error) => {
                    console.error('Error deleting recipe:', error);
                    this.errorMessage =
                        'Failed to delete recipe. Please try again.';
                },
            });
        }
    }

    onSubmit(form: NgForm) {
        if (!this.currentUser?.id) {
            this.errorMessage = 'User not logged in.';
            return;
        }
        if (form.invalid) {
            this.errorMessage = 'Please fill the required fields';
            return;
        }


        const transformedIngredients = this.newRecipe.ingredients.map(
            (ingredient: any) => ({
                name: ingredient.name,
                amount: Number(ingredient.amount),
                unit: ingredient.unit,
            })
        );

        const recipeToPost = {
            ...this.newRecipe,
            ingredients: transformedIngredients,
            instructions: this.newRecipe.instructions ? [this.newRecipe.instructions] : [],
        };

        console.log('Recipe to post:', recipeToPost);
        console.log('Transformed Data:', {
            title: recipeToPost.title,
            description: recipeToPost.description,
            cookingTime: recipeToPost.cookingTime,
            calories: recipeToPost.calories,
            imageUrl: recipeToPost.imageUrl,
            ingredients: recipeToPost.ingredients,
            instructions: recipeToPost.instructions,
            servings: recipeToPost.servings,
            difficulty: recipeToPost.difficulty,
            cuisine: recipeToPost.cuisine,
            author: recipeToPost.author,
            likes: recipeToPost.likes,
            comments: recipeToPost.comments,
            ratings: recipeToPost.ratings,
            createdAt: recipeToPost.createdAt
        });

        if (this.editMode && this.editingRecipeId) {
            console.log('updating')
            this.recipeService.updateRecipe({ ...recipeToPost, _id: this.editingRecipeId }).subscribe({
                next: (recipe) => {
                    console.log('Recipe updated:', recipe);
                    console.log('Recipe updated:', this.editingRecipeId);
                    this.postedRecipes = this.postedRecipes.map((postedRecipe) => {
                        if (postedRecipe._id === recipe._id) {
                            return recipe; 
                        }
                        return postedRecipe; 
                    });
                  this.savePostedRecipesToLocalStorage(); 

                    this.newRecipe = {
                        title: '',
                        description: '',
                        cookingTime: 0,
                        calories: 0,
                        imageUrl: null,
                        ingredients: [],
                        instructions: '',
                        servings: 0,
                        difficulty: 'easy',
                        cuisine: '',
                        author: '',
                        likes: [],
                        comments: [],
                        ratings: [],
                        createdAt: new Date(),
                    };
                    this.editMode = false;
                    this.editingRecipeId = null;
                    this.errorMessage = null;
                    form.resetForm();

                },
                error: (error) => {
                    this.errorMessage =
                        'Failed to update recipe. Please check the form and try again.';
                    if (error instanceof HttpErrorResponse) {
                        console.log(`Http Error Status: ${error.status}`);
                    }
                    console.error('Error updating recipe:', error);
                },
            });
        } else {
            this.recipeService.addRecipe(recipeToPost).subscribe({
                next: (recipe) => {
                    console.log('Recipe added:', recipe);
                    if (recipe) {
                      this.postedRecipes.push(recipe);
                      this.savePostedRecipesToLocalStorage(); 
                    }
                    this.newRecipe = {
                        title: '',
                        description: '',
                        cookingTime: 0,
                        calories: 0,
                        imageUrl: null,
                        ingredients: [],
                        instructions: '',
                        servings: 0,
                        difficulty: 'easy',
                        cuisine: '',
                        author: '',
                        likes: [],
                        comments: [],
                        ratings: [],
                        createdAt: new Date(),
                    };
                    this.errorMessage = null;
                    form.resetForm();
                    

                },
                error: (error) => {
                    this.errorMessage =
                        'Failed to add recipe. Please check the form and try again.';
                    if (error instanceof HttpErrorResponse) {
                        console.log(`Http Error Status: ${error.status}`);
                    }
                    console.error('Error adding recipe:', error);
                },
            });
        }

    }


    addIngredient() {
        this.newRecipe.ingredients.push({ name: '', amount: 0, unit: '' });
    }

    removeIngredient(index: number) {
        this.newRecipe.ingredients.splice(index, 1);
    }
    navigateToDetails(recipeId: string) {
        this.router.navigate(['/details', recipeId]);
    }
    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}