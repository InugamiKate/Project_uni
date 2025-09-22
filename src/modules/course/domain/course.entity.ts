export class Course {
  id: string;
  major_id: string;
  name: string;
  plain_name: string;
  weight: number;
  description: string;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  created_by: string | null;
  updated_by: string | null;
}