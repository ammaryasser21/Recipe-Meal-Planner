import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MealPlanningComponent } from './meal-planning/meal-planning.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RouterModule } from '@angular/router';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'home', component: HomeComponent },
    { path: 'details/:id', component: DetailsComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'meal-planning', component: MealPlanningComponent },
    { path: 'shopping-list', component: ShoppingListComponent },
    { path: '**', redirectTo: 'home' } 
];
