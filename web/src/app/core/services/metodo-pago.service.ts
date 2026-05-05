import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MetodoPagoCreate, MetodoPagoRead, MetodoPagoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class MetodoPagoService {
  private readonly base = `${environment.apiUrl}/metodos-pago`;
  constructor(private readonly http: HttpClient) {}

  list(): Observable<MetodoPagoRead[]> { return this.http.get<MetodoPagoRead[]>(`${this.base}/`); }
  get(id: number): Observable<MetodoPagoRead> { return this.http.get<MetodoPagoRead>(`${this.base}/${id}`); }
  create(body: MetodoPagoCreate): Observable<MetodoPagoRead> { return this.http.post<MetodoPagoRead>(`${this.base}/`, body); }
  update(id: number, body: MetodoPagoUpdate): Observable<MetodoPagoRead> { return this.http.put<MetodoPagoRead>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<unknown> { return this.http.delete(`${this.base}/${id}`); }
}
