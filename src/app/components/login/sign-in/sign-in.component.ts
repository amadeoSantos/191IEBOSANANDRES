import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavigationCancel, Router } from '@angular/router';
import * as auth from 'firebase/auth';
import { UserInterface } from '../../../shared/services/user';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  userData: any; // Guarda los datos del usuario conectado

  constructor(
      public afs: AngularFirestore, // Inyecta el servicio de Firestore
      public afAuth: AngularFireAuth, // Inyecta el servicio de autenticación de Firebase
      public router: Router // Servicio NgZone para eliminar advertencias fuera del alcance
  ) {
    /* Guardar datos de usuario en almacenamiento local cuando se inicia sesión
    y configurar a nulo cuando se cierra la sesión */
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

  // Iniciar sesión con Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.SetUserData(res.user);
      this.cancelPendingNavigation(); // Cancelar cualquier redirección pendiente
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          if (user.displayName === 'IEBO SAN ANDRES PAXTLAN') {
            this.router.navigateByUrl('menu-admi');
          } else {
            this.router.navigateByUrl('menu-student'); // Realizar la redirección deseada
          }
        }
      });
    });
  }

  // Cancelar redirección pendiente
  cancelPendingNavigation() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationCancel) {
        this.router.navigateByUrl(event.url); // Redirigir a la URL actual para cancelar la redirección pendiente
      }
    });
  }

  // Lógica de autenticación para ejecutar proveedores de autenticación
  AuthLogin(provider: any) {
    return this.afAuth
        .signInWithPopup(provider)
        .then((result) => {
          this.cancelPendingNavigation(); // Cancelar cualquier redirección pendiente
          this.afAuth.authState.subscribe((user) => {
            if (user) {
              if (user.displayName === 'IEBO SAN ANDRES PAXTLAN') {
                this.router.navigateByUrl('menu-admi');
              } else {
                this.router.navigateByUrl('menu-student'); // Realizar la redirección deseada
                this.SetUserData(result.user);
              }
            }
          });
        })
        .catch((error) => {
          window.alert(error);
        });
  }

  /* Configurar datos de usuario al iniciar sesión con correo/contraseña,
  registrarse con correo/contraseña e iniciar sesión con proveedor de autenticación social
  en la base de datos de Firestore usando los servicios AngularFirestore y AngularFirestoreDocument */
  SetUserData(user: any): Promise<void> {
    // Obtener una referencia al documento del usuario en la colección "users" utilizando el UID del usuario
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    // Crear un objeto userData con los datos relevantes del usuario
    const userData: UserInterface = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      roles: {
        estudiante: true,
      },
    };

     return userRef.set(userData, {merge: true});
  }

  /**
   * Inicia sesión utilizando el correo electrónico y la contraseña proporcionados.
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @returns Una promesa que indica si la operación de inicio de sesión fue exitosa.
   */
  SignIn(email: string, password: string): Promise<void> {
    // Establecer la persistencia de sesión en "none" (no mantener la sesión después del cierre del navegador)

    // Iniciar sesión con el correo y la contraseña proporcionados
    // utilizando el método signInWithEmailAndPassword() de AngularFireAuth
    return this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.SetUserData(result.user);
          this.afAuth.authState.subscribe((user) => {
            if (user) {
              this.router.navigate(['menu-student']); // Redirigir al usuario a la página "menu-student"
            }
          });
        })
        .catch((error) => {
          window.alert(error.message); // Mostrar una alerta con el mensaje de error en caso de que la promesa sea rechazada
        });
  }
}

