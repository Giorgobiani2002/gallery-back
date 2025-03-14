import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { signUpBuyerDto } from './dto/sign-upBuyer.dto.js';
import { SignInDto } from './dto/sign-in-dto.js';
import { authGuard } from './guards/auth.guard.js';
import { GoogleAuthGuard } from './guards/google-oauth.guard.js';
import { signUpSellerDto } from './dto/sign-upSeller.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up/buyer')
  signUpBuyer(@Body() signUpBuyerDto: signUpBuyerDto) {
    return this.authService.signUpBuyer(signUpBuyerDto);
  }
  @Post('sign-up/seller')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }
  signUpSeller(@Body() signUpSellerDto: signUpSellerDto) {
    return this.authService.signUpSeller(signUpSellerDto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async signInWithGoogle() {
    return 'hello';
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {}

  @Post('sign-in')
  signIn(@Body() SignInDto: SignInDto) {
    return this.authService.signIn(SignInDto);
  }

  // @UseGuards(authGuard)
  @Get('/current-user')
  getCurrentUser(@Req() request) {
    const userId = request.userId;
    console.log(userId);
    return this.authService.getCurrentUser(userId);
  }
  @Get('/users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }
}
