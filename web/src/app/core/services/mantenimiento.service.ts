import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MantenimientoCreate, MantenimientoRead, MantenimientoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class MantenimientoService {
  private readonly base = `${environment.apiUrl}/mantenimientos`;
  constructor(private readonly http: HttpClient) {}

  list(): Observable<MantenimientoRead[]> { return this.http.get<MantenimientoRead[]>(`${this.base}/`); }
  get(id: number): Observable<MantenimientoRead> { return this.http.get<MantenimientoRead>(`${this.base}/${id}`); }
  create(body: MantenimientoCreate): Observable<MantenimientoRead> { return this.http.post<MantenimientoRead>(`${this.base}/`, body); }
  update(id: number, body: MantenimientoUpdate): Observable<MantenimientoRead> { return this.http.put<MantenimientoRead>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<unknown> { return this.http.delete(`${this.base}/${id}`); }
}
