import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { UserMenuComponent } from './user-menu.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, UserMenuComponent],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg backdrop-blur-lg bg-opacity-90"
    >
      <div class="container px-4 mx-auto">
        <div class="flex items-center justify-between h-16">
          <div
            class="font-extrabold tracking-tight cursor-pointer text-xl"
            (click)="router.navigate(['/home'])"
          >
            <span class="text-emerald-500">Recipe</span>
            <span class="text-white">State</span>
            <span class="ml-1 text-emerald-400 animate-pulse">•</span>
          </div>

          <ng-container
            *ngIf="currentUser$ | async as currentUser; else loginButton"
          >
            <app-user-menu [user]="currentUser" />
          </ng-container>
          <ng-template #loginButton>
            <button
              (click)="router.navigate(['/login'])"
              class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors duration-200"
            >
              Sign In
            </button>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  currentUser$;

  constructor(
    private readonly authService: AuthService,
    public router: Router
  ) {
    this.currentUser$ = this.authService.getCurrentUserSubject();
  }
}
