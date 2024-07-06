import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private readonly LOGIN_URL = 'https://fakestoreapi.com/auth/login';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('loggedInUser');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.userService.LoggedUser = parsedUser;
      this.userService.loginChanged.next(parsedUser.id);
      this.loggedIn.next(true);
    } else {
      this.userService.LoggedUser = null;
      this.loggedIn.next(false);
    }
  }

  loggedIn = new BehaviorSubject(false);

  ngOnInit() {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.LOGIN_URL, { username, password });
  }

  logout() {
    this.userService.LoggedUserId = -1;
    localStorage.removeItem('loggedInUser');
    this.loggedIn.next(false);
    this.router.navigate['/home'];
  }
}
