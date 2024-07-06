import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CartService } from './cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class checkoutGuard implements CanActivate {
  constructor(private router: Router, private cartService: CartService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.cartService.inCart) {
      return true;
    }
    this.router.navigate(['/cart']);
    return false;
  }
}
