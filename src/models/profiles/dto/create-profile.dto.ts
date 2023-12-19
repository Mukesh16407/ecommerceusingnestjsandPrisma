import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';

export class CreateProfileDto {
  @IsString()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  company: string;

  @IsString()
  zipCode: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  user: CreateUserDto;
}