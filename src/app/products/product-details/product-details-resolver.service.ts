import { Injectable, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { map, mergeAll, mergeMap } from 'rxjs/operators';
import { DataService } from '../../shared/data.service';
import { Product } from '../../shared/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsResolverService implements Resolve<Product>, OnInit {
  productId;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // const productId = +route.params['id'];

    this.route.params.subscribe((param) => {
      this.productId = +param['id'];
    });
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const productId = +route.params['id'];

    return this.dataService.getSingleProduct(productId).pipe(
      mergeMap((product) => {
        const productCategory = product.category || 'default-category';

        return forkJoin({
          product: of(product),
          categoryProducts:
            this.dataService.getProductsOfCategory(productCategory),
        });
      }),
      map((result) => ({
        product: result.product,
        categoryProducts: result.categoryProducts,
      }))
    );
  }
}
