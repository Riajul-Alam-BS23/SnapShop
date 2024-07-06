import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from './checkout.service';
import { Key, CartProduct } from '../cart/cart.model';
import { PaymentMethod } from './payment.model';
import { CartService } from '../cart/cart.service';
import { Router } from '@angular/router';
import { UserService } from '../../authentication/login/user.service';
import { ProfileService } from '../../profile/profile.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  userId: number;
  shippingKey: Key;
  checkoutForm: FormGroup;
  checkoutItems: CartProduct[] = [];
  paymentMethod: PaymentMethod[] = [
    {
      logo: 'https://www.freepnglogos.com/uploads/verified-by-visa-logo-png-0.png',
      name: 'VISA',
    },
    {
      logo: 'https://www.freepnglogos.com/uploads/mastercard-png/mastercard-logo-transparent-png-stickpng-10.png',
      name: 'Mastercard',
    },
    {
      logo: 'https://1000logos.net/wp-content/uploads/2021/02/Bkash-logo.png',
      name: 'Bkash',
    },
    {
      logo: 'https://www.freepnglogos.com/uploads/paypal-logo-png-29.png',
      name: 'PayPal',
    },
  ];
  totalAmount = 0;
  discount: number = 0;
  subtotalAmount: number = 0;
  invalidCouponError: boolean = false;
  usedCouponError: boolean = false;
  invalidTotalError: boolean = false;
  couponCode: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private userData: UserService,
    private router: Router,
    private profileService: ProfileService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // if (this.userData.LoggedUserId !== -1) {
    //   this.userId = this.userData.LoggedUserId;
    // }
    this.userData.loginChanged.subscribe((res) => {
      this.userId = res;
    });
    this.getCheckoutItems();
    this.checkoutForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      companyName: [''],
      streetAddress: ['', Validators.required],
      apartment: [''],
      townCity: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      saveInfo: [false],
    });
    this.shippingKey = this.cartService.setKey('shippingDetails', this.userId);
    this.loadSavedData();
  }

  getCheckoutItems() {
    // this.checkoutItems = this.checkoutService.getCheckout();
    // this.discount = this.checkoutService.discount;
    // this.totalAmount = parseFloat(this.checkoutService.totalAmount.toFixed(2));
    // this.subtotalAmount = this.calculateSubTotal();
    this.cartService.checkoutItemChange.subscribe((res) => {
      if (res) {
        console.log(res);
        this.checkoutItems = res.cart;
        this.totalAmount = parseFloat(res.total.toFixed(2));
        this.discount = res.discount;
      }
    });
  }

  calculateSubTotal() {
    let total = 0;
    for (let item of this.checkoutItems) {
      total += item.price * item.quantity;
    }
    total = parseFloat(total.toFixed(2));
    return total;
  }

  onSaveShippingDetails() {
    // handle saving shipping details
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      const formData = this.checkoutForm.value;
      if (formData.saveInfo) {
        localStorage.setItem(
          JSON.stringify(this.shippingKey),
          JSON.stringify(formData)
        );
      }
    }
  }

  loadSavedData() {
    const savedData = localStorage.getItem(JSON.stringify(this.shippingKey));
    if (savedData) {
      this.checkoutForm.patchValue(JSON.parse(savedData));
    }
  }

  onApplyCoupon() {
    const {
      subtotalAmount,
      totalAmount,
      discount,
      invalidCouponError,
      usedCouponError,
      invalidTotalError,
    } = this.cartService.onApplyCoupon(
      this.subtotalAmount,
      this.totalAmount,
      this.discount,
      this.couponCode
    );

    this.subtotalAmount = subtotalAmount;
    this.totalAmount = totalAmount;
    this.discount = discount;
    this.invalidCouponError = invalidCouponError;
    this.usedCouponError = usedCouponError;
    this.invalidTotalError = invalidTotalError;
  }

  onPlaceOrder() {
    if (this.checkoutItems.length > 0) {
      this.onSubmit();
      this.profileService.addOrderInformation(this.checkoutItems);
      // console.log(this.userId);
      let key: Key = this.cartService.setKey('cart', this.userId);
      for (let cart of this.checkoutItems) {
        this.cartService.deleteCartItem(cart.productId, key);
        // localStorage.removeItem(JSON.stringify(key));
      }
      this.checkoutService.orderPlaced.next(true);

      // alert('Order Successful');
      this.toastService.showToast(
        'success',
        'Successful',
        'Successfully Placed order'
      );
      this.router.navigate(['']);
    }
  }
}
