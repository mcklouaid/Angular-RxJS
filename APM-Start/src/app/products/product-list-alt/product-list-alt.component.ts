import { Component } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
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

  products$ = this.productService.productWithCategory$
  .pipe(
    tap(data => console.log(data)),
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY
    }
    )
  )


  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
