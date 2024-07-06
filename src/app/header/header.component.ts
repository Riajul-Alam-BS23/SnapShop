import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CartService } from '../shopping/cart/cart.service';
import { Key } from '../shopping/cart/cart.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/login/auth.service';
import { UserService } from '../authentication/login/user.service';
import { HeaderService } from './header.service';
import { Product } from '../shared/product.model';
import { Category } from './category.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isCollapsed: boolean = true;
  isLoggedIn = false;
  items: Product[] = [];
  categoryies;
  filteredItems: Product[] = [];
  searchText: string = '';
  isSearchExpanded: boolean = false;
  lastTimeFilterItems: Product[] = [];
  headerText = [
    { name: 'Home' },
    { name: 'Contact' },
    { name: 'About' },
    { name: 'Products' },
  ];
  currentCartItem: number;
  userId: number;
  key: Key;
  cartUpdateSubscription: Subscription;
  clickSearch: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private userService: UserService,
    private headerService: HeaderService,
    private http: HttpClient,
    private eRef: ElementRef
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.clearSearch();
      }
    });
  }

  ngOnInit(): void {
    this.headerService.getItems().subscribe((data: Product[]) => {
      this.items = data;
    });

    this.headerService.getCategory().subscribe((category) => {
      this.categoryies = category;
    });

    this.authService.loggedIn.subscribe((data) => {
      this.isLoggedIn = data;
      console.log('logged user ', this.isLoggedIn);
    });
    this.userService.loginChanged.subscribe((res) => {
      this.userId = res;
      this.getCartItemNumber();
    });

    
  }
  onSearch(event: any): void {
    this.searchText = event.target.value;

    if (this.searchText.trim() === '') {
      this.clickSearch = true;
      this.filteredItems = [];
    } else {
      this.filteredItems = this.headerService.searchItems(
        this.searchText,
        this.items,
        this.categoryies
      );
      console.log(this.searchText, this.filteredItems);
    }
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isSearchExpanded && !this.eRef.nativeElement.contains(event.target)) {
      this.collapseSearch();
    }
  }
  isProduct(item) {
    return typeof item === 'object';
  }

  isCategory(item) {
    return typeof item !== 'object';
  }

  expandSearch(): void {
    this.isSearchExpanded = true;
    if (this.searchText.length > 0) this.filteredItems = this.lastTimeFilterItems;
    else this.filteredItems= [];
  }

  collapseSearch(): void {
    this.isSearchExpanded = false;
    this.lastTimeFilterItems = this.filteredItems;
    setTimeout(() => {
      this.filteredItems = [];
    }, 90);
    
  }
  onClickSearch() {
    this.clickSearch = false;
    this.router.navigate(['/home']);
  }
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.clickSearch) {
        this.onClickSearch();
      }
    }
  }
  clearSearch(): void {
    this.searchText = '';
    this.filteredItems = [];
  }

  onBlur(): void {
    this.isSearchExpanded = false;
    this.clearSearch();
  }

  handleOutsideClick() {
    if (this.isSearchExpanded) {
      this.collapseSearch();
    }
  }


  getCartItemNumber() {
    this.key = this.cartService.setKey('cart', this.userId);
    this.cartService.getCartItemNumber(this.key).subscribe({
      next: (res) => {
        this.currentCartItem = this.cartService.getCartItems(res).length;
      },
    });
  }

  onClick(id: number) {
    let path = this.headerText[id].name;

    if (path === 'Products') {
      path = 'product-list';
    }

    this.router.navigate(['/' + path.toLocaleLowerCase()]);
  }

  homeClick() {
    this.router.navigate(['/home']);
  }

  addToCart() {
    this.authService.loggedIn.subscribe((user) => {
      if (user) {
        this.router.navigate(['/cart']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logIn() {
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    this.authService.loggedIn.next(false);
    this.userService.LoggedUser = null;
    this.userService.LoggedUserId = -1;
    this.userService.loginChanged.next(-1);
    this.cartService.availableCoupon.forEach((item) => {
      item.used = false;
    });
    this.router.navigate(['/home']);
  }
  toggleNavMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnDestroy(): void {
    if (this.cartUpdateSubscription) {
      this.cartUpdateSubscription.unsubscribe();
    }
  }

  
}
