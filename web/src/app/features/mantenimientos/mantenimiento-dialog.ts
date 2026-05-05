import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MantenimientoService } from '../../core/services/mantenimiento.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { AuditContextService } from '../../core/audit-context.service';
import { MantenimientoRead, VehiculoRead } from '../../models/api.models';

export interface MantenimientoDialogData { mode: 'create' | 'edit'; row?: MantenimientoRead; }

@Component({
  selector: 'app-mantenimiento-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule,
            MatInputModule, MatSelectModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo mantenimiento' : 'Editar mantenimiento' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        @if (data.mode === 'create') {
          <mat-form-field appearance="outline" class="full">
            <mat-label>Vehículo</mat-label>
            <mat-select formControlName="vehiculo_id">
              @for (v of vehiculos(); track v.id) {
                <mat-option [value]="v.id">{{ v.marca }} {{ v.modelo }} ({{ v.anio }})</mat-option>
              }
            </mat-select>
          </mat-form-field>
        }
        <mat-form-field appearance="outline" class="full">
          <mat-label>Motivo</mat-label>
          <input matInput formControlName="motivo" />
        </mat-form-field>
        @if (data.mode === 'create') {
          <mat-form-field appearance="outline" class="full">
            <mat-label>Fecha</mat-label>
            <input matInput type="datetime-local" formControlName="fecha" />
          </mat-form-field>
        }
        <mat-form-field appearance="outline" class="full">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="estado">
            <mat-option value="pendiente">Pendiente</mat-option>
            <mat-option value="en proceso">En proceso</mat-option>
            <mat-option value="completado">Completado</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: ['.dialog-form{display:flex;flex-direction:column;gap:8px;padding-top:8px}.full{width:100%}'],
})
export class MantenimientoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(MantenimientoService);
  private readonly vehiculoSvc = inject(VehiculoService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<MantenimientoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<MantenimientoDialogData>(MAT_DIALOG_DATA);

  readonly vehiculos = signal<VehiculoRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    vehiculo_id: [0, Validators.required],
    motivo: ['', Validators.required],
    fecha: [new Date().toISOString().slice(0, 16), Validators.required],
    estado: ['pendiente', Validators.required],
  });

  ngOnInit(): void {
    if (this.data.mode === 'create') {
      this.vehiculoSvc.list().subscribe(r => this.vehiculos.set(r));
    }
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({ motivo: r.motivo, estado: r.estado, fecha: r.fecha?.slice(0, 16) ?? '' });
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const uid = this.audit.usuarioId()!;
    const fechaISO = new Date(v.fecha).toISOString();
    if (this.data.mode === 'create') {
      this.svc.create({ vehiculo_id: v.vehiculo_id, motivo: v.motivo, fecha: fechaISO, estado: v.estado, id_usuario_creacion: uid }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(err.error?.detail ?? err.message, 'Cerrar', { duration: 6000 }),
      });
    } else {
      this.svc.update(this.data.row!.id, { motivo: v.motivo, estado: v.estado, id_usuario_edita: uid }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(err.error?.detail ?? err.message, 'Cerrar', { duration: 6000 }),
      });
    }
  }
}
