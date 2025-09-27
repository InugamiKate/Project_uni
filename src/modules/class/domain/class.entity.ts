export class Course {
  id: string;
  course_id: string;
  semester_id: string;
  major_id: string;
  lecturer_id: string;
  name: string;
  plain_name: string;
  description: string;
  location: string | null;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  created_by: string | null;
  updated_by: string | null;
}