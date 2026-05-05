import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VentaCreate, VentaRead, VentaUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private readonly base = `${environment.apiUrl}/ventas`;
  constructor(private readonly http: HttpClient) {}

  list(): Observable<VentaRead[]> { return this.http.get<VentaRead[]>(`${this.base}/`); }
  get(id: number): Observable<VentaRead> { return this.http.get<VentaRead>(`${this.base}/${id}`); }
  create(body: VentaCreate): Observable<VentaRead> { return this.http.post<VentaRead>(`${this.base}/`, body); }
  update(id: number, body: VentaUpdate): Observable<VentaRead> { return this.http.put<VentaRead>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<unknown> { return this.http.delete(`${this.base}/${id}`); }
}
