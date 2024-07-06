import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home.component';
import { SliderComponent } from './slider/slider.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeComponent, CategoryComponent, SliderComponent],
  imports: [CommonModule, RouterModule, FormsModule, SharedModule,HomeRoutingModule],
  exports: [HomeComponent, CategoryComponent, SliderComponent],
})
export class HomeModule {}
