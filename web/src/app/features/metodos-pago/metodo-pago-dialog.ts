import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MetodoPagoService } from '../../core/services/metodo-pago.service';
import { MetodoPagoRead } from '../../models/api.models';

export interface MetodoPagoDialogData { mode: 'create' | 'edit'; row?: MetodoPagoRead; }

@Component({
  selector: 'app-metodo-pago-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo método de pago' : 'Editar método de pago' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex;flex-direction:column;gap:8px;padding-top:8px">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Tipo (ej: Efectivo, Tarjeta, Transferencia)</mat-label>
          <input matInput formControlName="tipo" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class MetodoPagoDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(MetodoPagoService);
  private readonly dialogRef = inject(MatDialogRef<MetodoPagoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<MetodoPagoDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({ tipo: ['', Validators.required] });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({ tipo: this.data.row.tipo });
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    if (this.data.mode === 'create') {
      this.svc.create(v).subscribe({ next: () => this.dialogRef.close(true), error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }) });
    } else {
      this.svc.update(this.data.row!.id, v).subscribe({ next: () => this.dialogRef.close(true), error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }) });
    }
  }
}
