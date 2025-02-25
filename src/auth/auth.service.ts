import { BadRequestException, Injectable } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: signUpDto) {
    const existUser = await this.usersService.findOneByEmail(signUpDto.email);
    if (existUser) throw new BadRequestException('user already exist');
    const hashedPass = await bcrypt.hash(signUpDto.password, 10);
    console.log(hashedPass);
    await this.usersService.create({ ...signUpDto, password: hashedPass });
    return 'user registered succesfully';
  }

  async signIn(SignInDto: SignInDto) {
    const existUser = await this.usersService.findOneByEmail(SignInDto.email);
    if (!existUser) throw new BadRequestException('Invalid Credentials');
    const isPassEqual = await bcrypt.compare(
      SignInDto.password,
      existUser.password,
    );
    if (!isPassEqual) throw new BadRequestException('Invalid Credentials');
    const payLoad = {
      userId: existUser._id,
    };

    const accesToken = await this.jwtService.sign(payLoad, { expiresIn: '1h' });
    return { accesToken };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    return user;
  }
}
