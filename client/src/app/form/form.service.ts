import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Form } from './form';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  // The URL for the forms part of the server API
  readonly formUrl: string = `${environment.apiUrl}forms/get`;
  readonly newFormUrl: string = `${environment.apiUrl}form/add`;
  private readonly selKey = 'selections';
  constructor(private httpClient: HttpClient) {
  }

  getForms(filters?: {sortOrder?: string}): Observable<Form[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.sortOrder) {
        httpParams = httpParams.set('sortOrder', filters.sortOrder);
      }
    }
    return this.httpClient.get<Form[]>(this.formUrl, {
      params: httpParams,
    });
  }


  addForm(newForm: Partial<Form>): Observable<string> {
    // Send post form to add a new Form with the Form data as the body.
    return this.httpClient.post<{id: string}>(this.newFormUrl, newForm).pipe(map(res => res.id));
  }
}

