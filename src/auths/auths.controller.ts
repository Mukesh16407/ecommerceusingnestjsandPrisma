import { Controller, Post, Body,  HttpCode, HttpStatus,Req } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { ApiTags ,ApiOperation, ApiBearerAuth} from '@nestjs/swagger';
import { Public } from './public.decorator';
import { Request } from 'express';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { LoginResponse } from './dto/login.response';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@ApiTags('authentication')
@Controller()
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

 /** Authenticates the User */
@ApiOperation({ summary: 'Logs in user' })
@Public()
@Post('login')
@HttpCode(HttpStatus.OK)

async login(@Body() { email, password }: LoginCredentialsDto, @Req() request: Request): Promise<LoginResponse>{
 
  const browserInfo =
  `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(
    / undefined/g,
    '',
  );
 
  return this.authsService.login(email, password, browserInfo);

 }

  /** Refreshes the user token for silent authentication */
  @ApiOperation({ summary: 'Refreshes user token' })
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto,
    @Req() request: Request,
  ): Promise<LoginResponse> {
    const browserInfo =
      `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(
        / undefined/g,
        '',
      );

    return this.authsService.refreshToken(refreshToken, browserInfo);
  }
   /** Logs out the User from the current session */
   @ApiOperation({ summary: 'Logs out user' })
   @ApiBearerAuth()
   @Post('logout')
   @HttpCode(HttpStatus.OK)
   async logout(@Body() { refreshToken }: LogoutDto): Promise<void> {
    
     return this.authsService.logout(refreshToken);
   }
}
