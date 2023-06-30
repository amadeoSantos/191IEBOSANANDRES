import {Component, OnInit} from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-documents-record',
  templateUrl: './documents-record.component.html',
  styleUrls: ['./documents-record.component.scss'],
})
export class DocumentsRecordComponent implements OnInit {
  mostrarMensaje = false;
  mensaje = '';
  titulo = '';
  botonGuardadoCurp = false;
  botonGuardadoActa: boolean = false;
  botonGuardadoCertificadoS: boolean = false;
  botonGuardadoCertificadoMedico: boolean = false;
  ngOnInit() {
    this.verificarExistenciaDocumentos();
  }
  constructor(
      private auth: AngularFireAuth,
      private storage: AngularFireStorage,
      private afAuth: AngularFireAuth
  ) {}
  subirArchivo(nombreFila: string, event: Event) {
    // Obtener el input del evento como un elemento HTMLInputElement
    const input = event.target as HTMLInputElement;
    const files = input.files;

    // Verificar si se seleccionó algún archivo
    if (files && files.length > 0) {
      const archivo = files[0];

      // Construir la ruta del archivo en base al nombre de la fila y el nombre del archivo
      const rutaArchivo = `${nombreFila}/${archivo.name}`;

      // Obtener el usuario actualmente autenticado
      this.auth.currentUser.then((usuario) => {
        // Verificar si el nombre del archivo coincide con el nombre de la fila
        if (archivo.name == nombreFila) {
          // Verificar si se obtuvo el usuario correctamente
          if (usuario) {
            const userId = usuario.uid;
            const rutaUsuario = `usuarios/${userId}/${rutaArchivo}`;

            // Obtener la referencia al archivo en el almacenamiento
            const referencia = this.storage.ref(rutaUsuario);

            // Realizar la carga del archivo
            const tarea = referencia.put(archivo);

            tarea.snapshotChanges().subscribe(
                (snapshot: any) => {
                  // Verificar si la carga del archivo se completó correctamente
                  if (snapshot.state === 'success') {
                    console.log('Archivo subido correctamente');
                    this.mostrarMensajeExito('Exito', 'Archivo subido exitoso');

                    // Actualizar el estado y las propiedades según la fila del archivo
                    if (nombreFila === 'ACTA.pdf') {
                      this.botonGuardadoActa = true;
                    } else if (nombreFila === 'CERTIFICADO MEDICO.pdf') {
                      this.botonGuardadoCertificadoMedico = true;
                    } else if (nombreFila === 'CURP.pdf') {
                      this.botonGuardadoCurp = true;
                    } else if (nombreFila === 'CERTIFICADO.pdf') {
                      this.botonGuardadoCurp = true;
                    }
                  }
                },
                (error) => {
                  console.error('Error al subir el archivo:', error);
                }
            );
          }
        } else {
          this.mostrarMensajeExito('Error', 'Nombre de Archivo Incorrecto ');
        }
      });
    }
  }


  descargarArchivo(nombreFila: string, nombre: string) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userId = user.uid; // ID del usuario autenticado
        const path = `usuarios/${userId}/${nombreFila}/${nombre}`;

        // Obtener referencia al archivo en Firebase Storage
        const ref = this.storage.ref(path);

        // Obtener URL de descarga del archivo
        ref.getDownloadURL().subscribe((url) => {
          // Iniciar la descarga del archivo
          window.open(url);

        });
      }
    });
  }

  async eliminarArchivo(
      nombreFila: string,
      nombreArchivo: string
  ): Promise<void> {
    try {
      const user = await this.auth.currentUser;
      if (user) {
        const userId = user.uid;
        const filePath = `usuarios/${userId}/${nombreFila}/${nombreArchivo}`;
        const fileRef = this.storage.ref(filePath);

        fileRef.delete().toPromise();
        console.log('Archivo eliminado exitosamente');
        if (nombreFila === 'ACTA.pdf') {
          this.botonGuardadoActa = false;
        } else if (nombreFila === 'CERTIFICADO MEDICO.pdf') {
          this.botonGuardadoCertificadoMedico = false;
        }else if(nombreFila==='CURP.pdf'){
          this.botonGuardadoCurp=false;
        }else if(nombreFila==='CERTIFICADO.pdf'){
          this.botonGuardadoCertificadoS=false;
        }
      }
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      this.mostrarMensajeExito('Error',`Documento ${nombreFila} no existe`)
    }
  }
  cerrarDialogo(): void {
    this.mostrarMensaje = false;
  }
  mostrarMensajeExito(titulo: string, mensaje: string): void {
    this.mensaje = mensaje;
    this.titulo = titulo
    this.mostrarMensaje = true;
  }
  verificarExistenciaDocumentos() {
    const userId = this.afAuth.authState.subscribe(user => {
      // Verificar si se obtuvo el usuario correctamente
      if (user) {
        const userId = user.uid;

        // Construir la ruta del archivo para el ACTA.pdf
        const filePathActa = `usuarios/${userId}/ACTA.pdf/ACTA.pdf`;
        // Verificar la existencia del documento y actualizar el indicador de botón correspondiente
        this.verificarExistenciaDocumento(filePathActa, 'botonGuardadoActa');

        // Construir la ruta del archivo para el CERTIFICADO MEDICO.pdf
        const filePathCertificado = `usuarios/${userId}/CERTIFICADO MEDICO.pdf/CERTIFICADO MEDICO.pdf`;
        // Verificar la existencia del documento y actualizar el indicador de botón correspondiente
        this.verificarExistenciaDocumento(filePathCertificado, 'botonGuardadoCertificadoMedico');

        // Construir la ruta del archivo para el CURP.pdf
        const filePathCurp = `usuarios/${userId}/CURP.pdf/CURP.pdf`;
        // Verificar la existencia del documento y actualizar el indicador de botón correspondiente
        this.verificarExistenciaDocumento(filePathCurp, 'botonGuardadoCurp');

        // Construir la ruta del archivo para el CERTIFICADO.pdf
        const filePathCERTIFICADO = `usuarios/${userId}/CERTIFICADO.pdf/CERTIFICADO.pdf`;
        // Verificar la existencia del documento y actualizar el indicador de botón correspondiente
        this.verificarExistenciaDocumento(filePathCERTIFICADO, 'botonGuardadoCertificadoS');
      }
    });
  }

  verificarExistenciaDocumento(filePath: string, boton: string): void {
    const rutaDocumento = filePath;
    const nombrePropiedad = boton as keyof this;
    this.storage.ref(rutaDocumento)
        .getMetadata()
        .toPromise()
        .then(() => {
          // Asigna el valor booleano a la propiedad utilizando type casting
          this[nombrePropiedad] = true as unknown as this[keyof this];
        })
        .catch(() => {
          // Asigna el valor booleano a la propiedad utilizando type casting
          this[nombrePropiedad] = false as unknown as this[keyof this];
        });
  }
}
