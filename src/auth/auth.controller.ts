import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in-dto';
import { authGuard } from './guards/auth.guard';
import { GoogleAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: signUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async signInWithGoogle() {
    return "hello"
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
