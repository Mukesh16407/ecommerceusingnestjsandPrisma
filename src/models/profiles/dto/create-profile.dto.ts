

import { IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
   @IsString()
    email: string;

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
}


