import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmpleadoService } from '../../core/services/empleado.service';
import { EmpleadoRead } from '../../models/api.models';

export interface EmpleadoDialogData { mode: 'create' | 'edit'; row?: EmpleadoRead; }

@Component({
  selector: 'app-empleado-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo empleado' : 'Editar empleado' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full"><mat-label>Nombre</mat-label><input matInput formControlName="nombre" /></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>Teléfono</mat-label><input matInput formControlName="telefono" /></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>Correo</mat-label><input matInput type="email" formControlName="correo" /></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>Salario</mat-label><input matInput type="number" formControlName="salario" /></mat-form-field>
        <mat-form-field appearance="outline" class="full"><mat-label>Cargo</mat-label><input matInput formControlName="cargo" /></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: ['.dialog-form{display:flex;flex-direction:column;gap:8px;padding-top:8px}.full{width:100%}'],
})
export class EmpleadoDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(EmpleadoService);
  private readonly dialogRef = inject(MatDialogRef<EmpleadoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<EmpleadoDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    salario: [0, [Validators.required, Validators.min(0)]],
    cargo: ['', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({ nombre: r.nombre, telefono: r.telefono, correo: r.correo, salario: r.salario, cargo: r.cargo });
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    if (this.data.mode === 'create') {
      this.svc.create(v).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }),
      });
    } else {
      this.svc.update(this.data.row!.id, v).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }),
      });
    }
  }
}
