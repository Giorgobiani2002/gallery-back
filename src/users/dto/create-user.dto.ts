import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  isString,
} from 'class-validator';
import { Role } from 'src/enums/roles.enum.js';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;
  @IsNotEmpty()
  @IsString()
  role: Role;

  // @IsNotEmpty()
  // @IsNumber()
  // @Length(9)
  // phoneNumber: number;
}
