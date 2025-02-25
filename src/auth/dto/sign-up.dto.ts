import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class signUpDto {
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

  // @IsNotEmpty()
  // @IsNumber()
  // @Length(9)
  // phoneNumber: number;
}
