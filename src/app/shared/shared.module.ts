import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { CapitalizeFirstPipe } from './pipe/capitalize-first.pipe';
import { SplicePipe } from './pipe/splice.pipe';
import { ProductCarouselComponent } from './product-carousel/product-carousel.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ToastModule } from 'primeng/toast';



@NgModule({
  declarations: [
    CardComponent,
    LoadingSpinnerComponent,
    CapitalizeFirstPipe,
    SplicePipe,
    ProductCarouselComponent,
    ProductListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ToastModule
  ],
  exports:[CardComponent,
    LoadingSpinnerComponent,
    CapitalizeFirstPipe,
    SplicePipe,
    ProductCarouselComponent,
    ProductListComponent,]
})
export class SharedModule { }
