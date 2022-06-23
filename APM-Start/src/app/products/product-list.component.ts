import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BehaviorSubject, catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categotySelectedAction$ = this.categorySelectedSubject.asObservable();

  
  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }


  category$ = this.productCategoryService.$productCategories$
    .pipe(
      tap(data => console.log(data)),
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY
      }
      )
    )

  // products$: Observable<Product[]> = this.productService.productWithCategory$
  //   .pipe(
  //     tap(data => console.log(data)),
  //     catchError((err) => {
  //       this.errorMessage = err;
  //       return EMPTY
  //     }
  //     )
  //   )

    products$ = combineLatest([
      this.productService.productWithCategory$, 
      this.categotySelectedAction$
    ])
    .pipe(
      map(([products, selectedCategoryId]) =>
        products.filter(product => selectedCategoryId ? product.categoryId === selectedCategoryId : true)
      ),
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY
      }),
      tap(data => console.log(data))
    )

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
