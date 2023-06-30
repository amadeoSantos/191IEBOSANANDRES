import { Component } from '@angular/core';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from "../../../shared/services/auth.service";
import {OnlyNumberDirective} from "../../../shared/only-number.directive";


@Component({
  selector: 'app-document-record',
  templateUrl: './document-record.component.html',
  styleUrls: ['./document-record.component.css'],
  providers: [OnlyNumberDirective]
})
export class DocumentRecordComponent {
  usuario: any = {}; // Objeto para almacenar los datos del usuario
  nombre: any;
  telefono: any;
  grupo: any;
  usuariosCollection: AngularFirestoreCollection<any>;

  constructor(
      public usuarioService: UsuarioService,
      public authservice: AuthService,
      private firestore: AngularFirestore,
      private afAuth: AngularFireAuth,
  ) {
    this.usuariosCollection = this.firestore.collection('estudiantes');
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  actualizarDatos(usuario: any) {
    if (usuario.grupo === "101" || usuario.grupo === "102") {
      usuario.semestre = "Primer";
    } else if (usuario.grupo === "201" || usuario.grupo === "202") {
      usuario.semestre = "Segundo";
    } else if (usuario.grupo === "301" || usuario.grupo === "302") {
      usuario.semestre = "Tercero";
    } else if (usuario.grupo === "401" || usuario.grupo === "402") {
      usuario.semestre = "Cuarto";
    } else if (usuario.grupo === "501" || usuario.grupo === "502") {
      usuario.semestre = "Quinto";
    } else if (usuario.grupo === "601" || usuario.grupo === "602") {
      usuario.semestre = "Sexto";
    }

    this.usuariosCollection
        .doc(usuario.id)
        .update({
          matricula: usuario.matricula,
          telefono: usuario.telefono,
          grupo: usuario.grupo,
          semestre: usuario.semestre,
          sexo: usuario.sexo,
          nombreTutor: usuario.nombreTutor,
          telefonoTutor: usuario.telefonoTutor,
        })
        .then(() => {
          console.log('Datos actualizados correctamente');
        })
        .catch((error) => {
          console.error('Error al actualizar los datos:', error);
        });
  }
  validarTexto(event: KeyboardEvent) {
    const pattern = /[a-zA-Z]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  mostrarModal = false;
  userData: any;

  abrirModal() {
    this.ngOnInit();
  }


  ngOnInit() {
    // Suscribirse al estado de autenticación del usuario
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // Obtener una referencia al documento del usuario en la colección "usuarios"
        const usuarioRef = this.firestore
            .collection('estudiantes')
            .doc(user.uid);

        // Obtener los datos del usuario
        usuarioRef.get().subscribe((doc) => {
          if (doc.exists) {
            // Asignar los datos del usuario al objeto "usuario"
            this.usuario = doc.data();
            this.usuarioService.setMostrarCampos(true);
            this.mostrarModal = false;
          } else {
            this.usuarioService.setMostrarCampos(false);
            this.mostrarModal = true;
          }
        });
      }
    });
  }

  get mostrarCampos(): boolean {
    return this.usuarioService.getMostrarCampos();
  }
}
