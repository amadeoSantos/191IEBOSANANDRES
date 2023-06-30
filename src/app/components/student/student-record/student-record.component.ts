import { Component, EventEmitter,Output } from '@angular/core';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {OnlyNumberDirective} from "../../../shared/only-number.directive";

@Component({
    selector: 'app-student-record',
    templateUrl: './student-record.component.html',
    styleUrls: ['./student-record.component.css'],
    providers: [OnlyNumberDirective]
})
export class StudentRecordComponent {
  @Output() cerrarModalEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() cerrarbutton: EventEmitter<void> = new EventEmitter<void>();
  nombre: any;
  email: any;
  matricula: any;
  telefono: any;
  grupo: any;
  semestre: any;
  sexo: any;
  nombreTutor: any;
  telefonoTutor: any;
  matricul: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public usuarioService: UsuarioService,

  ) {}

  closeModal() {
    this.cerrarModalEvent.emit();
      location.reload();
  }

  guardarDatos(
    matricula: string,
    telefono: string,
    grupo: string,
    sexo: string,
    nombreTutor: string,
    telefonoTutor: string
  ) {
    this.afAuth.authState.subscribe((user) => {
        let semestre;
        if (user) {
            const userId = user.uid;

            if (grupo === "101" || grupo === "102") {
                semestre = "Primer"
            } else if (grupo === "201" || grupo === "202") {
                semestre = "Segundo"
            } else if (grupo === "301" || grupo === "302") {
                semestre = "Tercero"
            } else if (grupo === "401" || grupo === "402") {
                semestre = "Cuarto"
            } else if (grupo === "501" || grupo === "502") {
                semestre = "Quinto"
            } else if (grupo === "601" || grupo === "602") {
                semestre = "Sexto"
            }

            this.afs
                .collection('estudiantes')
                .doc(userId)
                .set({

                    id: user.uid,
                    nombre: user.displayName,
                    matricula: matricula,
                    correo: user.email,
                    telefono: telefono,
                    grupo: grupo,
                    semestre: semestre,
                    sexo: sexo,
                    nombreTutor: nombreTutor,
                    telefonoTutor: telefonoTutor,
                })
                .then(() => {
                    console.log('Datos guardados correctamente');
                    this.closeModal();
                    this.usuarioService.setMostrarCampos(true);
                    location.reload();
                })
                .catch((error) => {
                    console.error('Error al guardar los datos:', error);
                });
        }
    });
  }

    validarTexto(event: KeyboardEvent) {
        const pattern = /[a-zA-Z]/;
        const inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
}
