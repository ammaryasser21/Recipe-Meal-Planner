import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class NavbarComponent {
  currentUser: User | null = null;
  showOptions = false;

  constructor(
    private readonly authService: AuthService,
    public router: Router
  ) {
    this.authService.getCurrentUserSubject().subscribe((user) => {
      this.currentUser = user;
    });
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
  logout(): void {
    this.authService.logoutUser();
  }
  navigateToProfile() {
    this.router.navigate(['/user-profile']);
  }
  navigateToShoppingList() {
    this.router.navigate(['/shopping-list']);
  }

  navigateToMealPlanning() {
    this.router.navigate(['/meal-planning']);
  }
}
