import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'concesionario_audit_usuario_id';

@Injectable({ providedIn: 'root' })
export class AuditContextService {
  private readonly id = signal<number | null>(this.readStorage());

  readonly usuarioId = this.id.asReadonly();
  readonly hasUsuario = computed(() => this.id() !== null);

  select(id: number): void {
    this.id.set(id);
    localStorage.setItem(STORAGE_KEY, String(id));
  }

  clear(): void {
    this.id.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private readStorage(): number | null {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? parseInt(v, 10) : null;
  }
}
