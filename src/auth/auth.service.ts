import { BadRequestException, Injectable } from '@nestjs/common';
import { signUpBuyerDto } from './dto/sign-upBuyer.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in-dto';
import { JwtService } from '@nestjs/jwt';
import { signUpSellerDto } from './dto/sign-upSeller.dto';
import { Role } from 'src/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUpBuyer(signUpDto: signUpBuyerDto) {
    const existUser = await this.usersService.findOneByEmail(signUpDto.email);
    if (existUser) throw new BadRequestException('user already exist');
    const hashedPass = await bcrypt.hash(signUpDto.password, 10);
    console.log(hashedPass);
    await this.usersService.create({
      ...signUpDto,
      password: hashedPass,
      role: Role.BUYER,
    });
    return 'user registered succesfully';
  }
  async signUpSeller(signUpDto: signUpSellerDto) {
    const existUser = await this.usersService.findOneByEmail(signUpDto.email);

    if (existUser) throw new BadRequestException('user already exist');

    const hashedPass = await bcrypt.hash(signUpDto.password, 10);

    console.log(hashedPass);

    await this.usersService.create({
      ...signUpDto,
      password: hashedPass,
      role: Role.SELLER,
    });

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

    if (existUser.verification === false)
      throw new BadRequestException('you need verification to Sign In');

    const payLoad = {
      userId: existUser._id,
      userName: existUser.fullName,
      userRole: existUser.role,
    };

    const accesToken = await this.jwtService.sign(payLoad, { expiresIn: '1h' });
    return { accesToken };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    return user;
  }
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
