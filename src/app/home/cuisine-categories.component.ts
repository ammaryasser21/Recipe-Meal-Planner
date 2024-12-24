import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuisine-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-gray-900 text-white">
      <div class="container px-4 mx-auto">
        <div class="max-w-2xl mx-auto text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">Explore Cuisines</h2>
          <p class="text-gray-400">Discover recipes from different culinary traditions</p>
        </div>

        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          @for (cuisine of cuisines; track cuisine.id) {
            <div class="group relative overflow-hidden rounded-2xl cursor-pointer">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10"></div>
              <img 
                [src]="cuisine.image" 
                [alt]="cuisine.name"
                class="object-cover w-full h-48 transform group-hover:scale-110 transition-transform duration-300"
              >
              <div class="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
                <span class="text-4xl mb-2">{{ cuisine.emoji }}</span>
                <h3 class="text-lg font-semibold text-center">{{ cuisine.name }}</h3>
                <p class="text-sm text-gray-300 mt-1">{{ cuisine.recipeCount }} recipes</p>
                <div class="mt-4 transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button class="px-4 py-2 bg-emerald-500 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                    View All
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class CuisineCategoriesComponent {
  cuisines = [
    {
      id: 1,
      name: 'Italian',
      emoji: '🍝',
      recipeCount: 248,
      image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Japanese',
      emoji: '🍱',
      recipeCount: 186,
      image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Mexican',
      emoji: '🌮',
      recipeCount: 157,
      image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      name: 'Indian',
      emoji: '🍛',
      recipeCount: 201,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];
}