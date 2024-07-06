import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { DataService } from '../../shared/data.service';
import { UserService } from './user.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isFormSubmitted: boolean = false;
  passwordFieldType: string = 'password';

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });

    this.setData();
  }

  setData() {
    this.dataService.getAllUser().subscribe((users: any) => {
      this.userService.Users.next(users);
    });
  }

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      let authObs: Observable<any>;
      authObs = this.authService.login(username, password);

      authObs.subscribe(
        (resData) => {
          const token = resData.token;
          this.userService.setLoggedInUserId(username);
          const userData = this.userService.getLoggedInUser();
          console.log(userData);
          localStorage.setItem('loggedInUser', JSON.stringify(userData));
          this.authService.loggedIn.next(true);
          this.router.navigate(['/home']);
        },
        (error) => {
          // alert('Invalid username or password');
          this.toastService.showToast(
            'error',
            'Wrong Credential',
            'Invalid username or password'
          );
        }
      );
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
