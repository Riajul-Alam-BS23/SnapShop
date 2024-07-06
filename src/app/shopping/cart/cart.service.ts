import { Injectable } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { Cart, Key, CartProduct } from './cart.model';
import { BehaviorSubject, forkJoin, tap } from 'rxjs';
import { Product } from '../../shared/product.model';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/toast.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  changeOnCart = new BehaviorSubject<Cart[]>([]);
  checkoutItemChange = new BehaviorSubject<{
    cart: CartProduct[];
    total: number;
    discount: number;
  }>({ cart: [], total: 0, discount: 0 });
  cart: Cart[] = [];
  inCart = false;
  availableCoupon: { name: string; amount: number; used: boolean }[] = [
    { name: 'save20', amount: 20, used: false },
    { name: 'save10', amount: 10, used: false },
    { name: 'save30', amount: 30, used: false },
  ];

  constructor(
    private dataService: DataService,
    private router: Router,
    private toastService: ToastService
  ) {}

  setKey(name: string, id: number) {
    let key: Key = { name, id };
    return key;
  }

  isDataInLocalStorage(Key: Key) {
    const value = localStorage.getItem(JSON.stringify(Key));
    return value !== null;
  }

  private getDataFromLocalStorage(key: Key) {
    const value = localStorage.getItem(JSON.stringify(key));
    if (value) {
      this.cart = this.removeDuplicateProducts(JSON.parse(value));
      console.log('Data retrieved from localStorage');
    }
  }

  private removeDuplicateProducts(carts: Cart[]): Cart[] {
    const uniqueProductIds = new Set<number>();

    return carts.map((cart) => {
      cart.products = cart.products.filter((product) => {
        if (uniqueProductIds.has(product.productId)) {
          return false;
        } else {
          uniqueProductIds.add(product.productId);
          return true;
        }
      });
      return cart;
    });
  }

  private getDataFromAPI(userId: number) {
    this.dataService.getSingleUserCart(userId).subscribe((res: Cart[]) => {
      this.cart = res;
      console.log('Data retrieved from API');
      const requests = [];

      for (let item of this.cart) {
        for (let product of item.products) {
          requests.push(
            this.dataService.getSingleProduct(product.productId).pipe(
              tap((productDetails: Product) => {
                product.image = productDetails.image;
                product.price = productDetails.price;
                product.name = productDetails.title;
                product.saveForCheckout = false;
                product.quantity = 1;
              })
            )
          );
        }
      }

      forkJoin(requests).subscribe(() => {
        console.log('All product details fetched');
        let key = this.setKey('cart', userId);
        this.saveDataInLocalStorage(key);
        this.getDataFromLocalStorage(key);
        this.changeOnCart.next(this.cart);
      });
    });
  }

  saveDataInCart(key: Key) {
    if (this.isDataInLocalStorage(key)) {
      this.getDataFromLocalStorage(key);
    } else {
      this.getDataFromAPI(key.id);
    }
    this.changeOnCart.next(this.cart);
  }

  saveDataInLocalStorage(key: Key) {
    if (key?.id) {
      localStorage.setItem(JSON.stringify(key), JSON.stringify(this.cart));
    }
  }

  addToCart(newCart: Cart, key: Key) {
    let foundItem = false;

    for (let item of this.cart) {
      for (let product of item.products) {
        if (product.productId === newCart.products[0].productId) {
          foundItem = true;
          break;
        }
      }
      if (foundItem) break;
    }

    if (!foundItem) {
      this.cart.push(newCart);
      this.saveDataInLocalStorage(key);
      this.changeOnCart.next(this.cart);
      console.log(this.cart);
      // alert('Successfully added to CART');
      this.toastService.showToast(
        'success',
        'Success',
        'Successfully added to CART'
      );
    } else {
      // alert('Already in Cart');
      this.toastService.showToast('warn', 'Warning!', 'Already in Cart');
    }
  }

  onCreateCart(product: Product, key: Key) {
    const newCart: Cart = {
      id: Date.now(),
      userId: key.id,
      date: new Date().toISOString(),
      products: [
        {
          productId: product.id,
          quantity: 1,
          image: product.image,
          price: product.price,
          name: product.title,
          saveForCheckout: false,
        },
      ],
    };
    this.addToCart(newCart, key);
  }

  getCartItems(cart: Cart[]): CartProduct[] {
    let cartProduct: CartProduct[] = [];
    for (let item of cart) {
      for (let product of item.products) {
        cartProduct.push(product);
      }
    }
    return cartProduct;
  }

  updateLocalCartItems(updatedCartProducts: CartProduct[], key: Key) {
    if (!this.cart) return new BehaviorSubject<Cart[]>([]);
    for (let cart of this.cart) {
      for (let i = 0; i < cart.products.length; i++) {
        let updatedProduct = updatedCartProducts.find(
          (p) => p.productId === cart.products[i].productId
        );
        if (updatedProduct) {
          cart.products.splice(i, 1, updatedProduct);
        }
      }
    }
    this.saveDataInLocalStorage(key);
    return this.changeOnCart.asObservable();
  }

  deleteCartItem(productId: number, key: Key) {
    for (let cart of this.cart) {
      cart.products = cart.products.filter(
        (product) => product.productId !== productId
      );
    }
    this.cart = this.cart.filter((cart) => cart.products.length > 0);
    this.saveDataInLocalStorage(key);
    this.changeOnCart.next(this.cart);
  }

  getCartItemNumber(key: Key) {
    this.saveDataInCart(key);
    this.getDataFromLocalStorage(key);
    return this.changeOnCart.asObservable();
  }

  onApplyCoupon(
    subtotalAmount: number,
    totalAmount: number,
    discount: number,
    coupon: string
  ): {
    subtotalAmount: number;
    totalAmount: number;
    discount: number;
    invalidCouponError: boolean;
    usedCouponError: boolean;
    invalidTotalError: boolean;
  } {
    let updatedTotalAmount = totalAmount;
    let updatedDiscount = discount;
    let invalidCouponError = false;
    let usedCouponError = false;
    let invalidTotalError = false;

    const correctCoupon = this.availableCoupon.find(
      (item) => item.name === coupon
    );

    if (correctCoupon) {
      if (!correctCoupon.used && totalAmount > 0) {
        invalidCouponError = usedCouponError = invalidTotalError = false;
        if (totalAmount > correctCoupon.amount) {
          updatedTotalAmount -= correctCoupon.amount;
          updatedDiscount += correctCoupon.amount;
          correctCoupon.used = true;
        } else {
          invalidTotalError = true;
          usedCouponError = invalidCouponError = false;
        }
      } else if (!correctCoupon.used && totalAmount <= 0) {
        invalidTotalError = true;
        usedCouponError = invalidCouponError = false;
      } else {
        usedCouponError = true;
        invalidTotalError = invalidCouponError = false;
      }
    } else {
      invalidCouponError = true;
      usedCouponError = invalidTotalError = false;
    }

    return {
      subtotalAmount,
      totalAmount: parseFloat(updatedTotalAmount.toFixed(2)),
      discount: updatedDiscount,
      invalidCouponError,
      usedCouponError,
      invalidTotalError,
    };
  }
}
