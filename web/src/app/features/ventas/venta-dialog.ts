import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VentaService } from '../../core/services/venta.service';
import { EmpleadoService } from '../../core/services/empleado.service';
import { ClienteService } from '../../core/services/cliente.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { MetodoPagoService } from '../../core/services/metodo-pago.service';
import { AuditContextService } from '../../core/audit-context.service';
import { VentaRead, EmpleadoRead, ClienteRead, VehiculoRead, MetodoPagoRead } from '../../models/api.models';

export interface VentaDialogData { mode: 'create' | 'edit'; row?: VentaRead; }

@Component({
  selector: 'app-venta-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule,
            MatInputModule, MatSelectModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nueva venta' : 'Editar venta' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        @if (data.mode === 'create') {
          <mat-form-field appearance="outline" class="full">
            <mat-label>Empleado</mat-label>
            <mat-select formControlName="empleado_id">
              @for (e of empleados(); track e.id) {
                <mat-option [value]="e.id">{{ e.nombre }} — {{ e.cargo }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Cliente</mat-label>
            <mat-select formControlName="cliente_id">
              @for (c of clientes(); track c.id) {
                <mat-option [value]="c.id">{{ c.nombre }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Vehículo</mat-label>
            <mat-select formControlName="vehiculo_id">
              @for (v of vehiculos(); track v.id) {
                <mat-option [value]="v.id">{{ v.marca }} {{ v.modelo }} ({{ v.anio }})</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Método de pago</mat-label>
            <mat-select formControlName="metodo_pago_id">
              @for (m of metodosPago(); track m.id) {
                <mat-option [value]="m.id">{{ m.tipo }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Fecha</mat-label>
            <input matInput type="datetime-local" formControlName="fecha" />
          </mat-form-field>
        }
        <mat-form-field appearance="outline" class="full">
          <mat-label>Precio final</mat-label>
          <input matInput type="number" formControlName="precio_final" />
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
export class VentaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(VentaService);
  private readonly empleadoSvc = inject(EmpleadoService);
  private readonly clienteSvc = inject(ClienteService);
  private readonly vehiculoSvc = inject(VehiculoService);
  private readonly metodoPagoSvc = inject(MetodoPagoService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<VentaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<VentaDialogData>(MAT_DIALOG_DATA);

  readonly empleados = signal<EmpleadoRead[]>([]);
  readonly clientes = signal<ClienteRead[]>([]);
  readonly vehiculos = signal<VehiculoRead[]>([]);
  readonly metodosPago = signal<MetodoPagoRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    empleado_id: [0, Validators.required],
    cliente_id: [0, Validators.required],
    vehiculo_id: [0, Validators.required],
    metodo_pago_id: [0, Validators.required],
    fecha: [new Date().toISOString().slice(0, 16), Validators.required],
    precio_final: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    if (this.data.mode === 'create') {
      this.empleadoSvc.list().subscribe(r => this.empleados.set(r));
      this.clienteSvc.list().subscribe(r => this.clientes.set(r));
      this.vehiculoSvc.list().subscribe(r => this.vehiculos.set(r.filter(v => v.disponibilidad)));
      this.metodoPagoSvc.list().subscribe(r => this.metodosPago.set(r));
    }
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({ precio_final: r.precio_final });
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const uid = this.audit.usuarioId()!;
    const fechaISO = new Date(v.fecha).toISOString();
    if (this.data.mode === 'create') {
      this.svc.create({ empleado_id: v.empleado_id, cliente_id: v.cliente_id, vehiculo_id: v.vehiculo_id, metodo_pago_id: v.metodo_pago_id, fecha: fechaISO, precio_final: v.precio_final, id_usuario_creacion: uid }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(err.error?.detail ?? err.message, 'Cerrar', { duration: 6000 }),
      });
    } else {
      this.svc.update(this.data.row!.id, { precio_final: v.precio_final, id_usuario_edita: uid }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(err.error?.detail ?? err.message, 'Cerrar', { duration: 6000 }),
      });
    }
  }
}
