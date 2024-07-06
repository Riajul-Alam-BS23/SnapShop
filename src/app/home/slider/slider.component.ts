import { AfterViewInit, Component } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent implements AfterViewInit {
  ngAfterViewInit() {
    const myCarousel = document.querySelector(
      '#carouselExampleIndicators'
    ) as HTMLElement;
    const carousel = new bootstrap.Carousel(myCarousel, {
      interval: 3000,
      ride: 'carousel',
    });
  }
}
