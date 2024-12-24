import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-chefs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-gray-50">
      <div class="container px-4 mx-auto">
        <div class="max-w-2xl mx-auto text-center mb-16">
          <h2 class="text-3xl font-bold mb-4 text-gray-900">Featured Chefs</h2>
          <p class="text-gray-600">Learn from the best culinary experts around the world</p>
        </div>
        
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          @for (chef of featuredChefs; track chef.id) {
            <div class="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="aspect-w-3 aspect-h-4">
                <img [src]="chef.image" [alt]="chef.name" class="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300">
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 class="text-xl font-bold mb-2">{{ chef.name }}</h3>
                  <p class="text-sm text-gray-200 mb-4">{{ chef.specialty }}</p>
                  <button class="px-4 py-2 bg-emerald-500 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                    View Profile
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
export class FeaturedChefsComponent {
  featuredChefs = [
    {
      id: 1,
      name: 'Chef Maria Rodriguez',
      specialty: 'Mediterranean Cuisine',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Chef John Smith',
      specialty: 'Asian Fusion',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Chef Sarah Chen',
      specialty: 'Plant-Based Cuisine',
      image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];
}