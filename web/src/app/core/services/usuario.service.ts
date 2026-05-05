import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioCreate, UsuarioRead, UsuarioUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly base = `${environment.apiUrl}/usuarios`;
  constructor(private readonly http: HttpClient) {}

  list(): Observable<UsuarioRead[]> { return this.http.get<UsuarioRead[]>(`${this.base}/`); }
  get(id: number): Observable<UsuarioRead> { return this.http.get<UsuarioRead>(`${this.base}/${id}`); }
  create(body: UsuarioCreate): Observable<UsuarioRead> { return this.http.post<UsuarioRead>(`${this.base}/`, body); }
  update(id: number, body: UsuarioUpdate): Observable<UsuarioRead> { return this.http.put<UsuarioRead>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<unknown> { return this.http.delete(`${this.base}/${id}`); }
}
