import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../shared/product.model';
import { DataService } from '../shared/data.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor(private http: HttpClient, private dataService: DataService) {}

  getItems(): Observable<Product[]> {
    return this.dataService.getAllProducts();
  }

  getCategory(): Observable<any> {
    return this.dataService.getAllCategories();
  }

  getItemById(id: string): Observable<Product> {
    return this.dataService.getSingleProduct(+id);
  }

  searchItems(query: string, items: Product[], categories: any[]): any[] {
 
    if (!query) {
      return [];
    }

    const filteredItems = items.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    const filteredCategories = categories.filter((category) =>
      category.toLowerCase().includes(query.toLowerCase())
    );

    return [...filteredItems, ...filteredCategories];
  }
}
