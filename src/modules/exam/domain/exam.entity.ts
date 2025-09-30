export class Course {
  id: string;
  course_id: string;
  semester_id: string;
  major_id: string;
  class_id: string | null;
  name: string;
  plain_name: string;
  date: string;
  place: string | null;
  status: string;
  regist_status: string;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  created_by: string | null;
  updated_by: string | null;
}