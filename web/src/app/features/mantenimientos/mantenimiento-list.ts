import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { MantenimientoService } from '../../core/services/mantenimiento.service';
import { MantenimientoRead } from '../../models/api.models';
import { MantenimientoDialogComponent, MantenimientoDialogData } from './mantenimiento-dialog';

@Component({
  selector: 'app-mantenimiento-list',
  imports: [DatePipe, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './mantenimiento-list.html',
  styleUrl: './mantenimiento-list.scss',
})
export class MantenimientoListComponent implements AfterViewInit {
  private readonly svc = inject(MantenimientoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['id', 'vehiculo_id', 'motivo', 'fecha', 'estado', 'acciones'];
  readonly dataSource = new MatTableDataSource<MantenimientoRead>([]);
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
  editar(row: MantenimientoRead): void { this.openDialog({ mode: 'edit', row }); }
  private openDialog(data: MantenimientoDialogData): void {
    this.dialog.open(MantenimientoDialogComponent, { width: '480px', data }).afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
  eliminar(row: MantenimientoRead): void {
    if (!confirm(`¿Eliminar mantenimiento #${row.id}?`)) return;
    this.svc.delete(row.id).subscribe({
      next: () => { this.snack.open('Mantenimiento eliminado', 'OK', { duration: 3000 }); this.reload(); },
      error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }),
    });
  }
}
