import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from '../shared/product-list/product-list.component';
import { ProductDetailsResolverService } from './product-details/product-details-resolver.service';

const routes: Routes = [
  { path: 'product-list', component: ProductListComponent },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent,
    resolve: { productData: ProductDetailsResolverService },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
