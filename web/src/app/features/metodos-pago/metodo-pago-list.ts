import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { MetodoPagoService } from '../../core/services/metodo-pago.service';
import { MetodoPagoRead } from '../../models/api.models';
import { MetodoPagoDialogComponent, MetodoPagoDialogData } from './metodo-pago-dialog';

@Component({
  selector: 'app-metodo-pago-list',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './metodo-pago-list.html',
  styleUrl: './metodo-pago-list.scss',
})
export class MetodoPagoListComponent implements AfterViewInit {
  private readonly svc = inject(MetodoPagoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['id', 'tipo', 'acciones'];
  readonly dataSource = new MatTableDataSource<MetodoPagoRead>([]);
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
  editar(row: MetodoPagoRead): void { this.openDialog({ mode: 'edit', row }); }
  private openDialog(data: MetodoPagoDialogData): void {
    this.dialog.open(MetodoPagoDialogComponent, { width: '400px', data }).afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
  eliminar(row: MetodoPagoRead): void {
    if (!confirm(`¿Eliminar método de pago "${row.tipo}"?`)) return;
    this.svc.delete(row.id).subscribe({
      next: () => { this.snack.open('Método de pago eliminado', 'OK', { duration: 3000 }); this.reload(); },
      error: (err: HttpErrorResponse) => this.snack.open(err.message, 'Cerrar', { duration: 6000 }),
    });
  }
}
