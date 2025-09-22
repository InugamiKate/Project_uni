export class User {
  id: string;
  name: string;
  plain_name: string;
  birthday?: string;
  phone?: string;
  email: string;
  role?: string;
  code?: string;
  sex?: string;
  address?: string;
  major_id?: string;
  mi_id?: string;
  is_graduated: boolean;
  is_student: boolean;
  active: boolean;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}