import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClientFormService {

  readonly clientFormUrl: string = `${environment.apiUrl}clientform`;

  private readonly foodKey = 'value';

  constructor(private httpClient: HttpClient) {}

}
