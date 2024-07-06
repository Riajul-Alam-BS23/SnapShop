import { Component, Input, OnInit, inject } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.css'], // Corrected the typo here
})
export class ProductCarouselComponent implements OnInit {
  dataService = inject(DataService);

  // Correct type annotation and initialization
  @Input() numberOfSlides: any[] = [];

  @Input() Category: string;

  ngOnInit(): void {
    if (this.numberOfSlides.length > 0) {
      this.numberOfSlides = this.chunkArray(this.numberOfSlides, 4);

      this.numberOfSlides.forEach((slide) => {
        slide.forEach((product) => {
          product.discount = this.getRandomDiscount();
        });
      });
    }
  }

  chunkArray(array: any[], size: number): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  getRandomDiscount(): number {
    return 10; // Random discount between 5 and 25
  }
}
