import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cooking-tips',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-white">
      <div class="container px-4 mx-auto">
        <div class="max-w-2xl mx-auto text-center mb-16">
          <h2 class="text-3xl font-bold mb-4 text-gray-900">Pro Cooking Tips</h2>
          <p class="text-gray-600">Master these essential techniques to elevate your cooking</p>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          @for (tip of cookingTips; track tip.id) {
            <div class="relative group">
              <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 opacity-25 group-hover:opacity-50 blur transition duration-300"></div>
              <div class="relative p-6 bg-white rounded-2xl">
                <div class="flex items-center justify-center w-12 h-12 mb-4 text-emerald-500 bg-emerald-50 rounded-xl">
                  <span [innerHTML]="tip.icon"></span>
                </div>
                <h3 class="text-lg font-semibold mb-2 text-gray-900">{{ tip.title }}</h3>
                <p class="text-gray-600">{{ tip.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class CookingTipsComponent {
  cookingTips = [
    {
      id: 1,
      title: 'Knife Skills',
      description: 'Learn proper cutting techniques for faster, safer food preparation.',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>'
    },
    {
      id: 2,
      title: 'Temperature Control',
      description: 'Master heat levels for perfect doneness every time.',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
    },
    {
      id: 3,
      title: 'Seasoning Balance',
      description: 'Perfect the art of seasoning to enhance flavors naturally.',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/></svg>'
    }
  ];
}