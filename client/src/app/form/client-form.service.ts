import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Form } from './client-form';

@Injectable({
  providedIn: 'root'
})

export class FormService {

  readonly formUrl: string = `${environment.apiUrl}form/add`;

  private readonly foodKey = 'value';

  constructor(private httpClient: HttpClient) {}

  addRequest(newForm: Partial<Form>): Observable<string> {
    // Send post request to add a new Request with the Request data as the body.
    return this.httpClient.post<{id: string}>(this.formUrl, newForm).pipe(map(res => res.id));
  }
}
