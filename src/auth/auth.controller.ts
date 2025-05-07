import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpBuyerDto } from './dto/sign-upBuyer.dto';
import { SignInDto } from './dto/sign-in-dto';
import { authGuard } from './guards/auth.guard';
import { GoogleAuthGuard } from './guards/google-oauth.guard';
import { signUpSellerDto } from './dto/sign-upSeller.dto';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { AwsS3Service } from 'src/upload/aws-s3.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private s3Service: AwsS3Service,
  ) {}

  @Post('sign-up/buyer')
  signUpBuyer(@Body() signUpBuyerDto: signUpBuyerDto) {
    return this.authService.signUpBuyer(signUpBuyerDto);
  }

  @Post('sign-up/seller')
  @UseInterceptors(FilesInterceptor('files'))
  async signUpSeller(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() signUpSellerDto: signUpSellerDto,
  ) {
    console.log(files, 'files');
    const UploadedFiles = [];
    for (const file of files) {
      const path = Math.random().toString().slice(2);
      const filePath = `images/${path}`;

      await this.s3Service.uploadFile(filePath, file);

      const uploadedImg = await this.s3Service.generateSignedUrl(path);

      UploadedFiles.push(uploadedImg);
    }

    console.log(UploadedFiles);

    return this.authService.signUpSeller(signUpSellerDto, UploadedFiles);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async signInWithGoogle() {
    return 'hello';
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req,@Res() res) {
    const token  = await  this.authService.signInWithGoogle(req.user)
    res.redirect(`${process.env.FRONT_URL}?token=${token}`)
  }

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
