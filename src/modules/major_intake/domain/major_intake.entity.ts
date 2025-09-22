export class MajorIntake {
  id: string;
  major_id: string;
  intake: string;
  head_teacher_id: string | null;
  total_weight: number;
  description: string;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  created_by: string | null;
  updated_by: string | null;
}