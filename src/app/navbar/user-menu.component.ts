import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button
        (click)="toggleMenu()"
        class="flex items-center gap-2 px-4 py-2 text-white rounded-full hover:bg-gray-700 transition-colors duration-200"
      >
        <span class="font-medium">{{ user.name }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 transition-transform duration-200"
          [class.rotate-180]="isOpen"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
        </svg>
      </button>

      @if (isOpen) {
        <div class="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div class="py-1">
            @for (item of menuItems; track item.label) {
              <button
                (click)="handleMenuClick(item.action)"
                class="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <span class="w-5 h-5" [innerHTML]="item.icon"></span>
                {{ item.label }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class UserMenuComponent {
  @Input() user!: User;
  isOpen = false;

  menuItems = [
    {
      label: 'Profile',
      action: () => this.router.navigate(['/user-profile']),
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>'
    },
    {
      label: 'Meal Planning',
      action: () => this.router.navigate(['/meal-planning']),
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>'
    },
    {
      label: 'Shopping List',
      action: () => this.router.navigate(['/shopping-list']),
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>'
    },
    {
      label: 'Logout',
      action: () => this.authService.logoutUser(),
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>'
    }
  ];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  handleMenuClick(action: () => void) {
    this.isOpen = false;
    action();
  }
}