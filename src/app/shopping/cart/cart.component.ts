import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Cart, Key, CartProduct } from './cart.model';
import { CheckoutService } from '../checkout/checkout.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from '../../authentication/login/user.service';
import { ToastService } from '../../shared/toast.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  
  cartItems: CartProduct[];
  deleteClicked: boolean = false;
  deleteCartId: number = null;
  hasData = false;
  isAuthenticate = true;
  userId: number;
  shippingCharge: number = 24.99;
  cartChangesSubscription: Subscription;
  key: Key;

  coupon: string = '';
  usedCouponError: boolean = false;
  invalidCouponError: boolean = false;
  invalidTotalError: boolean = false;

  totalAmount: number = 0;
  subtotalAmount: number = 0;
  discount: number = 0;

  totalChange = new BehaviorSubject<number>(0);
  subtotalChange = new BehaviorSubject<number>(0);
  // cartChange = new BehaviorSubject<{ cart: CartProduct[], total: number, discount: number }>({ cart: [], total: this.totalAmount, discount: this.discount });

  constructor(
    private cartService: CartService,
    private checkout: CheckoutService,
    private router: Router,
    private userData: UserService,
    private toastService:ToastService
  ) {}

  ngOnInit(): void {
    this.cartService.inCart=true;
    this.userData.loginChanged.subscribe((res) => {
      this.userId = res;
      this.key = this.cartService.setKey('cart', this.userId);
      this.hasData = this.cartService.isDataInLocalStorage(this.key);
      this.cartService.saveDataInCart(this.key);
    });
    this.cartChangesSubscription = this.cartService.changeOnCart.subscribe({
      next: (res) => {
        this.cartItems = this.cartService.getCartItems(res);
        this.calculateSubtotal();
        if(this.cartItems.length!==0)
        this.cartService.inCart=true;
      },
    });
    this.subtotalChange.subscribe((res) => {
      this.subtotalAmount = res;
      this.calculateTotal();
      this.totalChange.subscribe((res) => {
        this.totalAmount = res;
        this.cartService.checkoutItemChange.next({ cart: this.cartItems, total: this.totalAmount, discount: this.discount });
        // this.cartChange.next({ cart: this.cartItems, total: this.totalAmount, discount: this.discount })
      });
    });
  }

  calculateSubtotal() {
    let subTotal = 0;
    this.cartItems.forEach((item) => {
      {
        subTotal += item.price * item.quantity;
      }
    });
    subTotal >= 300 ? (this.shippingCharge = 0) : (this.shippingCharge = 24.99);
    subTotal = parseFloat(subTotal.toFixed(2));
    this.subtotalChange.next(subTotal);
  }

  calculateTotal() {
    let subTotal = this.subtotalAmount;
    subTotal = subTotal + (subTotal ? this.shippingCharge : 0);
    subTotal = parseFloat(subTotal.toFixed(2));
    this.totalChange.next(subTotal);
  }

  calculateSingleProductTotal(price:number,quantity:number) {
    let total = price * quantity;
    total = parseFloat(total.toFixed(2));
    return total;
  }

  onCheckDeleteCart(productId: number) {
    this.deleteClicked = true;
    this.deleteCartId = productId;
  }

  onDeleteCart(productId: number) {
    this.cartItems = this.cartItems.filter(
      (item) => item.productId !== productId
    );
    this.cartService.deleteCartItem(productId, this.key);
  }

  ConfirmationClicked(status: string) {
    if (status === 'close') {
      this.deleteClicked = false;
    } else {
      if (this.deleteCartId) this.onDeleteCart(this.deleteCartId);
      this.deleteClicked = false;
      this.deleteCartId = null;
    }
  }
  updateCart() {}
  onCheckout() {
    if (this.cartItems.length !== 0) {
      this.checkout.setCheckoutCart(
        this.cartItems,
        this.totalAmount,
        this.discount
      );
      this.router.navigate(['/checkout']);
    } else {
      this.toastService.showToast('warn','Warning!','Add Some items for checkout')
      // this.toast.add({severity:'warn',summary:'Warning!',detail:'Add Some items for checkout'})
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
      this.coupon
    );

    this.subtotalAmount = subtotalAmount;
    this.totalAmount = totalAmount;
    this.discount = discount;
    this.invalidCouponError = invalidCouponError;
    this.usedCouponError = usedCouponError;
    this.invalidTotalError = invalidTotalError;
    this.totalChange.next(this.totalAmount);
  }
  ngOnDestroy(): void {
    this.cartChangesSubscription.unsubscribe();
  }
}
