import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser: User | null = null;
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private readonly router: Router) {
    this.autoLogin(); 
  }

    private getUsers(): User[] {
        try{
            const usersString = localStorage.getItem('users');
            return usersString ? JSON.parse(usersString) : [];
        } catch(error){
             console.error('Error getting the users', error);
           return [];
        }
   }

    private saveUsers(users: User[]): void{
         localStorage.setItem('users', JSON.stringify(users));
    }


  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getCurrentUserSubject(): BehaviorSubject<User | null> {
    return this.currentUserSubject;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getUserId(): string | undefined {
    return this.currentUser?.id;
  }

  registerUser(user: User): Observable<{ success: boolean; message: string }> {
    const users = this.getUsers();
    const existingUser = users.find((u) => u.email === user.email);
    if (existingUser) {
      return of({ success: false, message: 'User already exists!' });
    }
    const newUser = { ...user, id: this.generateId() };
    this.saveUsers([...users, newUser]);
    return of({ success: true, message: 'Registration successful!' });
  }

  loginUser(
    email: string,
    password: string
  ): Observable<{ success: boolean; message: string }> {
    const users = this.getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      this.currentUser = user;
      this.currentUserSubject.next(user);
      this.isAuthenticated.next(true);
      localStorage.setItem('user', JSON.stringify(user));
      return of({ success: true, message: 'Login successful!' });
    }
    return of({ success: false, message: 'Invalid email or password!' });
  }

  logoutUser() {
    this.currentUser = null;
    this.currentUserSubject.next(null);
    this.isAuthenticated.next(false);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  private autoLogin() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.currentUserSubject.next(this.currentUser);
      this.isAuthenticated.next(true);
    }
  }

  private generateId(): string {
    return crypto.randomUUID();
  }
}