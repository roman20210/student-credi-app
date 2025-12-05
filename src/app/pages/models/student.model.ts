import { StudentSubject } from "./student.subject,model";

export interface Student {
  id?: number;
  name?: string;
  studentSubjects?: StudentSubject[];
}
