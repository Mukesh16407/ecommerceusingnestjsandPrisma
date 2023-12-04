import {  Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './dto/login.response';
import { User } from 'src/models/users/entities/user.entity';
import { UserService } from 'src/models/users/users.service';
import { v4 as uuidV4 } from 'uuid';
import { accessJwtConfig, refreshJwtConfig } from 'src/config/jwt.config';
import { getTokenExpirationDate } from 'src/util/getTokenExpirationDate';
import { RefreshTokenPayload } from './types/refresh-token-payload';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token.exception';
import { UserTokens } from '@prisma/client';
@Injectable()
export class AuthsService {
  constructor(private prismaService:PrismaService,
    private readonly jwtService:JwtService,
    private readonly userService: UserService, ){}

    async login(
      email: string,
      password: string,
      browserInfo?: string,
    ): Promise<LoginResponse>{

      const user = await this.validateUser(email, password);

      const payload = { sub: user.id, userRole: user.role };
    
      const accessToken = await this.generateAccessToken(payload);
      
      const refreshToken = await this.createRefreshToken(
        { sub: payload.sub },
        browserInfo,
      );
      return {
        accessToken,
        refreshToken,
      };
      
    }
    /** Refreshes and rotates user's access and refresh tokens */
  async refreshToken(
    refreshToken: string,
    browserInfo?: string,
  ): Promise<LoginResponse> {
    const refreshTokenContent: RefreshTokenPayload =
    await this.jwtService.verifyAsync(refreshToken, refreshJwtConfig);
    await this.validateRefreshToken(refreshToken, refreshTokenContent);

    const userRole = await this.getUserRole(refreshTokenContent.sub);
  
    const accessToken = await this.generateAccessToken({
      sub: refreshTokenContent.sub,
      userRole,
    });

    const newRefreshToken = await this.rotateRefreshToken(
      refreshToken,
      refreshTokenContent,
      browserInfo,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

   /** Deletes the refreshToken from the database*/
   async logout(refreshToken: string): Promise<void> {
    await this.prismaService.userTokens.deleteMany({ where: { refreshToken } });
  }
 /** Returns all user's active tokens */
 async findAllTokens(userId: string): Promise<UserTokens[]> {
  const tokens = await this.prismaService.userTokens.findMany({
    where: { userId },
  });

  return tokens;
}
    private async validateUser(email: string, password: string): Promise<User>{

      try {
        const user = await this.userService.findByEmail(email);
      
        if (user) {
          const isPasswordValid = await compare(password, user.password);
          

          if (isPasswordValid) {
            return { ...user, password: undefined };
          }
        }
       
      } catch (error) {
        // Handle any other errors that might occur
        console.error('Error validating user:', error);
      
      }

    }

    private async generateAccessToken(payload:{
      sub: string;
      userRole: string;
    }): Promise<string> {

      const accessToken = await this.jwtService.signAsync(
        payload,
        accessJwtConfig,
      );
      return accessToken;
    }

    private async createRefreshToken(payload:{
      sub: string;
      tokenFamily?: string;
    },browserInfo?:string): Promise<string> {
      if (!payload.tokenFamily) {
        payload.tokenFamily = uuidV4();
      }
      const refreshToken = await this.jwtService.signAsync(
        { ...payload },
        refreshJwtConfig,
      );
      await this.saveRefreshToken({
        userId: payload.sub,
        refreshToken,
        family: payload.tokenFamily,
        browserInfo,
      });
  
      return refreshToken;
    }

    private async saveRefreshToken(refreshTokenCredentials: {
      userId: string;
      refreshToken: string;
      family: string;
      browserInfo?: string;}):Promise<void>{
        const expiresAt = getTokenExpirationDate();

        await this.prismaService.userTokens.create({
          data: { ...refreshTokenCredentials, expiresAt },
        });
    
      }

        /** Checks if the refresh token is valid */
  private async validateRefreshToken(
    refreshToken: string,
    refreshTokenContent: RefreshTokenPayload,
  ): Promise<boolean> {
    const userTokens = await this.prismaService.userTokens.findMany({
      where: { userId: refreshTokenContent.sub, refreshToken },
    });

    const isRefreshTokenValid = userTokens.length > 0;

    if (!isRefreshTokenValid) {
      await this.removeRefreshTokenFamilyIfCompromised(
        refreshTokenContent.sub,
        refreshTokenContent.tokenFamily,
      );

      throw new InvalidRefreshTokenException();
    }

    return true;
  }
  private async rotateRefreshToken(
    refreshToken: string,
    refreshTokenContent: RefreshTokenPayload,
    browserInfo?: string,
  ): Promise<string> {
    await this.prismaService.userTokens.deleteMany({ where: { refreshToken } });

    const newRefreshToken = await this.createRefreshToken(
      {
        sub: refreshTokenContent.sub,
        tokenFamily: refreshTokenContent.tokenFamily,
      },
      browserInfo,
    );

    return newRefreshToken;
  }


  private async removeRefreshTokenFamilyIfCompromised(
    userId: string,
    tokenFamily: string,
  ): Promise<void> {
    const familyTokens = await this.prismaService.userTokens.findMany({
      where: { userId, family: tokenFamily },
    });

    if (familyTokens.length > 0) {
      await this.prismaService.userTokens.deleteMany({
        where: { userId, family: tokenFamily },
      });
    }
  }
  private async getUserRole(userId: string): Promise<string> {
    const user = await this.userService.findById(userId);
    return user.role;
  }
}
