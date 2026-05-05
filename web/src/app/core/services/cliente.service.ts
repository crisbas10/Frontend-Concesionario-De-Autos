import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClienteCreate, ClienteRead, ClienteUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly base = `${environment.apiUrl}/clientes`;
  constructor(private readonly http: HttpClient) {}

  list(): Observable<ClienteRead[]> { return this.http.get<ClienteRead[]>(`${this.base}/`); }
  get(id: number): Observable<ClienteRead> { return this.http.get<ClienteRead>(`${this.base}/${id}`); }
  create(body: ClienteCreate): Observable<ClienteRead> { return this.http.post<ClienteRead>(`${this.base}/`, body); }
  update(id: number, body: ClienteUpdate): Observable<ClienteRead> { return this.http.put<ClienteRead>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<unknown> { return this.http.delete(`${this.base}/${id}`); }
}
