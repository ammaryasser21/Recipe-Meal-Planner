import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { MealPlan } from '../models/meal-plan.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {
    private readonly recipesKey = 'recipes';
    private readonly apiUrl = 'http://localhost:3000/api/recipes'; 
    private recipes: Recipe[] = [];
    private readonly shoppingList = new BehaviorSubject<Recipe[]>([]);
    shoppingList$ = this.shoppingList.asObservable();

    constructor(private http: HttpClient) {
    }

   getAllRecipes(): Observable<Recipe[]> {
        return this.http.get<any[]>(this.apiUrl)
            .pipe(
                map(recipes => recipes.map(recipe => ({
                    ...recipe,
                   id: recipe._id, 
                   name: recipe.title
                }))),
                tap(recipes => this.recipes = recipes),
                catchError(this.handleError<Recipe[]>('getAllRecipes', []))
            );
    }

    getRecipeById(recipeId: string): Observable<Recipe | undefined> {
        return this.http.get<any>(`${this.apiUrl}/${recipeId}`)
            .pipe(
              map(recipe => ({
                ...recipe,
                id: recipe._id,
                name: recipe.title,
                  instructions: recipe.instructions  
             })),
                catchError(this.handleError<Recipe>(`getRecipeById id=${recipeId}`))
            );
    }

    addRecipe(recipe: Recipe): Observable<Recipe> {
        return this.http.post<Recipe>(this.apiUrl, recipe)
            .pipe(
                tap(newRecipe => {
                     this.recipes.push(newRecipe) 
                 }),
                catchError(this.handleError<Recipe>('addRecipe'))
            );
    }

   deleteRecipe(recipeId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${recipeId}`)
        .pipe(
            tap(() => {
               this.recipes = this.recipes.filter(recipe => recipe._id !== recipeId)
            }),
             catchError(this.handleError<any>('deleteRecipe'))
        )
    }

    updateRecipe(updatedRecipe: Recipe): Observable<Recipe> {
         return this.http.put<Recipe>(`${this.apiUrl}/${updatedRecipe._id}`, updatedRecipe)
            .pipe(
                tap(recipe => {
                    const index = this.recipes.findIndex(r => r._id === recipe._id);
                    if (index !== -1) {
                        this.recipes[index] = recipe;
                    }
                }),
                catchError(this.handleError<Recipe>('updateRecipe'))
            );
    }

    addToFavorites(recipeId: string, userId: string): Observable<any> {
        const favoritesKey = `favorites_${userId}`;
        let favorites: string[] = JSON.parse(
            localStorage.getItem(favoritesKey) ?? '[]'
        );

        if (!favorites.includes(recipeId)) {
            favorites.push(recipeId);
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            return of({ success: true });
        } else {
            favorites = favorites.filter((id) => id !== recipeId);
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            return of({ success: true, unfavorited: true });
        }
    }

    addToSaved(recipeId: string, userId: string): Observable<any> {
        const savedKey = `savedRecipes_${userId}`;
        let saved: string[] = JSON.parse(
            localStorage.getItem(savedKey) ?? '[]'
        );
        if (!saved.includes(recipeId)) {
            saved.push(recipeId);
            localStorage.setItem(savedKey, JSON.stringify(saved));
            return of({ success: true });
        } else {
            saved = saved.filter((id) => id !== recipeId);
            localStorage.setItem(savedKey, JSON.stringify(saved));
            return of({ success: true, unsaved: true });
        }
    }

    addToMealPlan(
        recipeId: string,
        userId: string,
        timeSlot: string
    ): Observable<any> {
        const mealPlanKey = `mealPlan_${userId}`;
        try {
            let mealPlan: MealPlan = JSON.parse(
                localStorage.getItem(mealPlanKey) ?? '{}'
            ) || { userId, items: [] };

            const isRecipeInMealPlan = mealPlan.items.some(
                (item) => item.recipeId === recipeId
            );

            if (isRecipeInMealPlan) {
                mealPlan.items = mealPlan.items.filter(
                    (item) => item.recipeId !== recipeId
                );
                localStorage.setItem(mealPlanKey, JSON.stringify(mealPlan));
                return of({ success: true, removed: true });
            } else {
                mealPlan.items.push({ recipeId, date: new Date() });
                localStorage.setItem(mealPlanKey, JSON.stringify(mealPlan));
                return of({ success: true });
            }
        } catch (error) {
            console.error('Error adding to meal plan:', error);
            return throwError(() => new Error('Error adding to meal plan.'));
        }
    }

    getFavoritesByUser(userId: string): Observable<Recipe[]> {
        const favoritesKey = `favorites_${userId}`;
        const favoriteIds: string[] = JSON.parse(
            localStorage.getItem(favoritesKey) ?? '[]'
        );
        const favoriteRecipes = this.recipes.filter((recipe) =>
            favoriteIds.includes(recipe._id)
        );
        return of(favoriteRecipes);
    }

    getSavedByUser(userId: string): Observable<Recipe[]> {
        const savedRecipesKey = `savedRecipes_${userId}`;
        const savedRecipeIds: string[] = JSON.parse(
            localStorage.getItem(savedRecipesKey) ?? '[]'
        );
        const savedRecipes = this.recipes.filter((recipe) =>
            savedRecipeIds.includes(recipe._id)
        );
        return of(savedRecipes);
    }

  getPostedByUser(userId: string): Observable<Recipe[]> {
        return this.http.get<any[]>(this.apiUrl)
            .pipe(
                map(recipes => recipes.filter(recipe => recipe.author === userId)
                .map(recipe => ({
                    ...recipe,
                   id: recipe._id, 
                   name: recipe.title
                }))),
                tap(recipes => this.recipes = recipes),
                catchError(this.handleError<Recipe[]>('getAllRecipes', []))
            );
        
    }

    addToShoppingList(recipe: Recipe, userId: string): Observable<any> {
        const shoppingListKey = `shoppingList_${userId}`;
        try {
            let shoppingList: Recipe[] = JSON.parse(
                localStorage.getItem(shoppingListKey) ?? '[]'
            ) || [];
            const isRecipeInList = shoppingList.some(
                (item) => item._id === recipe._id
            );
            if (isRecipeInList) {
                shoppingList = shoppingList.filter((item) => item._id !== recipe._id);
                localStorage.setItem(shoppingListKey, JSON.stringify(shoppingList));
                this.shoppingList.next([...shoppingList])
                return of({ success: true, removed: true });
            } else {
                shoppingList.push(recipe);
                localStorage.setItem(shoppingListKey, JSON.stringify(shoppingList));
                this.shoppingList.next([...shoppingList])
                return of({ success: true });
            }
        } catch (error) {
            console.error('Error adding to shopping list:', error);
            return throwError(() => new Error('Error adding to shopping list'));
        }
    }


     private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error(`${operation} failed: ${error.message}`);
           if(error instanceof HttpErrorResponse){
             console.log(`Http Error Status: ${error.status}`);
           }
          return of(result as T);
      };
    }
}