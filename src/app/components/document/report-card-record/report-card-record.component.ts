import {Component, Inject, OnInit ,ViewChild, TemplateRef} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
@Component({
    selector: 'app-report-card-record',
    templateUrl: './report-card-record.component.html',
    styleUrls: ['./report-card-record.component.scss']
})

export class ReportCardRecordComponent implements OnInit {
    estudianteId: string;
    selectedSemestre!: string;
    uploadProgress: number = 0;
    isDocumentAvailable: boolean = false;
    fileURL!: SafeResourceUrl | null;
    semestreActual: string = ''; // Semestre actual obtenido en formato de texto
    semestres: string[] = []; // Arreglo de nombres de semestres
    existeBoleta!:boolean;

    @ViewChild('noArchivoUploaded') noArchivoUploadedTemplate: TemplateRef<any>

    constructor(
        private firestore: AngularFirestore,

        @Inject(MAT_DIALOG_DATA) public data: { estudianteId: string },
        private storage: AngularFireStorage,
        private sanitizer: DomSanitizer
    ) {
        this.estudianteId = data.estudianteId;
        this.noArchivoUploadedTemplate = {} as TemplateRef<any>;
    }


    ngOnInit(): void {
        this.obtenerSemestreEstudiante(this.estudianteId).subscribe(semestre => {
            if (semestre) {
                this.semestreActual = semestre;
                // Definir el arreglo con los nombres de los semestres hasta el valor obtenido
                const nombresSemestres = ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto', 'Sexto'];

                // Obtener el índice del semestre actual en el arreglo
                const indiceSemestreActual = nombresSemestres.indexOf(this.semestreActual);

                // Generar las opciones de semestres hasta el valor obtenido
                this.semestres = nombresSemestres.slice(0, indiceSemestreActual + 1);
            }
        });
    }

    obtenerSemestreEstudiante(idEstudiante: string): Observable<string> {
        return this.firestore
            .collection('estudiantes')
            .doc(idEstudiante)
            .valueChanges()
            .pipe(
                map(estudiante => (estudiante as { semestre: string })?.semestre || '')
            );
    }


// Método para manejar el evento de cambio en el select
    onSemestreChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedSemestre = target.value;
        this.uploadProgress = 0;
        this.obtenerURLDescargaArchivo();
    }

    async obtenerURLDescargaArchivo(): Promise<void> {
        const filePath = `boletas/${this.estudianteId}/${this.selectedSemestre}/boleta.pdf`;
        if (filePath) {
            this.existeBoleta = true;
            try {
                const fileRef = this.storage.ref(filePath);
                const downloadURL = await fileRef.getDownloadURL().toPromise();

                console.log('URL de descarga:', downloadURL);
                this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(downloadURL) as SafeResourceUrl;
                // Haz lo que necesites con la URL de descarga, como mostrarla en la interfaz de usuario o utilizarla para descargar el archivo.
            } catch (error) {
                console.error('Error al obtener URL de descarga:', error);
                this.fileURL = null; // Establece fileURL como null para ocultar el <iframe>
                this.existeBoleta = false;
            }
        } else {
            this.fileURL = null; // Establece fileURL como null para ocultar el <iframe>
            this.existeBoleta = false;
        }
}
    selectFile() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.click();
        }
    }

    uploadFile(event: any): void {
        const file = event.target.files[0]; // Obtener el archivo seleccionado
        // Generar una ruta única para almacenar el archivo en Firebase Storage
        const filePath = `boletas/${this.estudianteId}/${this.selectedSemestre}/${file.name}`;

        // Obtener una referencia al archivo en Firebase Storage
        const fileRef = this.storage.ref(filePath);

        // Subir el archivo a Firebase Storage
        const task = this.storage.upload(filePath, file);

        // Obtener el estado de la carga del archivo
        task.snapshotChanges().subscribe(
            (snapshot) => {
                if (snapshot) {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Progreso de carga: ', progress);
                    this.uploadProgress = progress;
                }
            },
            (error) => {
                console.log('Error al cargar el archivo: ', error);
            },
            () => {
                console.log('Archivo cargado correctamente');
                if (fileRef) {
                    fileRef.getDownloadURL().subscribe((downloadURL) => {
                        console.log('URL de descarga del archivo: ', downloadURL);
                        // Realiza las acciones necesarias con la URL de descarga
                        this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(downloadURL);
                        this.existeBoleta = true;
                    });
                }
            }
        );

    }

    async downloadFile(): Promise<void> {
        const filePath = `boletas/${this.estudianteId}/${this.selectedSemestre}/boleta.pdf`;
        const fileRef = this.storage.ref(filePath);

        try {
            const downloadURL = await fileRef.getDownloadURL().toPromise();

            // El documento existe, iniciar la descarga
            const fileLink = document.createElement('a');
            fileLink.href = downloadURL;
            fileLink.download = 'boleta.pdf';
            fileLink.target = '_blank';
            fileLink.click();
        } catch (error) {
            console.error('El documento no existe:', error);
            // Manejar el caso en el que el documento no existe, mostrar un mensaje de error, etc.
        }
    }


}
