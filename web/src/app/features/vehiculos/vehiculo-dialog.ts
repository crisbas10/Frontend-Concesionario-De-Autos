import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { AuditContextService } from '../../core/audit-context.service';
import { VehiculoRead } from '../../models/api.models';

export interface VehiculoDialogData { mode: 'create' | 'edit'; row?: VehiculoRead; }

@Component({
  selector: 'app-vehiculo-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo vehículo' : 'Editar vehículo' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline"><mat-label>Marca</mat-label><input matInput formControlName="marca" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Modelo</mat-label><input matInput formControlName="modelo" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Año</mat-label><input matInput type="number" formControlName="anio" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Precio</mat-label><input matInput type="number" formControlName="precio" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Kilometraje</mat-label><input matInput type="number" formControlName="kilometraje" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Estado (nuevo/usado)</mat-label><input matInput formControlName="estado" /></mat-form-field>
        <div class="full"><mat-checkbox formControlName="disponibilidad">Disponible para venta</mat-checkbox></div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: ['.dialog-form{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:8px} .full{grid-column:1/-1}'],
})
export class VehiculoDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(VehiculoService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<VehiculoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<VehiculoDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    anio: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
    precio: [0, [Validators.required, Validators.min(0)]],
    kilometraje: [0, [Validators.required, Validators.min(0)]],
    estado: ['nuevo', Validators.required],
    disponibilidad: [true],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({ marca: r.marca, modelo: r.modelo, anio: r.anio, precio: r.precio, kilometraje: r.kilometraje, estado: r.estado, disponibilidad: r.disponibilidad });
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
