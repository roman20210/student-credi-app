import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { AvailableSubject } from '../models/avaliable-subject.model';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    getAvailableSubjects(studentId: number) {
        return this.http.get<AvailableSubject[]>(`https://localhost:7255/api/StudentSubjects/available/${studentId}`);
    }

    enrollSubjects(studentId: number, subjectIds: number[]) {
        return this.http.post(
            `https://localhost:7255/api/StudentSubjects/enroll`,
            { studentId, subjectIds },
            { responseType: 'text' }
        );
    }


    private apiUrl = 'https://localhost:7255/api/Student';

    constructor(private http: HttpClient) { }

    getStudentById(id: number): Observable<Student> {
        return this.http.get<Student>(`${this.apiUrl}/${id}`);
    }

    createStudent(student: Student): Observable<Student> {
        return this.http.post<Student>(this.apiUrl, student);
    }
    getOtherStudents(studentId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/${studentId}/others`);
    }

    getClassmatesBySubject(subjectId: number, studentId: number) {
        return this.http.get<any[]>(`https://localhost:7255/api/StudentSubjects/${subjectId}/classmates/${studentId}`);
    }

}
