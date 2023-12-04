import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'Must be an e-mail' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must have a length of at least 8' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
        message: 'Password must contain at least 1 number and 1 letter',
    })
    password: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    address?: string;
}


