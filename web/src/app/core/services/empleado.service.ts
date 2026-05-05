import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmpleadoCreate, EmpleadoRead, EmpleadoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private readonly base = `${environment.apiUrl}/empleados`;
  constructor(private readonly http: HttpClient) {}

  list(): Observable<EmpleadoRead[]> { return this.http.get<EmpleadoRead[]>(`${this.base}/`); }
  get(id: number): Observable<EmpleadoRead> { return this.http.get<EmpleadoRead>(`${this.base}/${id}`); }
  create(body: EmpleadoCreate): Observable<EmpleadoRead> { return this.http.post<EmpleadoRead>(`${this.base}/`, body); }
  update(id: number, body: EmpleadoUpdate): Observable<EmpleadoRead> { return this.http.put<EmpleadoRead>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<unknown> { return this.http.delete(`${this.base}/${id}`); }
}
