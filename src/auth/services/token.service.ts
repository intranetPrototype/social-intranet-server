import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Tokens } from '../types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async getTokens(userId: number, email: string, role: UserRole[]): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId,
        email,
        role
      }, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: 60 * 15            // Valid for 15 minutes
      }),
      this.jwtService.signAsync({
        sub: userId,
        email,
        role
      }, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: 60 * 60 * 24 * 7   // Valid for one week
      })
    ]);

    return {
      access_token,
      refresh_token
    };
  }

  async getConfirmationToken(email: string): Promise<string> {
    return this.jwtService.signAsync({
      email
    }, {
      secret: this.configService.get('CONFIRM_TOKEN_SECRET'),
      expiresIn: 60 * 60 * 24       // Valid for one day
    });
  }

}
