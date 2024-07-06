import { Injectable } from '@angular/core';
import { CartProduct } from '../cart/cart.model';
import { BehaviorSubject } from 'rxjs';
import { flush } from '@angular/core/testing';
import { ProfileService } from '../../profile/profile.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  cart = {
    cartToCheckout: [],
    totalAmount: 0,
    discount: 0,
  };
  // checkoutItemChange=new BehaviorSubject<{ cart: CartProduct[], total: number,discount:number }>({cart:[],total:0,discount:0})

  orderPlaced = new BehaviorSubject<boolean>(false);

  setCheckoutCart(cart: CartProduct[], Amount: number, discount: number) {
  }
  // getcartToCheckout() {
  //   return this.cartToCheckout;
  // }
  getCheckout() {
    // return this.cartToCheckout;
  }
  onSaveShippingDetails() {}
}
