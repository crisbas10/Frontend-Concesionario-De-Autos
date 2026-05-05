import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioRead } from '../../models/api.models';

export interface UsuarioDialogData { mode: 'create' | 'edit'; row?: UsuarioRead; }

@Component({
  selector: 'app-usuario-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo usuario' : 'Editar usuario' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Nombre de usuario</mat-label>
          <input matInput formControlName="nombre_usuario" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Correo</mat-label>
          <input matInput type="email" formControlName="correo" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Contraseña{{ data.mode === 'edit' ? ' (dejar vacío para no cambiar)' : '' }}</mat-label>
          <input matInput type="password" formControlName="password" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Rol</mat-label>
          <input matInput formControlName="rol" placeholder="admin / vendedor" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Cancelar</button>
      <button mat-flat-button color="primary" type="button" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: ['.dialog-form { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; } .full { width: 100%; }'],
})
export class UsuarioDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(UsuarioService);
  private readonly dialogRef = inject(MatDialogRef<UsuarioDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<UsuarioDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre_usuario: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: [''],
    rol: ['vendedor', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({ nombre_usuario: r.nombre_usuario, correo: r.correo, rol: r.rol });
    }
    if (this.data.mode === 'create') {
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(4)]);
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    if (this.data.mode === 'create') {
      this.svc.create({ nombre_usuario: v.nombre_usuario, correo: v.correo, password: v.password, rol: v.rol }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    } else {
      const body: Record<string, unknown> = { nombre_usuario: v.nombre_usuario, correo: v.correo, rol: v.rol };
      if (v.password?.trim()) body['password'] = v.password;
      this.svc.update(this.data.row!.id, body as never).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    }
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: { msg?: string }) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}
