import { Component } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-staff-record',
  templateUrl: './staff-record.component.html',
  styleUrls: ['./staff-record.component.css'],
})
export class StaffRecordComponent {
    nombrePersonal!: string;
    apellidoPersonal!: string;
    telefonoPersonal!: string;
    sexoPersonal!: string;
    fechaNacimientoPersonal!: string;
    rfcPersonal!: string;
    correoPersonal!: string;
    passwordPersonal!: string;
    puestoPersonal!: string;
    showPassword: boolean = false;


    constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore,private snackBar: MatSnackBar) {}

    guardarDatos(
        nombrePersonal: string,
        apellidoPersonal: string,
        telefonoPersonal: string,
        sexoPersonal: string,
        fechaNacimientoPersonal: string,
        rfcPersonal: string,
        correoPersonal: string,
        passwordPersonal: string,
        puestoPersonal: string
    ) {
        // Establecer la persistencia de sesión en "none"
        this.afAuth.setPersistence(firebase.auth.Auth.Persistence.NONE)
            .then(() => {
                // Crear el usuario con el correo y contraseña proporcionados
                return this.afAuth.createUserWithEmailAndPassword(correoPersonal, passwordPersonal);
            })
            .then((userCredential) => {
                if (userCredential && userCredential.user) {
                    const personalCollection = this.firestore.collection('docente');
                    personalCollection.add({
                        nombre: nombrePersonal,
                        apellido: apellidoPersonal,
                        telefono: telefonoPersonal,
                        sexo: sexoPersonal,
                        fechaNacimiento: fechaNacimientoPersonal,
                        rfc: rfcPersonal,
                        correo: correoPersonal,
                        userId: userCredential.user.uid, // Asociar el ID del usuario
                        puesto: puestoPersonal,
                    })
                        .then(() => {
                            console.log('Datos guardados exitosamente en Firestore');

                            this.snackBar.open('¡Datos guardados correctamente!', 'Cerrar', {
                                duration: 3000, // Duración del mensaje en milisegundos
                            });

                            // Limpiar los campos
                            // Puedes asignar cadenas vacías a las variables utilizadas en los campos de entrada
                            this.nombrePersonal = '';
                            this.apellidoPersonal = '';
                            this.telefonoPersonal = '';
                            this.sexoPersonal = '';
                            this.fechaNacimientoPersonal = '';
                            this.rfcPersonal = '';
                            this.correoPersonal = '';
                            this.passwordPersonal = '';
                            this.puestoPersonal = '';

                            // Otras acciones adicionales después de guardar los datos

                        })
                        .catch((error) => {
                            console.error('Error al guardar los datos en Firestore: ', error);
                            // Aquí puedes manejar el error de guardar los datos si es necesario
                        });
                } else {
                    console.error('El objeto userCredential o user es nulo');
                }
            })
            .catch((error) => {
                console.error('Error al crear la cuenta de usuario: ', error);
                // Aquí puedes manejar el error de creación de cuenta de usuario si es necesario
            });
    }
    validarTelefono(telefono: string) {
        // Remover espacios en blanco y guiones del número telefónico
        const cleanedTelefono = telefono.replace(/\s/g, '').replace(/-/g, '');

        // Validar que el número tenga 10 dígitos
        const pattern = /^\d{10}$/;
        return pattern.test(cleanedTelefono);
    }
    validarTexto(event: KeyboardEvent) {
        const inputChar = String.fromCharCode(event.keyCode);

        // Expresión regular para permitir solo caracteres de texto
        const pattern = /[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/;

        if (!pattern.test(inputChar)) {
            // Si el carácter no es un texto válido, se cancela el evento
            event.preventDefault();
        }
    }

    validarRFC(rfc: string) {
        const pattern = /^[a-zA-Z]{3,4}[0-9]{6}[a-zA-Z0-9]{3}$/;
        return pattern.test(rfc);
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
}

