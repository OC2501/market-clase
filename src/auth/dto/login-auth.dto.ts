import { PartialType } from '@nestjs/mapped-types';
import { RegisterAuthDto } from './create-auth.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto extends PartialType(RegisterAuthDto) {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}
