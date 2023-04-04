import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Item } from './item';
import { map } from 'rxjs/operators';

@Injectable()
export class ItemService {
  readonly itemUrl: string = environment.apiUrl + 'items';
  constructor(private httpClient: HttpClient) {
  }

  getItems(filters?: { itemName?: string; unit?: string; amount?: string }): Observable<Item[]> {

    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.itemName) {
        httpParams = httpParams.set('itemName', filters.itemName);
      }
      if (filters.unit) {
        httpParams = httpParams.set('unit', filters.unit);
      }
      if (filters.amount) {
        httpParams = httpParams.set('amount', filters.amount);
      }
    }
    return this.httpClient.get<Item[]>(this.itemUrl, {
      params: httpParams,
    });
  }

  getItemById(id: string): Observable<Item>{
    return this.httpClient.get<Item>(this.itemUrl +'/' + id);
  }

  addItem(newItem: Item): Observable<string> {
    return this.httpClient.post<{id: string}>(this.itemUrl, newItem).pipe(map(res => res.id));
  }
}
