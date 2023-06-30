import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private mostrarCampos = false;

  setMostrarCampos(value: boolean): void {
    this.mostrarCampos = value;
  }
  getMostrarCampos(): boolean {
    return this.mostrarCampos;
  }
}
