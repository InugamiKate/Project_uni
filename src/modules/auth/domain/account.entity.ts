import { ACCOUNT_ROLES, AccountRole } from '../../../constants/constant';

export class AccountEntity {
  constructor(
    public readonly id: string,
    public username: string,
    public password: string,
    public role: AccountRole,
    public user_id: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  isAdmin(): boolean {
    return this.role === ACCOUNT_ROLES.ADMIN;
  }

  isUser(): boolean {
    return this.role === ACCOUNT_ROLES.USER;
  }
}
