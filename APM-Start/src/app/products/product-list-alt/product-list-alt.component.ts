import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  products: Product[] = [];
  selectedProduct$ = this.productService.selectedProduct$;

  
  
  constructor(private productService: ProductService) { }

  products$ = this.productService.productWithCategory$
    .pipe(
      tap(data => console.log(data)),
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY
      }
      ),
    )


  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
