import { Component } from '@angular/core';
import { AvailableSubject } from '../models/avaliable-subject.model';
import { StudentService } from '../Services/student.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  studentId!: number;
  studentName!: string;
  studentNotFound = false;
  canEnroll = true;
  showMenu = false;
  showEnrollForm = false;
  showCreateForm = false;
  showRegisteredForm = false;
  availableSubjects: AvailableSubject[] = [];
  selectedSubjects: AvailableSubject[] = [];

  constructor(private studentService: StudentService) { }

  checkStudent() {
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (student) => {

        this.studentNotFound = false;
        this.showMenu = true;

        const yaInscritas = student.studentSubjects?.length ?? 0;

        if (yaInscritas >= 3) {
          alert("Ya tienes las 3 materias inscritas. No puedes inscribir más.");

          this.canEnroll = false;
          this.showEnrollForm = false;

          return;
        }

        this.canEnroll = true;
      },

      error: () => {
        this.studentNotFound = true;
        this.showMenu = false;
        this.showEnrollForm = false;
      }
    });
  }

  //  metodo para crear estudiante
  createStudent() {
    if (!this.studentName) {
      alert('Ingresa un nombre');
      return;
    }

    this.studentService.createStudent({ name: this.studentName }).subscribe({
      next: (student) => {
        alert('Estudiante creado correctamente con ID ' + student.id);
        this.studentName = '';
        this.showCreateForm = false;
        this.showMenu = true;
        this.studentId = student.id!;
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear estudiante');
      }
    });
  }

  loadAvailableSubjects() {
    if (!this.canEnroll) return;

    this.studentService.getAvailableSubjects(this.studentId).subscribe({
      next: (subjects) => {
        this.availableSubjects = subjects;
        this.selectedSubjects = [];
        this.showEnrollForm = true;
      },
      error: (err) => console.error(err)
    });
  }
  toggleSelectionFromEvent(subject: AvailableSubject, checked: boolean) {
    if (!checked) {
      subject.selected = false;
      this.selectedSubjects = this.availableSubjects.filter(s => s.selected);
      return;
    }

    if (this.selectedSubjects.length >= 3) {
      alert('Solo puedes seleccionar máximo 3 materias');
      return;
    }

    const profesorYaSeleccionado = this.selectedSubjects.some(s => s.professorName === subject.professorName);
    if (profesorYaSeleccionado) {
      alert('No puedes seleccionar más de una materia del mismo profesor');
      return;
    }

    subject.selected = true;
    this.selectedSubjects = this.availableSubjects.filter(s => s.selected);
  }

  isDisabled(subject: AvailableSubject): boolean {
    if (subject.selected) return false;

    if (this.selectedSubjects.length >= 3) return true;

    if (this.selectedSubjects.some(s => s.professorName === subject.professorName)) return true;

    return false;
  }
  enrollSubjects() {
    if (this.selectedSubjects.length === 0) {
      alert('Selecciona al menos una materia');
      return;
    }

    const subjectIds = this.selectedSubjects.map(s => s.subjectId);

    this.studentService.enrollSubjects(this.studentId, subjectIds).subscribe({
      next: (res) => {
        alert(res);
        this.showEnrollForm = false;
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || JSON.stringify(err.error) || 'Error al inscribir materias');
      }
    });
  }

}