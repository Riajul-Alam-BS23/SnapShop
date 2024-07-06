import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { Product } from '../../shared/product.model';
import { CartService } from '../../shopping/cart/cart.service';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { UserService } from '../../authentication/login/user.service';
import { ViewportScroller } from '@angular/common';
import { CartProduct } from '../../shopping/cart/cart.model';
import { CheckoutService } from '../../shopping/checkout/checkout.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  dataService: DataService = inject(DataService);
  isLoading: boolean = true;
  starLoad: boolean = false;
  inPage: boolean = false;
  selectedProductDetails: Product;
  RelatedProducts: Product[] = [];
  ratingArray: string[] = [];
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL'];
  breadcrumbPath: string = '';

  products: Product[];
  selectedSize: string = 'M';
  amount: number = 1;
  userId: number = -1;

  deliveryOptions: { name: string; iconClass: string }[] = [
    { name: 'Free Delivery', iconClass: 'bi bi-truck' },
    { name: 'Return Delivery', iconClass: 'bi bi-arrow-return-left' },
  ];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private userService: UserService,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private checkout: CheckoutService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });

    this.userService.loginChanged.subscribe((res) => {
      this.userId = res;
    });

    this.RelatedProducts =
      this.route.snapshot.data['productData'].categoryProducts;
    this.inPage = false;
    this.route.data.subscribe((res: any) => {
      this.selectedProductDetails = res['productData'].product;
      this.isLoading = false;
    });

    setTimeout(
      () => {
        if (
          this.selectedProductDetails &&
          this.selectedProductDetails.rating &&
          this.selectedProductDetails.rating.rate
        ) {
          this.setRatingArray(this.selectedProductDetails.rating.rate);
          this.starLoad = true;
        }
      },

      50
    );
  }

  increment() {
    this.amount++;
  }

  decrement() {
    if (this.amount > 0) {
      this.amount--;
    }
  }

  setRatingArray(rating: number) {
    this.ratingArray = [];

    for (let i = 0; i < Math.floor(rating); i++) {
      this.ratingArray.push('full');
    }

    if (rating % 1 !== 0) {
      this.ratingArray.push('half');
    }

    while (this.ratingArray.length < 5) {
      this.ratingArray.push('empty');
    }
  }

  onClickCart() {
    if (this.userId !== -1) {
      let key = this.cartService.setKey('cart', this.userId);
      this.cartService.saveDataInCart(key);
      this.cartService.onCreateCart(this.selectedProductDetails, key);
    } else {
      this.router.navigate(['/login']);
    }
  }
  onBuyItem() {
    if (this.userId !== -1) {
      let cart: CartProduct = {
        productId: this.selectedProductDetails.id,
        quantity: this.amount,
        image: this.selectedProductDetails.image,
        price: this.selectedProductDetails.price,
        name: this.selectedProductDetails.title,
        saveForCheckout: true,
      };
      this.checkout.setCheckoutCart(
        new Array(cart),
        this.amount * cart.price,
        0
      );
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
