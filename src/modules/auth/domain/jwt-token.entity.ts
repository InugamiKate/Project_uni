import { TOKEN_TYPES, TokenType } from '../../../constants/constant';

export class JwtTokenEntity {
  constructor(
    public readonly id: string,
    public accountId: string,
    public token: string,
    public type: TokenType,
    public active: boolean,
    public expires_at: Date,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  isExpired(): boolean {
    return this.expires_at.getTime() < Date.now();
  }

  isRefresh(): boolean {
    return this.type === TOKEN_TYPES.REFRESH;
  }

  isAccess(): boolean {
    return this.type === TOKEN_TYPES.ACCESS;
  }
}
