import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-900 py-12 mt-auto">
      <div class="container px-4 mx-auto">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
          <div 
      class="font-extrabold tracking-tight cursor-pointer text-xl"
    >
      <span class="text-emerald-500">Recipe</span>
      <span class="text-white">State</span>
      <span class="ml-1 text-emerald-400 animate-pulse">•</span>
    </div>
            <p class="text-gray-400 text-sm">
              Making meal planning simple and enjoyable.
            </p>
          </div>
          
          <div class="space-y-4">
            <h4 class="text-white font-semibold">Quick Links</h4>
            <nav class="flex flex-col space-y-2">
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">About Us</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Contact</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Blog</a>
            </nav>
          </div>
          
          <div class="space-y-4">
            <h4 class="text-white font-semibold">Legal</h4>
            <nav class="flex flex-col space-y-2">
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a>
            </nav>
          </div>
        </div>
        
        <div class="mt-12 pt-8 border-t border-gray-800">
          <div class="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p class="text-gray-400 text-sm">
              © 2024 HCI Enterprises Limited. All rights reserved.
            </p>
            <p class="text-gray-500 text-sm">
              Built with ❤️ using Angular & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}