import { JwtSignOptions } from '@nestjs/jwt';
require('dotenv').config()

export const accessJwtConfig: JwtSignOptions = {
  secret: process.env.ACCESS_JWT_SECRET,
  expiresIn: '60s',
};


export const refreshJwtConfig: JwtSignOptions = {
  secret: process.env.REFRESH_JWT_SECRET,
  expiresIn: '240s',
};