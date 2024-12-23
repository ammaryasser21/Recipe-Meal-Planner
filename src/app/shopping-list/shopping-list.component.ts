import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../shared/recipe.service';
import { AuthService } from '../shared/auth.service';
import { Recipe } from '../models/recipe.model';
import { User } from '../models/user.model';
import { ShoppingList } from '../models/shopping-list.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../footer/footer.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  standalone: true,
  imports: [MatCardModule, CommonModule, NavbarComponent, FooterComponent],
})
export class ShoppingListComponent implements OnInit {
  currentUser: User | null = null;
    private userSubscription: Subscription = new Subscription();
  

  shoppingList: any[] = [
    
  ];
  totalPrice: number = 0;

  constructor(
    private readonly recipeService: RecipeService,
    private readonly authService: AuthService
  ) {}

  

  updatedShoppingList: any[] = [];

  ngOnInit(): void {
    this.userSubscription = this.authService
    .getCurrentUserSubject()
    .subscribe((user) => {
        this.currentUser = user;
        if (this.currentUser?.id) {
          this.shoppingList = JSON.parse(
            localStorage.getItem(`shoppingList_${this.currentUser?.id}`) ?? '[]'
          );
          this.recipeService.shoppingList$.subscribe((list) => {
            this.updatedShoppingList = [...list];
            console.log(this.updatedShoppingList);
          });
          console.log(this.updatedShoppingList);
          this.saveShoppingList(this.updatedShoppingList);
          this.calculateTotalPrice(); }
    });

  }

  saveShoppingList(updatedShoppingList: any[]) {
    if (updatedShoppingList) {
      localStorage.setItem(
        `shoppingList_${this.currentUser?.id}`,
        JSON.stringify(updatedShoppingList)
      );
    }
  }

  deleteRecipe(recipeId: string): void {
    this.updatedShoppingList = this.updatedShoppingList.filter(
      (recipe) => recipe.id !== recipeId
    );

    this.saveShoppingList(this.updatedShoppingList);

    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.updatedShoppingList.reduce(
      (total, recipe) =>
        total +
        recipe.ingredients.reduce(
          (sum: number, ing: any) => sum + ing.amount,
          0
        ),
      0
    );
  }
}
