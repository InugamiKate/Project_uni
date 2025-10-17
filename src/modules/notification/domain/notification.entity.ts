export class Notification {
  id: string;
  title: string;
  content: string;
  object_type: string;
  object_id: string;
  created_at: Date;
  updated_at: Date;
  created_by: string | null;
  updated_by: string | null;
}