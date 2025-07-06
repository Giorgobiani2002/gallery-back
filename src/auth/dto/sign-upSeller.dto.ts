import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  isNumber,
  isString,
} from 'class-validator';
import { Role } from 'src/enums/roles.enum';

export class signUpSellerDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  fullNameGEO: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @Length(9)
  phoneNumber: number;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  passwordRepeat: string;

  // @IsNotEmpty()
  // @IsString()
  // photoUrl:string;

  role: string = Role.SELLER;
}
