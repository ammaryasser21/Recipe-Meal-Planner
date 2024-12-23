import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { RecipeService } from '../shared/recipe.service';
import { Recipe, Comment, Rating } from '../models/recipe.model';
import { AuthService } from '../shared/auth.service';
import { Observable, of, switchMap, tap, Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../shared/user.service';
import { User } from '../models/user.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent, FooterComponent],
})
export class DetailsComponent implements OnInit, OnDestroy {
  recipe$: Observable<Recipe | undefined> | undefined;
  commentForm!: FormGroup;
  isFollowing = false;
followedUsers: { [userId: string]: string[] } = {};
  currentUser: User | null = null;
  // Add these properties to the class
timeSlots = [
  { label: 'Breakfast', value: 'Breakfast' },
  { label: 'Lunch', value: 'Lunch' },
  { label: 'Dinner', value: 'Dinner' },
];
showMealPlanDropdown = false;

// Add this method to the class
  private userSubscription: Subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly recipeService: RecipeService,
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService
      .getCurrentUserSubject()
      .subscribe((user) => {
        this.currentUser = user;
      });
    this.recipe$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        console.log(id);
        if (id) {
          return this.recipeService.getRecipeById(id).pipe(
            tap((recipe) => {
              if (recipe?.userId) {
                this.userService
                  .getFollowedUsers(this.currentUser?.id)
                  .subscribe((followedUsers) => {
                    this.followedUsers = followedUsers;
                      this.isFollowing = !!(
                        this.currentUser?.id && followedUsers[this.currentUser.id]?.includes(recipe.userId)
                     )
                  });
              }
            })
          );
        }
        return of(undefined);
      })
    );
    this.createCommentForm();
  }

  toggleMealPlanDropdown(): void {
    this.showMealPlanDropdown = !this.showMealPlanDropdown;
  }
  
  // Add click outside directive to close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.meal-plan-dropdown')) {
      this.showMealPlanDropdown = false;
    }
  }
  createCommentForm() {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required]],
    });
  }

  goBack(): void {
    this.location.back();
  }

  stars = Array(5).fill(0);
  currentRating = 0;
  hoveredRating = 0;
  flag = false;
  starOnHover(index: number): void {
    this.flag = false;
    this.hoveredRating = index + 1;
  }

  starOnLeave(): void {
    this.hoveredRating = 0;
  }

  starOnClick(index: number, recipe: Recipe): void {
    this.flag = true;
    this.currentRating = index + 1;
    this.addRating(recipe, this.currentRating);
  }

  isToggled = false;

  toggleHeart(): void {
    this.isToggled = !this.isToggled;
  }

  formatDate(input: string): string {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  addToMealPlan(recipeId: string, timeSlot: string): void {
    if (!this?.currentUser?.id) {
      console.error('Please log in to add to meal plan.');
      return;
    }
    this.recipeService
      .addToMealPlan(recipeId, this.currentUser.id, timeSlot)
      .pipe(
        switchMap(() => {
            const userId = this.authService.getUserId() ?? 'user_1';
            const storedMealPlan = localStorage.getItem(`mealPlan_${userId}`);
            if(storedMealPlan){
                return of(JSON.parse(storedMealPlan))
            }
            return of(null)
        })
    )
      .subscribe({
        next: (mealPlan) => {
            if(mealPlan){
            console.log("meal plan updated");
               const mealPlanItems =  mealPlan.items;
                const existingItemIndex = mealPlanItems.findIndex((item: { recipeId: string; }) => item.recipeId === recipeId);

                if (existingItemIndex > -1) {
                 mealPlanItems[existingItemIndex].timeSlot = timeSlot;
                } else {
                   mealPlanItems.push({recipeId:recipeId, timeSlot:timeSlot})
                }
              localStorage.setItem(`mealPlan_${this.currentUser?.id}`,JSON.stringify(mealPlan));
           }

        },
        error: (error) => {
          console.error('Error adding to meal plan:', error);
        },
      });
  }

  sendToShoppingList(recipe: Recipe): void {
    if (this?.currentUser?.id) {
    this.recipeService.addToShoppingList(recipe,this?.currentUser?.id)
        .subscribe({
            error: (error) =>{
             console.error('Error when adding to shopping list', error);
            }
        })
        console.error('Added to shopping list!');
    this.router.navigate(['/shopping-list']);
  }else{
      console.error('Please log in to add to the shopping list');
  }
  }

  addRating(recipe: Recipe, ratingValue: number) {
    if (ratingValue >= 1 && ratingValue <= 5) {
      const newRating: Rating = {
        userId: this.authService.getUserId() ?? '',
        rating: ratingValue,
      };
      recipe.ratings = [...(recipe.ratings || []), newRating];
      if (recipe.ratings.length > 0) {
        const totalRatings = recipe.ratings.reduce(
          (sum, rating) => sum + rating.rating,
          0
        );
        recipe.rating = totalRatings / recipe.ratings.length;
      }
      this.recipeService
        .updateRecipe(recipe)
        .pipe(tap(() => console.log('Rating added successfully')))
        .subscribe();
    } else {
      console.error('Invalid rating value. Rating must be between 1 and 5.');
    }
  }

  addComment(recipe: Recipe) {
    if (this.commentForm.valid && this.authService.getUserId()) {
      const newComment: Comment = {
        id: this.generateId(),
        userId: this.authService.getUserId() ?? '',
        username: this.authService.getCurrentUser()?.name ?? '',
        text: this.commentForm.get('text')?.value,
        timestamp: new Date(),
      };
      recipe.comments = [...(recipe.comments || []), newComment];
      this.recipeService
        .updateRecipe(recipe)
        .pipe(tap(() => this.commentForm.reset()))
        .subscribe({
          error: (error) => {
            console.error('Failed to add comment:', error);
          },
        });
    } else {
      console.error('You need to be logged in to add comments');
    }
  }

  generateId(): string {
    return crypto.randomUUID();
  }
toggleFollow(recipe: Recipe) {
     if (!this?.currentUser?.id) {
        console.error('Please log in to follow users.');
         return;
      }
    const targetUserId = recipe.userId || '';
       if (targetUserId) {
          if (this.isFollowing) {
            this.userService
               .unfollowUser(targetUserId, this.currentUser.id)
              .subscribe(() => {
               this.isFollowing = false;
                    this.userService
                         .getFollowedUsers(this.currentUser?.id)
                        .subscribe((followedUsers) => {
                          this.followedUsers = followedUsers;
                         })
             console.warn('Unfollowed user');
            });
        } else {
        this.userService
          .followUser(targetUserId, this.currentUser.id)
           .subscribe(() => {
              this.isFollowing = true;
                   this.userService
                        .getFollowedUsers(this.currentUser?.id)
                       .subscribe((followedUsers) => {
                         this.followedUsers = followedUsers;
                       })
              console.warn('Followed user');
          });
        }
   }
}
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}