import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DecimalPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { EmpleadoService } from '../../core/services/empleado.service';
import { EmpleadoRead } from '../../models/api.models';
import { EmpleadoDialogComponent, EmpleadoDialogData } from './empleado-dialog';

@Component({
  selector: 'app-empleado-list',
  imports: [DecimalPipe, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './empleado-list.html',
  styleUrl: './empleado-list.scss',
})
export class EmpleadoListComponent implements AfterViewInit {
  private readonly svc = inject(EmpleadoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['id', 'nombre', 'cargo', 'telefono', 'correo', 'salario', 'acciones'];
  readonly dataSource = new MatTableDataSource<EmpleadoRead>([]);
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
  editar(row: EmpleadoRead): void { this.openDialog({ mode: 'edit', row }); }
  private openDialog(data: EmpleadoDialogData): void {
    this.dialog.open(EmpleadoDialogComponent, { width: '480px', data }).afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
  eliminar(row: EmpleadoRead): void {
    if (!confirm(`¿Eliminar empleado ${row.nombre}?`)) return;
    this.svc.delete(row.id).subscribe({
      next: () => { this.snack.open('Empleado eliminado', 'OK', { duration: 3000 }); this.reload(); },
      error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }),
    });
  }
}
