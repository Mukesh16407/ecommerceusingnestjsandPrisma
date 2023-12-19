import { Prisma } from '@prisma/client';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';

/** Describes the properties of a User in the database */
export class Profile implements Prisma.ProfileCreateInput {
  id?: string;
  userId: string;
  addressLine1: string;
  addressLine2?: string;
  state: string;
  city: string;
  company: string;
  zipCode: string;
  phoneNumber: string;
  latitude: string;
  longitude: string;
  user: { create: CreateUserDto }; // Use the 'create' property for nested creation
}