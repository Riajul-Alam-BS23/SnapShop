import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { DataService } from '../shared/data.service';

@Injectable({
  providedIn: 'root',
})
export class HomeResolverService implements Resolve<any> {
  constructor(private dataService: DataService) {}

  resolve(): Observable<any> {
    return forkJoin({
      categories: this.dataService.getAllCategories(),
      limitedProducts: this.dataService.getLimitedProducts(15),
      limitedProductsWithDiscount:
        this.dataService.getLimitedProductsAddingDiscount(15),
    });
  }
}
