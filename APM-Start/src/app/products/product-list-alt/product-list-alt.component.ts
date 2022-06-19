import { Component } from '@angular/core';


import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId = 0;

  products: Product[] = [];

  constructor(private productService: ProductService) { }

  products$ = this.productService.products$


  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
