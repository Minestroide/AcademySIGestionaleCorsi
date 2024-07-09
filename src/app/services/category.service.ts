import axios from "axios";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";

export interface ICategory {
  id: string,
  name: string,
  courseIds: string[]
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: ICategory[] | undefined = undefined;
  private categoriesObservable: Observable<ICategory[]> | undefined = undefined;
  private token: string;
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.token = window.localStorage.getItem('token') as string;
    this.httpClient = httpClient;
  }

  refreshToken() {
    this.token = window.localStorage.getItem('token') as string;
  }

  clearCache() {
    this.categoriesObservable = undefined;
    this.categories = undefined;
  }

  getCategories(): Observable<ICategory[]> {
    if(this.categories) return new Observable((observer) => {
      observer.next(this.categories);
    });

    if(this.categoriesObservable) return this.categoriesObservable;

    this.categoriesObservable = this.httpClient.get<ICategory[]>("http://localhost:8080/api/categories").pipe(share());

    this.categoriesObservable.subscribe((categories) => {
      this.categories = categories;
    });

    return this.categoriesObservable;
  }
}
