import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CategoryComponent } from './category/category.component';
import { SliderComponent } from './slider/slider.component';
import { HomeResolverService } from './home-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { homeData: HomeResolverService },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
