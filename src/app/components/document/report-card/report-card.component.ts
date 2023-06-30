import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {AngularFireStorage} from "@angular/fire/compat/storage";


interface Estudiante {
  semestre: number;
}
@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.css'],
})
export class ReportCardComponent implements OnInit{
  fileURL!: SafeResourceUrl | null;
  userId!: string;
  opcionesSemestres: number[] = [];
  existeBoleta!:boolean;

  constructor(private afAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              private storage: AngularFireStorage,
              private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.obtenerOpcionesSemestres();
      }
    });
  }
  private semestreActualN!: number;
  obtenerOpcionesSemestres(): void {
    // Suscribe al estado de autenticación para obtener el usuario actual
    const user = this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userId = user.uid; // Obtiene el ID del usuario autenticado
        const estudianteRef = this.firestore.collection('estudiantes').doc(userId); // Obtiene la referencia al documento del estudiante actual
        // Obtiene el documento del estudiante actual
        estudianteRef.get().subscribe((snapshot) => {
          const estudiante = snapshot.data() as any; // Obtiene los datos del documento del estudiante
          if (estudiante && estudiante.semestre) {
            const semestreActual = estudiante.semestre;// Obtiene el semestre actual del estudiante
            if (semestreActual === "Primer") {this.semestreActualN = 1;}
            else if(semestreActual==="Segundo"){this.semestreActualN = 2;}
            else if(semestreActual==="Tercero"){this.semestreActualN = 3;}
            else if(semestreActual==="Cuarto"){this.semestreActualN = 4;}
            else if(semestreActual==="Quinto"){this.semestreActualN = 5;}
            else if(semestreActual==="Sexto"){this.semestreActualN = 6;}
            this.opcionesSemestres = []; // Reinicia las opciones de semestre
            // Genera las opciones de semestre hasta el semestre actual
            for (let i = 1; i <= this.semestreActualN; i++) {
              this.opcionesSemestres.push(i);
            }
          } else {
            this.opcionesSemestres = []; // No hay información de semestre, reinicia las opciones
          }
        });
      }
    });
  }
  // Resto del código del componente...
  semestreSeleccionado: any;
  onSemestreChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.semestreSeleccionado = target.value;
    if (this.semestreSeleccionado==="1"){
      this.semestreSeleccionado="Primer"
    }
    else if (this.semestreSeleccionado==="2"){
      this.semestreSeleccionado="Segundo"
    }
    else if(this.semestreSeleccionado==="3"){
      this.semestreSeleccionado="Tercer"
    }
    else if(this.semestreSeleccionado==="4"){
      this.semestreSeleccionado="Cuarto"
    }
    else if(this.semestreSeleccionado==="5"){
      this.semestreSeleccionado="Quinto"
    }
    else if(this.semestreSeleccionado==="6"){
      this.semestreSeleccionado="Sexto"
    }
    console.log(this.semestreSeleccionado)
    this.obtenerURLDescargaArchivo();
  }
  async downloadFile(): Promise<void> {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        const userId = user.uid;
        const filePath = `boletas/${userId}/${this.semestreSeleccionado}/boleta.pdf`;
        const fileRef = this.storage.ref(filePath);

        fileRef.getDownloadURL().subscribe((downloadURL: string) => {
          // El documento existe, iniciar la descarga
          const fileLink = document.createElement('a');
          fileLink.href = downloadURL;
          fileLink.download = 'boleta.pdf';
          fileLink.target = '_blank';
          fileLink.click();
        }, (error: any) => {
          console.error('El documento no existe:', error);
          // Manejar el caso en el que el documento no existe, mostrar un mensaje de error, etc.
        });
      }
    });
  }
  async obtenerURLDescargaArchivo(): Promise<void> {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        const userId = user.uid;
        const filePath = `boletas/${userId}/${this.semestreSeleccionado}/boleta.pdf`;
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

    });
  }
}
