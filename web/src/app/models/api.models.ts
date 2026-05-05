/** Contratos alineados con el backend FastAPI del Concesionario de Autos */

// ─── USUARIO ───────────────────────────────────────────────────────────────
export interface UsuarioRead {
  id: number;
  nombre_usuario: string;
  correo: string;
  rol: string;
}
export interface UsuarioCreate {
  nombre_usuario: string;
  correo: string;
  password: string;
  rol: string;
}
export interface UsuarioUpdate {
  nombre_usuario?: string;
  correo?: string;
  password?: string;
  rol?: string;
}

// ─── CLIENTE ───────────────────────────────────────────────────────────────
export interface ClienteRead {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
}
export interface ClienteCreate {
  nombre: string;
  telefono: string;
  correo: string;
  id_usuario_creacion: number;
}
export interface ClienteUpdate {
  nombre?: string;
  telefono?: string;
  correo?: string;
  id_usuario_edita: number;
}

// ─── EMPLEADO ──────────────────────────────────────────────────────────────
export interface EmpleadoRead {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  salario: number;
  cargo: string;
}
export interface EmpleadoCreate {
  nombre: string;
  telefono: string;
  correo: string;
  salario: number;
  cargo: string;
}
export interface EmpleadoUpdate {
  nombre?: string;
  telefono?: string;
  correo?: string;
  salario?: number;
  cargo?: string;
}

// ─── VEHÍCULO ──────────────────────────────────────────────────────────────
export interface VehiculoRead {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  kilometraje: number;
  estado: string;
  disponibilidad: boolean;
}
export interface VehiculoCreate {
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  kilometraje: number;
  estado: string;
  disponibilidad: boolean;
  id_usuario_creacion: number;
}
export interface VehiculoUpdate {
  marca?: string;
  modelo?: string;
  anio?: number;
  precio?: number;
  kilometraje?: number;
  estado?: string;
  disponibilidad?: boolean;
  id_usuario_edita: number;
}

// ─── MÉTODO DE PAGO ────────────────────────────────────────────────────────
export interface MetodoPagoRead {
  id: number;
  tipo: string;
}
export interface MetodoPagoCreate { tipo: string; }
export interface MetodoPagoUpdate { tipo: string; }

// ─── MANTENIMIENTO ─────────────────────────────────────────────────────────
export interface MantenimientoRead {
  id: number;
  vehiculo_id: number;
  motivo: string;
  fecha: string;
  estado: string;
}
export interface MantenimientoCreate {
  vehiculo_id: number;
  motivo: string;
  fecha: string;
  estado: string;
  id_usuario_creacion: number;
}
export interface MantenimientoUpdate {
  motivo?: string;
  estado?: string;
  id_usuario_edita: number;
}

// ─── VENTA ─────────────────────────────────────────────────────────────────
export interface VentaRead {
  id: number;
  empleado_id: number;
  cliente_id: number;
  vehiculo_id: number;
  metodo_pago_id: number;
  fecha: string;
  precio_final: number;
}
export interface VentaCreate {
  empleado_id: number;
  cliente_id: number;
  vehiculo_id: number;
  metodo_pago_id: number;
  fecha: string;
  precio_final: number;
  id_usuario_creacion: number;
}
export interface VentaUpdate {
  precio_final?: number;
  id_usuario_edita: number;
}
