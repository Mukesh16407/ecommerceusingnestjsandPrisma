import { JwtSignOptions } from '@nestjs/jwt';
require('dotenv').config()

export const accessJwtConfig: JwtSignOptions = {
  secret: process.env.ACCESS_JWT_SECRET,
  expiresIn: '1d',
};


export const refreshJwtConfig: JwtSignOptions = {
  secret: process.env.REFRESH_JWT_SECRET,
  expiresIn: '90d',
};