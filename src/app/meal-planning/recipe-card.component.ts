import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative bg-white rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div class="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <img
          [src]="recipe.imageUrl"
          [alt]="recipe.title"
          class="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          (click)="onRemove.emit(recipe._id)"
          class="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-red-600 hover:bg-red-100 transition-all duration-300 transform hover:scale-110"
          aria-label="Remove Recipe"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="p-6">
        <h4 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{{ recipe.title }}</h4>
        
        <div class="flex items-center gap-6 mb-4">
          <span class="flex items-center gap-2 text-gray-600">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium">{{ recipe.cookingTime }} min</span>
          </span>
          
          <span class="flex items-center gap-2 text-gray-600">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span class="text-sm font-medium">{{ recipe.calories }} cal</span>
          </span>
        </div>

        <div class="space-y-3">
          <h5 class="font-semibold text-gray-900">Ingredients:</h5>
          <div class="flex flex-wrap gap-2">
            @for (ingredient of recipe.ingredients; track ingredient.name) {
              <span class="px-3 py-1 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-full ring-1 ring-emerald-100">
                {{ ingredient.name }}
                <span class="text-emerald-600 ml-1">{{ ingredient.amount }}</span>
              </span>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;
  @Output() onRemove = new EventEmitter<string>();
}