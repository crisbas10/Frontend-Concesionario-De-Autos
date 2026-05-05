import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VehiculoCreate, VehiculoRead, VehiculoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class VehiculoService {
  private readonly base = `${environment.apiUrl}/vehiculos`;
  constructor(private readonly http: HttpClient) {}

  list(): Observable<VehiculoRead[]> { return this.http.get<VehiculoRead[]>(`${this.base}/`); }
  get(id: number): Observable<VehiculoRead> { return this.http.get<VehiculoRead>(`${this.base}/${id}`); }
  create(body: VehiculoCreate): Observable<VehiculoRead> { return this.http.post<VehiculoRead>(`${this.base}/`, body); }
  update(id: number, body: VehiculoUpdate): Observable<VehiculoRead> { return this.http.put<VehiculoRead>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<unknown> { return this.http.delete(`${this.base}/${id}`); }
}
