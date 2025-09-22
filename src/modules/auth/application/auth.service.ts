import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { comparePassword } from '../../../infrastructure/common/crypto.util';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../../infrastructure/common/jwt.util';
import { ACCOUNT_ROLES } from '../../../constants/constant';
import { AccountEntity } from '../domain/account.entity';
import { config } from '../../../config/config';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(username: string, password: string) {
    const account = await this.prisma.account.findUnique({ where: { username: username } });
    if (!account) throw new UnauthorizedException('Invalid username');

    const user = await this.prisma.user.findUnique({ where: { id: account.user_id, deleted: false } });
    if (!user) throw new UnauthorizedException('User not found');

    // kiểm tra password
    const valid = await comparePassword(password, account.password);
    if (!valid) {

      if (account.re_password) {
        // kiểm tra re_password (trường hợp đổi mật khẩu)
        const re_valid = await comparePassword(password, account.re_password);
        if (!re_valid) throw new UnauthorizedException('Invalid password');

        // nếu đúng thì cập nhật lại password chính và xóa re_password
        await this.prisma.account.update({ where: { id: account.id }, data: { password: account.re_password, re_password: null } });
      } else {
        throw new UnauthorizedException('Invalid password');
      }
    }

    // wrap thành entity
    const accountEntity = new AccountEntity(
      account.id,
      account.username,
      account.password,
      account.role as any,
      account.user_id,
      account.created_at,
      account.updated_at,
    );

    const accessToken = signAccessToken({
      uid: account.user_id,
      account_role: account.role,
      user_role: user.role,
      major_id: user.major_id ? user.major_id : null,
    });
    const refreshToken = signRefreshToken({ accountId: account.id });

    // lưu refresh token vào DB
    await this.prisma.jwtToken.create({
      data: {
        account_id: account.id,
        token: refreshToken,
        type: 'REFRESH',
        active: true,
        expires_at: new Date(Date.now() + config.jwt.refreshExpire), // ví dụ 1 ngày
      },
    });

    return { accessToken, refreshToken, account: accountEntity };
  }

  async refresh(refreshToken: string) {
    const decoded = verifyRefreshToken<{ accountId: string }>(refreshToken);
    if (!decoded) throw new UnauthorizedException('Invalid refresh token');

    const tokenInDb = await this.prisma.jwtToken.findUnique({ where: { token: refreshToken } });
    if (!tokenInDb || tokenInDb.active !== true) {
      throw new UnauthorizedException('Refresh token not valid');
    }

    const account = await this.prisma.account.findUnique({ where: { id: decoded.accountId } });
    if (!account) throw new UnauthorizedException('Account not found');

    const user = await this.prisma.user.findUnique({ where: { id: account.user_id, deleted: false } });
    if (!user) throw new UnauthorizedException('User not found');

    const accessToken = signAccessToken({
      uid: account.user_id,
      account_role: account.role,
      user_role: user.role,
      major_id: user.major_id ? user.major_id : null,
    });

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await this.prisma.jwtToken.updateMany({
      where: { token: refreshToken },
      data: { active: false },
    });
    return { message: 'Logged out successfully' };
  }
}
