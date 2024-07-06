import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './../shared/product.model';
import { Cart } from '../shopping/cart/cart.model';
import { Subject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  productDetailsSort = new Subject<any>();
  Users = new Subject();

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('https://fakestoreapi.com/products').pipe(
      tap((products: Product[]) => {
        products.forEach((product) => {
          product.discount = this.getRandomDiscount();
        });
      }),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(error);
      })
    );
  }

  getLimitedProducts(limit: number): Observable<Product[]> {
    const url = `https://fakestoreapi.com/products?limit=${limit}`;
    return this.http.get<Product[]>(url).pipe(
      tap((products: Product[]) => {
        products.forEach((product) => {
          product.discount = this.getRandomDiscount();
        });
      }),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(error);
      })
    );
  }

  getSingleProduct(id: number): Observable<Product> {
    return this.http
      .get<Product>(`https://fakestoreapi.com/products/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching product:', error);
          return throwError(error);
        })
      );
  }

  getAllCategories(): Observable<string[]> {
    return this.http
      .get<string[]>(`https://fakestoreapi.com/products/categories`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching categories:', error);
          return throwError(error);
        })
      );
  }

  getProductsOfCategory(categoryName: string): Observable<Product[]> {
    return this.http
      .get<Product[]>(
        `https://fakestoreapi.com/products/category/${categoryName}`
      )
      .pipe(
        tap((products: Product[]) => {
          products.forEach((product) => {
            product.discount = this.getRandomDiscount();
          });
        }),
        catchError((error) => {
          console.error('Error fetching category products:', error);
          return throwError(error);
        })
      );
  }

  getSingleUserCart(id: number): Observable<Cart[]> {
    return this.http
      .get<Cart[]>(`https://fakestoreapi.com/carts/user/` + id)
      .pipe(
        catchError((error) => {
          console.error('Error fetching cart:', error);
          return throwError(error);
        })
      );
  }

  private sortAndEmitProducts(products: Product[]): void {
    products.sort((a, b) => b.rating.rate - a.rating.rate);
    this.productDetailsSort.next(products);
  }

  getLimitedProductsAddingDiscount(limit: number): Observable<Product[]> {
    const url = `https://fakestoreapi.com/products?limit=${limit}`;
    return this.http.get<Product[]>(url).pipe(
      tap((products: Product[]) => {
        products.forEach((product) => {
          product.discount = this.getRandomDiscount();
        });
        this.sortAndEmitProducts(products);
      }),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(error);
      })
    );
  }

  getSingleCart(id: number) {
    return this.http
      .get<Cart[]>(`https://fakestoreapi.com/carts/user/` + id.toString())
      .pipe(
        tap((cart: Cart[]) => {
          console.log(cart);
        })
      );
  }

  getRandomDiscount(): number {
    return 10;
  }

  getAllUser() {
    return this.http.get<string[]>(`https://fakestoreapi.com/users`).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return throwError(error);
      })
    );
  }

  
}
