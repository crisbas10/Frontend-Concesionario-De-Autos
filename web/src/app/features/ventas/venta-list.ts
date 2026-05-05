import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { VentaService } from '../../core/services/venta.service';
import { VentaRead } from '../../models/api.models';
import { VentaDialogComponent, VentaDialogData } from './venta-dialog';

@Component({
  selector: 'app-venta-list',
  imports: [DatePipe, DecimalPipe, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './venta-list.html',
  styleUrl: './venta-list.scss',
})
export class VentaListComponent implements AfterViewInit {
  private readonly svc = inject(VentaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['id', 'empleado_id', 'cliente_id', 'vehiculo_id', 'metodo_pago_id', 'fecha', 'precio_final', 'acciones'];
  readonly dataSource = new MatTableDataSource<VentaRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; }
  constructor() { this.reload(); }

  reload(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (rows) => { this.dataSource.data = rows; this.loading = false; },
      error: (err: HttpErrorResponse) => { this.loading = false; this.snack.open(err.message, 'Cerrar', { duration: 6000 }); },
    });
  }

  nuevo(): void { this.openDialog({ mode: 'create' }); }
  editar(row: VentaRead): void { this.openDialog({ mode: 'edit', row }); }
  private openDialog(data: VentaDialogData): void {
    this.dialog.open(VentaDialogComponent, { width: '520px', data }).afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
  eliminar(row: VentaRead): void {
    if (!confirm(`¿Eliminar venta #${row.id}?`)) return;
    this.svc.delete(row.id).subscribe({
      next: () => { this.snack.open('Venta eliminada', 'OK', { duration: 3000 }); this.reload(); },
      error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }),
    });
  }
}
