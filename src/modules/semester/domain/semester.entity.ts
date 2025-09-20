export class Semester {
  id: string;
  mid: string;
  name: string;
  plain_name: string;
  start_date: String;
  end_date: String;
  course_num: number;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  created_by: string | null;
  updated_by: string | null;
}