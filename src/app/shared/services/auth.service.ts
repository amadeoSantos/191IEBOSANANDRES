import { Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";

import {UserInterface} from "./user";
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import User = firebase.User;

@Injectable({
  providedIn: 'root',
})

export class AuthService  {
  userData: any; // Save logged in user data

  constructor(
      public afs: AngularFirestore, // Inject Firestore service
      public afAuth: AngularFireAuth, //Inyectar el servicio de autenticación de Firebase
      public router: Router,
  ) {
    /* Guardar datos de usuario en almacenamiento local cuando
     iniciado sesión y configuración nula cuando se cierra la sesión */
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

  SendVerificationMail() {
    return this.afAuth.currentUser
        .then((u: any) => u.sendEmailVerification())
        .then(() => {
          this.router.navigate(['Confirme su dirección de correo electrónico']);
        });
  }

  // Reset  password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
        .sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
          window.alert(
              'Correo electrónico de restablecimiento de contraseña enviado, verifique su bandeja de entrada.'
          );
        })
        .catch((error) => {
          window.alert(error);
        });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
  getCurrentUser(): Observable<User | null> {
    return this.afAuth.authState;
  }
}
