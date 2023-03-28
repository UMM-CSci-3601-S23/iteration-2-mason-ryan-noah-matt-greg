import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClientFormService {

  readonly clientFormUrl: string = `${environment.apiUrl}clientform`;
  readonly newClientFormUrl: string = `${environment.apiUrl}clientform`;

  private readonly selKey = 'selections';

  constructor(private httpClient: HttpClient) {
  }

  getRequests(filters?: {selections?: Map<string, boolean>}): Observable<Request[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.selections) {
        httpParams = httpParams.set(this.selKey, filters.selections.get('bread'));
      }
    }
    return this.httpClient.get<Request[]>(this.clientFormUrl, {
      params: httpParams,
    });
  }

  filterRequests(requests: Request[]): Request[] {
    const filteredRequests = requests;

    return filteredRequests;
  }

  addRequest(newRequest: Partial<Request>): Observable<string> {
    // Send post request to add a new Request with the Request data as the body.
    return this.httpClient.post<{id: string}>(this.newClientFormUrl, newRequest).pipe(map(res => res.id));
  }
}
