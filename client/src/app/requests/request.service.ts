import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Request } from './request';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  // The URL for the requests part of the server API
  readonly requestUrl: string = `${environment.apiUrl}forms/get`;
  readonly newRequestUrl: string = `${environment.apiUrl}form/add`;
  private readonly selKey = 'selections';
  constructor(private httpClient: HttpClient) {
  }

  getRequests(filters?: {sortOrder?: string}): Observable<Request[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.sortOrder) {
        httpParams = httpParams.set('sortOrder', filters.sortOrder);
      }
    }
    return this.httpClient.get<Request[]>(this.requestUrl, {
      params: httpParams,
    });
  }

  filterRequests(requests: Request[]): Request[] {
    const filteredRequests = requests;

    return filteredRequests;
  }

  addRequest(newRequest: Partial<Request>): Observable<string> {
    // Send post request to add a new Request with the Request data as the body.
    return this.httpClient.post<{id: string}>(this.newRequestUrl, newRequest).pipe(map(res => res.id));
  }
}
