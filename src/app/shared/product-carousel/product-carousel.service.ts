import { Injectable, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root',
})
export class ProductCarouselService implements OnInit {
  NumberOfSlide;
  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    {
      this.dataService.getLimitedProducts(15).subscribe((res) => {
        this.NumberOfSlide = res;
      });
    }
  }

  getProducts() {
    return this.NumberOfSlide;
  }
}
