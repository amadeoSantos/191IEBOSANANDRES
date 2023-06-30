import {Component, Inject, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "../../../shared/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {DocumentModalComponent} from "../../document/document-modal/document-modal.component";
import {ReportCardRecordComponent} from "../../document/report-card-record/report-card-record.component";

interface Estudiante {
  id: string;
  correo: string;
  grupo: string;
  matricula: string;
  nombre: string;
  semestre: number;
  sexo: string;
}
@Component({
  selector: 'app-student-query',
  templateUrl: './student-query.component.html',
  styleUrls: ['./student-query.component.css'],
})
export class StudentQueryComponent implements OnInit {
  estudiantes: any[] = [];
  terminoBusqueda: string = '';
  resultadosFiltrados: any[] = [];

  constructor(public authService: AuthService, private firestore: AngularFirestore, private dialog: MatDialog)
              {}

  ngOnInit() {
    this.firestore.collection('estudiantes').get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Obtener los datos de cada documento
        const estudiante = doc.data() as Estudiante;
        // Realizar las operaciones deseadas con los datos del estudiante
        this.resultadosFiltrados.push(estudiante);
        console.log(estudiante.nombre, estudiante.semestre);
      });
    });
    this.resultadosFiltrados = this.estudiantes;
  }

  filtrarEstudiantes(): void {
    if (!this.terminoBusqueda) {
      this.resultadosFiltrados = this.estudiantes;
    } else {
      this.resultadosFiltrados = this.estudiantes.filter((estudiante) => {
        return (
            estudiante.matricula.includes(this.terminoBusqueda) ||
            estudiante.grupo.includes(this.terminoBusqueda) ||
            estudiante.semestre.includes(this.terminoBusqueda)
        );
      });
    }
  }

  boletasCalificacion(estudianteId: string): void {
    if (estudianteId) {
      const dialogRef = this.dialog.open(ReportCardRecordComponent, {
        width: '900px',
        data: {estudianteId: estudianteId} // Pasar el ID del estudiante como dato
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('Comentario guardado', result);
      });
    }
  }
  openDocumentosModal(estudianteId: string): void {
    if (estudianteId) {
            const dialogRef = this.dialog.open(DocumentModalComponent, {
              width: '400px',
              data: {estudianteId: estudianteId} // Pasar el ID del estudiante como dato
            });
            dialogRef.afterClosed().subscribe(result => {
              console.log('Comentario guardado', result);
            });
    }
  }
}

