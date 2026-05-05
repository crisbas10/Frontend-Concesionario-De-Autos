import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClienteService } from '../../core/services/cliente.service';
import { AuditContextService } from '../../core/audit-context.service';
import { ClienteRead } from '../../models/api.models';

export interface ClienteDialogData { mode: 'create' | 'edit'; row?: ClienteRead; }

@Component({
  selector: 'app-cliente-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo cliente' : 'Editar cliente' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full"><mat-label>Nombre</mat-label><input matInput formControlName="nombre" /></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>Teléfono</mat-label><input matInput formControlName="telefono" /></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>Correo</mat-label><input matInput type="email" formControlName="correo" /></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: ['.dialog-form{display:flex;flex-direction:column;gap:8px;padding-top:8px}.full{width:100%}'],
})
export class ClienteDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(ClienteService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<ClienteDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<ClienteDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({ nombre: r.nombre, telefono: r.telefono, correo: r.correo });
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const uid = this.audit.usuarioId()!;
    if (this.data.mode === 'create') {
      this.svc.create({ ...v, id_usuario_creacion: uid }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }),
      });
    } else {
      this.svc.update(this.data.row!.id, { ...v, id_usuario_edita: uid }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }),
      });
    }
  }
}
