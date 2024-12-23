import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 private followedUsers: { [userId: string]: string[] } = {};

  constructor() {
     this.loadFollowedUsers();
  }

    private loadFollowedUsers() {
        const storedFollowedUsers = localStorage.getItem('followedUsers');
          if (storedFollowedUsers) {
            this.followedUsers = JSON.parse(storedFollowedUsers);
          }
    }

    private saveFollowedUsers():void{
         localStorage.setItem('followedUsers', JSON.stringify(this.followedUsers));
    }


  followUser(targetUserId: string, followerUserId: string): Observable<void> {

    if (!this.followedUsers[followerUserId]) {
          this.followedUsers[followerUserId] = [];
    }

    if (!this.followedUsers[followerUserId].includes(targetUserId)) {
      this.followedUsers[followerUserId].push(targetUserId);
     this.saveFollowedUsers();
    }
    return of(undefined);
  }



  unfollowUser(targetUserId: string, followerUserId: string): Observable<void> {
     if (this.followedUsers[followerUserId]) {
         this.followedUsers[followerUserId] = this.followedUsers[followerUserId].filter(id => id !== targetUserId);
     this.saveFollowedUsers();
    }
    return of(undefined);
  }


  getFollowedUsers(userId?: string): Observable<{ [userId: string]: string[] }> {
    if (userId && this.followedUsers[userId]) {
      return of(this.followedUsers);
    }
        return of({});
  }
}