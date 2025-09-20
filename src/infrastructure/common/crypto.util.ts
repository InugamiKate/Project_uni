import * as bcrypt from 'bcrypt';
import { config } from '../../config/config';

//saltRounds là số vòng lặp để tăng độ phức tạp khi hash
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, config.hashSaltRounds);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
