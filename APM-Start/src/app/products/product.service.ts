import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, catchError, combineLatest, map, Observable, throwError } from 'rxjs';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';
  protected products: Product | undefined;


  constructor(private http: HttpClient, private productCategoryService: ProductCategoryService) { }

  products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      //tap(data => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

  productWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.$productCategories$
  ]).pipe(
    //tap(data => console.log(data)),
    map(([products, categories]) =>
      products.map((product: Product) => ({
        ...product,
        price: product.price ? product.price * 1.5 : 0,
        category: categories.find(c => product.categoryId === c.id)?.name,
        searchKey: [product.productName]
      } as Product)))
  );

  private productSelectedSubject = new BehaviorSubject<number>(0);
  productSelectedAction$ = this.productSelectedSubject.asObservable();

  selectedProduct$ = combineLatest([
    this.productWithCategory$,
    this.productSelectedAction$
  ]).pipe(
    map(([products, selectedProductId]) => 
    products.find((product: { id: number; }) => product.id == selectedProductId)
  ),
  //tap(product => console.log('selectedProduct', product))
  );


selectedProductChanged(selectedProductId: number){
  this.productSelectedSubject.next(selectedProductId);
}

  // private fakeProduct(): Product {
  //   return {
  //     id: 42,
  //     productName: 'Another One',
  //     productCode: 'TBX-0042',
  //     description: 'Our new product',
  //     price: 8.9,
  //     categoryId: 3,
  //     // category: 'Toolbox',
  //     quantityInStock: 30
  //   };
  // }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
