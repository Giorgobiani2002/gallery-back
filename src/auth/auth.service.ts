import { BadRequestException, Injectable } from '@nestjs/common';
import { signUpBuyerDto } from './dto/sign-upBuyer.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in-dto';
import { JwtService } from '@nestjs/jwt';
import { signUpSellerDto } from './dto/sign-upSeller.dto';
import { Role } from 'src/enums/roles.enum';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { Subject } from 'rxjs';
import { text } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private EmailSenderService: EmailSenderService,
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

  async signUpSeller(signUpDto: signUpSellerDto, UploadedFiles: string[]) {
    const existUser = await this.usersService.findOneByEmail(signUpDto.email);

    if (existUser) throw new BadRequestException('user already exist');

    const hashedPass = await bcrypt.hash(signUpDto.password, 10);

    // console.log(hashedPass);

    await this.usersService.create({
      ...signUpDto,
      password: hashedPass,
      role: Role.SELLER,
    });

    const { email } = signUpDto;
    console.log(email, 'email-dto');

    await this.EmailSenderService.sendEmailHtml(
      email,
      'Verify Your Seller Account',
      `
      <html>
        <body>
          <h1>Welcome to Our Platform!</h1>
          <p>To complete the verification of your seller account, please click the link below:</p>
          <p><a href="https://your-verification-link.com">Verify Account</a></p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,<br>The Team</p>
        </body>
      </html>
      `,
    );

    await this.EmailSenderService.sendEmailHtmltoAdmin(
      'nozadzegiorgi1011@gmail.com',
      'New User Register',
      email,
      UploadedFiles,
    );

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

    if (existUser.role === 'seller' && existUser.verification === false)
      throw new BadRequestException('you need verification to Sign In');

    const payLoad = {
      userId: existUser._id,
      userName: existUser.fullName,
      userRole: existUser.role,
    };

    const accesToken = await this.jwtService.sign(payLoad, { expiresIn: '1h' });
    return { accesToken };
  }
  async signInWithGoogle(user) {
    let existUser = await this.usersService.findOneByEmail(user.email);

    if (!existUser) {
      existUser = await this.usersService.create(user);
    }

    const payLoad = {
      userId: existUser._id,
    };
    console.log(payLoad, 'es aris payloadi');

    const accessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });

    return accessToken;
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    return user;
  }
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
