import {Component} from '@angular/core';
import { map } from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import { AsignaturasComponent } from "../../asignaturas/asignaturas.component";
import 'firebase/compat/firestore';
import { MatDialog} from "@angular/material/dialog";

interface Persona {
  nombre: string;
  apellido: string;
  telefono: string;
  sexo: string;
  fechaNacimiento: string;
  rfc: string;
  correo: string;
  puesto: string;
  id: string;

}

@Component({
  selector: 'app-staff-query',
  templateUrl: './staff-query.component.html',
  styleUrls: ['./staff-query.component.css'],
})
export class StaffQueryComponent {
    semestreSeleccionado!: string;

  personalCollection: AngularFirestoreCollection<Persona>;
  personalList: Observable<Persona[]>;


  constructor(
      private firestore: AngularFirestore,
      private dialog: MatDialog) {

    this.personalCollection = this.firestore.collection<Persona>('docente');
    this.personalList = this.personalCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { ...data, id };
          });
        })
    );

  }
  openAsignaturaModal(idDocente: string): void {
    const dialogRef = this.dialog.open(AsignaturasComponent, {
      width: '600px',
      data: { idDocente: idDocente }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Comentario guardado', result);
    });
  }

  eliminarDocente(idDocente: string): void {
    // Verifica si se ha proporcionado un ID de docente
    if (idDocente) {
      // Elimina el documento de la colección "docente" según su ID
      this.firestore.collection('docente').doc(idDocente).delete()
          .then(() => {
            console.log('Docente eliminado correctamente');
            console.log(idDocente)
            // Realiza las acciones adicionales después de eliminar el docente si es necesario
              this.semestreSeleccionado=="2023"

          })
          .catch((error) => {
            console.error('Error al eliminar el docente:', error);
          });
    } else {
      console.log('No se ha proporcionado un ID de docente');
    }
  }

    eliminarAsignatura(idDocente: string, cicloEscolar: string, semestre: string): void {
        // Verifica si se ha proporcionado un ID de docente, ciclo escolar y semestre
        if (idDocente && cicloEscolar && semestre) {
            // Elimina el documento de la colección "asignatura" según el ID del docente, ciclo escolar y semestre
            this.firestore.collection('asignatura').doc(idDocente).collection(cicloEscolar).doc(semestre).delete()
                .then(() => {
                    console.log('Asignatura eliminada correctamente');
                    // Realiza las acciones adicionales después de eliminar la asignatura si es necesario
                })
                .catch((error) => {
                    console.error('Error al eliminar la asignatura:', error);
                });
        } else {
            console.log('No se han proporcionado todos los datos necesarios para eliminar la asignatura');
        }
    }

}



