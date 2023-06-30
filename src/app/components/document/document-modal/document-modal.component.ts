import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AngularFireStorage} from "@angular/fire/compat/storage";
@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss']
})
export class DocumentModalComponent implements OnInit{
  documentos: string[] = [];

  botonGuardadoCurp = false;
  botonGuardadoActa: boolean = false;
  botonGuardadoCertificadoMedico: boolean = false;
  constructor(
      private storage: AngularFireStorage,
      public dialogRef: MatDialogRef<DocumentModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { estudianteId: string } // Recibir el ID del estudiante como dato
  ) {
  }

  ngOnInit() {
    const estudianteId = this.data.estudianteId;
    console.log("hola"+estudianteId)
// Obtener la referencia a la carpeta del estudiante en el Storage
    const estudianteRef = this.storage.ref(`usuarios/${estudianteId}`);
    // Get the list of documents in the CURP folder

          console.log("hola"+estudianteRef)
          estudianteRef.child(`CURP.pdf`).listAll().subscribe(result => {
            result.items.forEach(item => {
              // Obtener el nombre del documento y agregarlo al array de documentos
              const nombreDocumento = item.name;
              this.documentos.push(nombreDocumento);
              console.log(nombreDocumento);
              this.botonGuardadoCurp=true;
            });
          });
          estudianteRef.child(`ACTA.pdf`).listAll().subscribe(result => {
            result.items.forEach(item => {
              // Obtener el nombre del documento y agregarlo al array de documentos
              const nombreDocumento = item.name;
              this.documentos.push(nombreDocumento);
              console.log(nombreDocumento);
              this.botonGuardadoActa = true;
            });
          });
          estudianteRef.child(`CERTIFICADO MEDICO.pdf`).listAll().subscribe(result => {
            result.items.forEach(item => {
              // Obtener el nombre del documento y agregarlo al array de documentos
              const nombreDocumento = item.name;
              this.documentos.push(nombreDocumento);
              console.log(nombreDocumento);
            });
          });
        }

  descargarArchivo(nombreDocumento: string): void {
    const estudianteId = this.data.estudianteId;
    const archivoRef = this.storage.ref(`usuarios/${estudianteId}/${nombreDocumento}/${nombreDocumento}`);
    archivoRef.getDownloadURL().subscribe((url) => {
      // Utiliza el URL para descargar el archivo
      window.open(url, '_blank');

    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
