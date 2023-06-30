import {Component, Inject, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";


import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSnackBar} from "@angular/material/snack-bar";

interface Materia {
  nombre: string;
  selected: boolean;
}
@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.scss']
})
export class AsignaturasComponent implements OnInit {
  cicloEscolarSeleccionado!: string;


  semestres: string[] = ['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4', 'Semestre 5', 'Semestre 6'];

  materiasSemestre1: Materia[] = [
    { nombre: 'Matemáticas I', selected: false },
    { nombre: 'Química I', selected: false },
    { nombre: 'Ética y Valores I', selected: false },
    { nombre: 'Metodología de Investigación', selected: false },
    { nombre: 'Taller de Lectura y Redacción', selected: false },
    { nombre: 'Inglés', selected: false },
    { nombre: 'Informática', selected: false }
  ];

  materiasSemestre2: Materia[] = [
    { nombre: 'Matemáticas II', selected: false },
    { nombre: 'Química II', selected: false },
    { nombre: 'Ética y Valores II', selected: false },
    { nombre: 'Ciencias Sociales', selected: false },
    { nombre: 'Taller de Lectura y Redacción II', selected: false },
    { nombre: 'Inglés II', selected: false },
    { nombre: 'Informática II', selected: false }
  ];

  materiasSemestre3: Materia[] = [
    { nombre: 'Matemáticas III', selected: false },
    { nombre: 'Física I', selected: false },
    { nombre: 'Biología I', selected: false },
    { nombre: 'Literatura I', selected: false },
    { nombre: 'Historia de México I', selected: false },
    { nombre: 'Inglés III', selected: false }
  ];

  materiasSemestre4: Materia[] = [
    { nombre: 'Matemáticas IV', selected: false },
    { nombre: 'Física II', selected: false },
    { nombre: 'Biología II', selected: false },
    { nombre: 'Literatura II', selected: false },
    { nombre: 'Historia de México II', selected: false },
    { nombre: 'Inglés IV', selected: false }
  ];

  materiasSemestre5: Materia[] = [
    { nombre: 'Cálculo', selected: false },
    { nombre: 'Geografía', selected: false },
    { nombre: 'Estructura Socioeconómica', selected: false },
    { nombre: 'Temas Selectos de Salud I', selected: false },
    { nombre: 'Administración I', selected: false },
    { nombre: 'Lógica', selected: false }
  ];

  materiasSemestre6: Materia[] = [
    { nombre: 'Ecología y Medio Ambiente', selected: false },
    { nombre: 'Fisiología', selected: false },
    { nombre: 'Historia Universal', selected: false },
    { nombre: 'Probabilidad y Estadística', selected: false },
    { nombre: 'Temas Selectos de Salud II', selected: false },
    { nombre: 'Administración II', selected: false },
    { nombre: 'Estética', selected: false }
  ];
  semestreSeleccionado!: string;

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: { idDocente: string },
      private firestore: AngularFirestore,
      public dialogRef: MatDialogRef<AsignaturasComponent>,
      private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}
  onSemestreChange(): void {
    console.log('ID del docente:', this.data.idDocente);

    // Obtén el ciclo escolar y el semestre seleccionados
    const cicloEscolar = this.cicloEscolarSeleccionado;
    const semestre = this.semestreSeleccionado;
    console.log(cicloEscolar);
    console.log(semestre);
    // Verifica si se ha seleccionado un ciclo escolar y un semestre
    if (cicloEscolar && semestre) {
      console.log('ID del docente:'+ cicloEscolar + semestre);
      // Obtén la referencia al documento correspondiente en Firebase
      const docRef = this.firestore.collection('asignatura').doc(this.data.idDocente).collection(cicloEscolar).doc(semestre);

      // Obtén los datos del documento
      docRef.get().subscribe((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data) {
            const materiasRegistradas: Materia[] = data['materias'];

            // Marca las materias como seleccionadas en los checkboxes correspondientes
            this.marcarMateriasSeleccionadas(materiasRegistradas);
          }
        }
      });
    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  guardarAsignatura() {
    // Obtén el ID del usuario actual
    const userID = this.data.idDocente; // Aquí debes obtener el ID del usuario, por ejemplo, desde el servicio de autenticación
    console.log('Información'+this.data.idDocente);
    // Obtén el ciclo escolar y el semestre seleccionados
    const cicloEscolar = this.cicloEscolarSeleccionado;
    const semestre = this.semestreSeleccionado;
    // Obtén las materias seleccionadas según el semestre
    let materiasSeleccionadas: Materia[] = [];
    if (semestre === 'semestre1') {
      materiasSeleccionadas = this.materiasSemestre1.filter(materia => materia.selected);
    } else if (semestre === 'semestre2') {
      materiasSeleccionadas = this.materiasSemestre2.filter(materia => materia.selected);
    }else if (semestre==='semestre3'){
      materiasSeleccionadas=this.materiasSemestre3.filter(materia => materia.selected);
    }else if (semestre==='semestre4'){
      materiasSeleccionadas=this.materiasSemestre4.filter(materia => materia.selected);
    }else if (semestre==='semestre5'){
      materiasSeleccionadas=this.materiasSemestre5.filter(materia => materia.selected );
    }else if (semestre==='semestre6'){
      materiasSeleccionadas=this.materiasSemestre6.filter(materia => materia.selected);
    }
    // Repite el patrón para los demás semestres
    console.log(userID)
    // Guarda la información en la colección "asignatura" de Firebase
    this.firestore.collection('asignatura').doc(userID).collection(cicloEscolar).doc(semestre).set({
      materias: materiasSeleccionadas
    })
        .then(() => {
          console.log('Información guardada correctamente');
          this.snackBar.open('Información guardada correctamente', 'Cerrar', { duration: 3000 });
        })
        .catch((error) => {
          console.error('Error al guardar la información:', error);
        });
  }

  marcarMateriasSeleccionadas(materiasRegistradas: Materia[]) {
    this.materiasSemestre1.forEach((materia) => {
      materia.selected = materiasRegistradas.some((m) => m.nombre === materia.nombre);
    });

    this.materiasSemestre2.forEach((materia) => {
      materia.selected = materiasRegistradas.some((m) => m.nombre === materia.nombre);
    });

    this.materiasSemestre3.forEach((materia) => {
      materia.selected = materiasRegistradas.some((m) => m.nombre === materia.nombre);
    });

    this.materiasSemestre4.forEach((materia) => {
      materia.selected = materiasRegistradas.some((m) => m.nombre === materia.nombre);
    });

    this.materiasSemestre5.forEach((materia) => {
      materia.selected = materiasRegistradas.some((m) => m.nombre === materia.nombre);
    });

    this.materiasSemestre6.forEach((materia) => {
      materia.selected = materiasRegistradas.some((m) => m.nombre === materia.nombre);
    });
  }
}

