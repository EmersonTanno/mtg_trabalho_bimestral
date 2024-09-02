import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.roles) {
      throw new UnauthorizedException('User roles not found');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.userId, username: user.username, roles: user.roles };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
