import { Injectable, OnInit } from '@angular/core';
import { CartProduct, Key } from '../shopping/cart/cart.model';
import { UserService } from '../authentication/login/user.service';
import { DataService } from '../shared/data.service';
import { CheckoutService } from '../shopping/checkout/checkout.service';
import { Product } from '../shared/product.model';

export interface Order {
  orderId: string;
  orderDate: string;
  orderStatus?: string;
  products?: CartProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  orderInfoKey: Key;

  currentLoggedInUserId: number = -1;
  currentInfo: Key;
  newOrder: Order;

  orderPlaced: boolean = false;

  constructor(
    private checkoutService: CheckoutService,
    private userService: UserService,
    private dataService: DataService
  ) {}

  saveDataInLocalStorage(key: Key, data: Order[]) {
    localStorage.setItem(JSON.stringify(key), JSON.stringify(data));
  }
  generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomStr}`;
  }
  addOrderInformation(cart: CartProduct[]) {
    this.userService.loginChanged.subscribe((res) => {
      this.currentLoggedInUserId = res;
      const orderId1 = this.generateOrderId();
      const orderDate1 = new Date().toDateString();
      this.currentInfo = { name: 'orderInfo', id: this.currentLoggedInUserId };
      const newOrder: Order = {
        orderId: orderId1,
        orderDate: orderDate1,
        orderStatus: 'Completed',
        products: cart,
      };
      const previousOrder = this.getOrderInformation(this.currentInfo);
      let orderInformationList: Order[] = previousOrder ? previousOrder : [];
      console.log(orderInformationList, newOrder);
      orderInformationList.push(newOrder);
      this.saveDataInLocalStorage(this.currentInfo, orderInformationList);
      console.log(orderInformationList, newOrder);
      this.checkoutService.orderPlaced.next(false);
    });
  }
  getOrderInformation(key: Key) {
    let orderInformationList: Order[] = [];
    const value = localStorage.getItem(JSON.stringify(key));
    orderInformationList = JSON.parse(value);
    return orderInformationList;
  }
}
