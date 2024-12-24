import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../models/recipe.model';
import { RecipeCardComponent } from './recipe-card.component';

@Component({
  selector: 'app-time-slot',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  template: `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-90"></div>
        <div class="relative px-6 py-8">
          <h3 class="text-2xl font-bold text-white text-center">{{ timeSlot }}</h3>
          <div class="mt-2 flex justify-center">
            <span class="px-4 py-1 bg-white/20 rounded-full text-white text-sm">
              {{ recipes.length }} {{ recipes.length === 1 ? 'Recipe' : 'Recipes' }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="p-6">
        @if (recipes.length === 0) {
          <div class="text-center py-8">
            <div class="mx-auto w-16 h-16 mb-4 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <p class="text-gray-500">No recipes added yet</p>
          </div>
        } @else {
          <div class="space-y-6">
            @for (recipe of recipes; track recipe._id) {
              <app-recipe-card
                [recipe]="recipe"
                (onRemove)="removeRecipe.emit($event)"
              ></app-recipe-card>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class TimeSlotComponent {
  @Input() timeSlot!: string;
  @Input() recipes: Recipe[] = [];
  @Output() removeRecipe = new EventEmitter<string>();
}