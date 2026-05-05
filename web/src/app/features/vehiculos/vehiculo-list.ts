import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DecimalPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { VehiculoRead } from '../../models/api.models';
import { VehiculoDialogComponent, VehiculoDialogData } from './vehiculo-dialog';

@Component({
  selector: 'app-vehiculo-list',
  imports: [DecimalPipe, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule, MatChipsModule],
  templateUrl: './vehiculo-list.html',
  styleUrl: './vehiculo-list.scss',
})
export class VehiculoListComponent implements AfterViewInit {
  private readonly svc = inject(VehiculoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['id', 'marca', 'modelo', 'anio', 'precio', 'estado', 'disponibilidad', 'acciones'];
  readonly dataSource = new MatTableDataSource<VehiculoRead>([]);
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
  editar(row: VehiculoRead): void { this.openDialog({ mode: 'edit', row }); }
  private openDialog(data: VehiculoDialogData): void {
    this.dialog.open(VehiculoDialogComponent, { width: '560px', data }).afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
  eliminar(row: VehiculoRead): void {
    if (!confirm(`¿Eliminar vehículo ${row.marca} ${row.modelo}?`)) return;
    this.svc.delete(row.id).subscribe({
      next: () => { this.snack.open('Vehículo eliminado', 'OK', { duration: 3000 }); this.reload(); },
      error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }),
    });
  }
}
