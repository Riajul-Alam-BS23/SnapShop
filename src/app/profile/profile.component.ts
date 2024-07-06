import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/login/auth.service';
import { UserService } from '../authentication/login/user.service';
import { Order, ProfileService } from './profile.service';
import { Key } from '../shopping/cart/cart.model';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  activeTab: string = 'profile';
  loggedInUser;
  orderList: Order[] = [];
  profileKey: Key;
  currentActiveOrder: Order;
  profileForm: FormGroup; // Define profileForm

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private profileService: ProfileService,
    private fb: FormBuilder // Inject FormBuilder
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.userService.getLoggedInUser();
    this.profileKey = {
      name: 'orderInfo',
      id: this.loggedInUser.id,
    };

    this.orderList = this.profileService.getOrderInformation(this.profileKey);

    // Initialize profileForm with FormBuilder
    this.profileForm = this.fb.group({
      firstName: [
        this.loggedInUser.name.firstname,
        [Validators.required, this.noNumbersValidator],
      ],
      lastName: [this.loggedInUser.name.lastname, [this.noNumbersValidator]],
      email: [this.loggedInUser.email, [Validators.required, Validators.email]],
      address: ['Kingston, 5236, United States', [Validators.required]],
      currentPassword: [''],
      newPassword: [''],
      confirmNewPassword: [''],
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onSaveChanges(): void {
    if (this.profileForm.valid) {
      // Handle form save here
      this.router.navigate(['/home']);
    } else {
      // Form is invalid, do something like show error messages
    }
  }

  onClearHistory() {
    this.orderList = [];
    this.profileService.saveDataInLocalStorage(this.profileKey, this.orderList);
    this.orderList = this.profileService.getOrderInformation(this.profileKey);
  }

  showOrderDetails(order: Order): void {
    console.log(order);
    this.currentActiveOrder = order;
    const modalElement = document.getElementById('orderDetailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  noNumbersValidator(control) {
    const hasNumber = /\d/.test(control.value);
    return hasNumber ? { hasNumber: true } : null;
  }
}
