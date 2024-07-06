import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../shared/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../shared/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  category;
  icon = [
    'ri-computer-line',
    'ri-vip-diamond-line',
    'ri-user-3-line',
    'ri-user-4-line',
  ];

  isLoading: boolean = true;
  sliderImages: string[] = [];
  combinedArraycategory: { category: string; icon: string }[] = [];
  numberOfSlidesRatting: Product[] = [];
  numberOfSlidesss: Product[] = [];

  private dataService: DataService = inject(DataService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  constructor() {
    const data = this.route.snapshot.data['homeData'];
    this.category = data.categories;
    this.numberOfSlidesss = data.limitedProducts;
    this.numberOfSlidesRatting = data.limitedProductsWithDiscount;
    this.combinedArraycategory = this.category.map((cat, index) => {
      return { category: cat, icon: this.icon[index] };
    });
  }

  ngOnInit() {
    this.dataService.getAllCategories().subscribe(
      (data) => {
        this.category = data;

        this.combinedArraycategory = this.category.map((cat, index) => {
          return { category: cat, icon: this.icon[index] };
        });
      },
      (error) => {
        console.error(error);
      }
    );

    this.dataService.getLimitedProducts(20).subscribe(
      (data) => {
        this.sliderImages = data.map((product) => product.image);
      },
      (error) => {
        console.error(error);
      }
    );

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  viewAllProducts() {
    this.router.navigate(['/product-list']);
  }
  navigateToProductList(category: string) {
    this.router.navigate(['/product-list'], {
      queryParams: { Category: category },
    });
  }
}
